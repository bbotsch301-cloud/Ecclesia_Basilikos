/**
 * OpenTimestamps Service Wrapper
 *
 * Communicates with OpenTimestamps public calendar servers to create,
 * upgrade, and verify timestamp proofs for SHA-256 hashes.
 *
 * Protocol overview:
 * - POST /digest with raw 32-byte hash → returns OTS proof binary (pending)
 * - GET /timestamp/<commitment-hex> → returns upgraded proof if anchored to Bitcoin
 *
 * The binary OTS proofs returned are standard .ots files that can be
 * independently verified using the `ots` CLI or any OTS-compatible tool.
 *
 * NOTE: Virus scanning is not implemented for MVP. File uploads should be
 * treated as untrusted and not executed or served directly.
 */

import { createHash } from "crypto";

const CALENDAR_URLS = [
  "https://a.pool.opentimestamps.org",
  "https://b.pool.opentimestamps.org",
  "https://a.pool.eternitywall.com",
];

const OTS_HEADER = Buffer.from(
  "\x00OpenTimestamps\x00\x00Proof\x00\xbf\x89\xe2\xe8\x84\xe8\x92\x94",
  "binary"
);
const OTS_VERSION = 0x01;
const OTS_SHA256_TAG = 0x08;

// OTS operation tags
const OP_APPEND = 0xf0;
const OP_PREPEND = 0xf1;
const OP_SHA256 = 0x08;
const OP_KECCAK256 = 0x67;
const OP_RIPEMD160 = 0x03;
const OP_SHA1 = 0x02;
const OP_HEXLIFY = 0xf3;
const OP_REVERSE = 0xf2;

// Attestation tags
const ATTESTATION_TAG_SIZE = 8;
const ATTESTATION_MARKER = 0x00;
const FORK_MARKER = 0xff;
const PENDING_ATTESTATION_TAG = Buffer.from("83dfe30d2ef90c8e", "hex");
const BITCOIN_ATTESTATION_TAG = Buffer.from("0588960d73d71901", "hex");

export interface OtsStampResult {
  proofData: string; // base64-encoded OTS proof binary
  status: "pending" | "failed";
  calendarUrl?: string;
  error?: string;
}

export interface OtsUpgradeResult {
  upgraded: boolean;
  proofData: string; // base64-encoded (possibly upgraded) proof
  status: "pending" | "confirmed" | "failed";
  error?: string;
}

export interface OtsVerifyResult {
  hashMatch: boolean;
  proofValid: boolean;
  status: "confirmed" | "pending" | "invalid";
  bitcoinBlockHeight?: number;
  bitcoinBlockTime?: string;
  details: string;
}

export interface OtsProofInfo {
  status: "pending" | "confirmed" | "unknown";
  calendarUrls: string[];
  bitcoinAttestations: Array<{
    blockHeight: number;
  }>;
}

// --- Detailed parsing types ---

interface ParsedAttestation {
  type: "pending" | "bitcoin";
  calendarUrl?: string;
  commitmentHash?: Buffer; // The computed hash at this point in the chain
  offsetStart: number; // Byte offset where the 0x00 attestation marker begins
  offsetEnd: number; // Byte offset where the attestation ends (exclusive)
  blockHeight?: number;
}

interface DetailedProofInfo {
  valid: boolean;
  fileHash: Buffer;
  attestations: ParsedAttestation[];
}

/**
 * Submit a SHA-256 hash to OpenTimestamps calendar servers.
 * Returns a pending OTS proof.
 */
export async function stampHash(sha256Hex: string): Promise<OtsStampResult> {
  const hashBytes = Buffer.from(sha256Hex, "hex");
  if (hashBytes.length !== 32) {
    return {
      proofData: "",
      status: "failed",
      error: "Invalid SHA-256 hash length",
    };
  }

  // Try each calendar server until one succeeds
  for (const calendarUrl of CALENDAR_URLS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${calendarUrl}/digest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/vnd.opentimestamps.v1",
          "User-Agent": "proof-vault/1.0",
        },
        body: hashBytes,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.warn(
          `OTS calendar ${calendarUrl} returned ${response.status}`
        );
        continue;
      }

      const calendarProof = Buffer.from(await response.arrayBuffer());

      // Build a complete OTS file with header + file hash + calendar proof
      const otsFile = buildOtsFile(hashBytes, calendarProof);

      return {
        proofData: otsFile.toString("base64"),
        status: "pending",
        calendarUrl,
      };
    } catch (err: any) {
      console.warn(
        `OTS calendar ${calendarUrl} failed: ${err.message}`
      );
      continue;
    }
  }

  return {
    proofData: "",
    status: "failed",
    error: "All calendar servers unreachable",
  };
}

/**
 * Build a complete OTS file from the file hash and calendar proof data.
 */
function buildOtsFile(
  hashBytes: Buffer,
  calendarProof: Buffer
): Buffer {
  const parts: Buffer[] = [];

  // Header
  parts.push(OTS_HEADER);
  // Version
  parts.push(Buffer.from([OTS_VERSION]));
  // Hash algorithm tag (SHA256)
  parts.push(Buffer.from([OTS_SHA256_TAG]));
  // Hash value length (varint)
  parts.push(encodeVarint(hashBytes.length));
  // Hash value
  parts.push(hashBytes);
  // Calendar proof data (operations + attestation from calendar server)
  parts.push(calendarProof);

  return Buffer.concat(parts);
}

/**
 * Encode an integer as a varint (used in OTS binary format).
 */
function encodeVarint(n: number): Buffer {
  const bytes: number[] = [];
  while (n > 0x7f) {
    bytes.push((n & 0x7f) | 0x80);
    n >>= 7;
  }
  bytes.push(n);
  return Buffer.from(bytes);
}

/**
 * Attempt to upgrade a pending OTS proof to confirmed status.
 * Contacts calendar servers to check if the timestamp has been
 * anchored to Bitcoin.
 */
export async function upgradeProof(
  proofDataBase64: string
): Promise<OtsUpgradeResult> {
  try {
    const proofBytes = Buffer.from(proofDataBase64, "base64");
    const detailed = parseOtsProofDetailed(proofBytes);

    if (!detailed.valid) {
      return {
        upgraded: false,
        proofData: proofDataBase64,
        status: "failed",
        error: "Invalid OTS proof format",
      };
    }

    // Check if already confirmed
    const bitcoinAttestations = detailed.attestations.filter(a => a.type === "bitcoin");
    if (bitcoinAttestations.length > 0) {
      return {
        upgraded: false,
        proofData: proofDataBase64,
        status: "confirmed",
      };
    }

    const pendingAttestations = detailed.attestations.filter(a => a.type === "pending");
    if (pendingAttestations.length === 0) {
      return {
        upgraded: false,
        proofData: proofDataBase64,
        status: "pending",
        error: "No pending attestations found in proof",
      };
    }

    // Try to upgrade each pending attestation
    for (const pending of pendingAttestations) {
      if (!pending.calendarUrl || !pending.commitmentHash) continue;

      const commitmentHex = pending.commitmentHash.toString("hex");
      const upgradeUrl = `${pending.calendarUrl}/timestamp/${commitmentHex}`;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(upgradeUrl, {
          method: "GET",
          headers: {
            Accept: "application/vnd.opentimestamps.v1",
            "User-Agent": "proof-vault/1.0",
          },
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (response.status === 200) {
          const upgradedData = Buffer.from(await response.arrayBuffer());

          // Replace the pending attestation (from its 0x00 marker onward) with
          // the upgraded attestation chain from the calendar
          const before = proofBytes.subarray(0, pending.offsetStart);
          const upgradedProof = Buffer.concat([before, upgradedData]);

          // Verify the upgraded proof has a bitcoin attestation
          const upgradedInfo = parseOtsProofDetailed(upgradedProof);
          const isConfirmed = upgradedInfo.attestations.some(a => a.type === "bitcoin");

          return {
            upgraded: true,
            proofData: upgradedProof.toString("base64"),
            status: isConfirmed ? "confirmed" : "pending",
          };
        }

        if (response.status === 404) {
          // Not yet confirmed, try next calendar
          continue;
        }

        console.warn(`OTS upgrade from ${upgradeUrl} returned ${response.status}`);
      } catch (err: any) {
        console.warn(`OTS upgrade from ${upgradeUrl} failed: ${err.message}`);
        continue;
      }
    }

    return {
      upgraded: false,
      proofData: proofDataBase64,
      status: "pending",
    };
  } catch (err: any) {
    return {
      upgraded: false,
      proofData: proofDataBase64,
      status: "failed",
      error: `Upgrade failed: ${err.message}`,
    };
  }
}

/**
 * Parse an OTS proof to extract attestation info (simple version).
 * Delegates to the detailed parser for correct binary parsing.
 */
export function parseOtsProof(proofBytes: Buffer): OtsProofInfo {
  const detailed = parseOtsProofDetailed(proofBytes);

  if (!detailed.valid) {
    return { status: "unknown", calendarUrls: [], bitcoinAttestations: [] };
  }

  const calendarUrls = detailed.attestations
    .filter(a => a.type === "pending" && a.calendarUrl)
    .map(a => a.calendarUrl!);

  const bitcoinAttestations = detailed.attestations
    .filter(a => a.type === "bitcoin" && a.blockHeight != null)
    .map(a => ({ blockHeight: a.blockHeight! }));

  let status: "pending" | "confirmed" | "unknown" = "unknown";
  if (bitcoinAttestations.length > 0) {
    status = "confirmed";
  } else if (calendarUrls.length > 0) {
    status = "pending";
  }

  return { status, calendarUrls, bitcoinAttestations };
}

/**
 * Decode a varint from a buffer at the given offset.
 */
function decodeVarint(
  buf: Buffer,
  offset: number
): { value: number; bytesRead: number } {
  let value = 0;
  let shift = 0;
  let bytesRead = 0;

  while (offset + bytesRead < buf.length) {
    const byte = buf[offset + bytesRead];
    value |= (byte & 0x7f) << shift;
    bytesRead++;
    if ((byte & 0x80) === 0) break;
    shift += 7;
    if (shift > 28) break; // prevent overflow
  }

  return { value, bytesRead };
}

/**
 * Parse an OTS proof with full binary format awareness.
 * Walks operations sequentially, replays crypto operations to compute
 * the commitment hash at each attestation point.
 */
function parseOtsProofDetailed(proofBytes: Buffer): DetailedProofInfo {
  const result: DetailedProofInfo = {
    valid: false,
    fileHash: Buffer.alloc(0),
    attestations: [],
  };

  try {
    let offset = 0;

    // 1. Validate header magic
    if (proofBytes.length < OTS_HEADER.length + 1) return result;
    if (!proofBytes.subarray(0, OTS_HEADER.length).equals(OTS_HEADER)) return result;
    offset = OTS_HEADER.length;

    // 2. Read version byte
    const version = proofBytes[offset];
    offset += 1;
    if (version !== OTS_VERSION) return result;

    // 3. Read hash algorithm tag
    const hashAlgorithm = proofBytes[offset];
    offset += 1;
    if (hashAlgorithm !== OTS_SHA256_TAG) return result;

    // 4. Read hash length (varint) and hash bytes
    const { value: hashLen, bytesRead: hashLenBytes } = decodeVarint(proofBytes, offset);
    offset += hashLenBytes;

    if (offset + hashLen > proofBytes.length) return result;
    result.fileHash = Buffer.from(proofBytes.subarray(offset, offset + hashLen));
    offset += hashLen;

    // 5. Parse operations chain, computing intermediate hashes
    const currentHash = Buffer.from(result.fileHash);
    parseOperationChain(proofBytes, offset, currentHash, result);

    result.valid = true;
  } catch (err) {
    console.warn("Error in detailed OTS parse:", err);
  }

  return result;
}

/**
 * Recursively parse an OTS operation chain starting at the given offset.
 * Replays cryptographic operations to compute the commitment hash at
 * each attestation point.
 */
function parseOperationChain(
  proofBytes: Buffer,
  startOffset: number,
  initialHash: Buffer,
  result: DetailedProofInfo
): void {
  let offset = startOffset;
  let currentHash = Buffer.from(initialHash);

  while (offset < proofBytes.length) {
    const tag = proofBytes[offset];

    if (tag === ATTESTATION_MARKER) {
      // Attestation: 0x00 + 8-byte attestation type tag + varint payload
      const attestationMarkerOffset = offset;
      offset += 1; // skip 0x00

      if (offset + ATTESTATION_TAG_SIZE > proofBytes.length) break;
      const attTag = proofBytes.subarray(offset, offset + ATTESTATION_TAG_SIZE);
      offset += ATTESTATION_TAG_SIZE;

      const { value: payloadLen, bytesRead: payloadLenBytes } = decodeVarint(proofBytes, offset);
      offset += payloadLenBytes;

      if (attTag.equals(PENDING_ATTESTATION_TAG)) {
        if (offset + payloadLen <= proofBytes.length) {
          const url = proofBytes.subarray(offset, offset + payloadLen).toString("utf-8");
          offset += payloadLen;

          result.attestations.push({
            type: "pending",
            calendarUrl: url.startsWith("http") ? url : undefined,
            commitmentHash: Buffer.from(currentHash),
            offsetStart: attestationMarkerOffset,
            offsetEnd: offset,
          });
        }
      } else if (attTag.equals(BITCOIN_ATTESTATION_TAG)) {
        // Payload is the block height encoded as a varint
        const { value: blockHeight } = decodeVarint(proofBytes, offset);
        offset += payloadLen; // advance past the full payload

        result.attestations.push({
          type: "bitcoin",
          blockHeight,
          offsetStart: attestationMarkerOffset,
          offsetEnd: offset,
        });
      } else {
        // Unknown attestation type, skip payload
        offset += payloadLen;
      }

      // After an attestation, this branch is done
      break;

    } else if (tag === FORK_MARKER) {
      // Fork: proof tree branches. Parse first branch recursively,
      // then continue parsing the second branch at current level.
      offset += 1; // skip 0xff
      parseOperationChain(proofBytes, offset, currentHash, result);
      // We can't easily determine where the first branch ended without
      // tracking offset through recursion. For single-calendar proofs
      // (which is what we create), there are no forks.
      return;

    } else if (tag === OP_APPEND) {
      offset += 1;
      const { value: dataLen, bytesRead: dataLenBytes } = decodeVarint(proofBytes, offset);
      offset += dataLenBytes;
      const data = proofBytes.subarray(offset, offset + dataLen);
      offset += dataLen;
      currentHash = Buffer.concat([currentHash, data]);

    } else if (tag === OP_PREPEND) {
      offset += 1;
      const { value: dataLen, bytesRead: dataLenBytes } = decodeVarint(proofBytes, offset);
      offset += dataLenBytes;
      const data = proofBytes.subarray(offset, offset + dataLen);
      offset += dataLen;
      currentHash = Buffer.concat([data, currentHash]);

    } else if (tag === OP_SHA256) {
      offset += 1;
      currentHash = createHash("sha256").update(currentHash).digest();

    } else if (tag === OP_RIPEMD160) {
      offset += 1;
      currentHash = createHash("ripemd160").update(currentHash).digest();

    } else if (tag === OP_SHA1) {
      offset += 1;
      currentHash = createHash("sha1").update(currentHash).digest();

    } else if (tag === OP_REVERSE) {
      offset += 1;
      currentHash = Buffer.from(currentHash).reverse();

    } else if (tag === OP_HEXLIFY) {
      offset += 1;
      currentHash = Buffer.from(currentHash.toString("hex"), "utf-8");

    } else if (tag === OP_KECCAK256) {
      // Keccak256 is rarely used in OTS and not natively supported in Node.js crypto
      console.warn("Keccak256 operation encountered, not supported");
      break;

    } else {
      // Unknown tag, stop parsing this branch
      console.warn(`Unknown OTS operation tag: 0x${tag.toString(16)} at offset ${offset}`);
      break;
    }
  }
}

/**
 * Verify an OTS proof for a given SHA-256 hash.
 * Checks if the proof is valid and whether it's been confirmed on Bitcoin.
 */
export async function verifyProof(
  proofDataBase64: string,
  sha256Hex: string
): Promise<OtsVerifyResult> {
  try {
    const proofBytes = Buffer.from(proofDataBase64, "base64");

    // Verify the header
    if (!proofBytes.subarray(0, OTS_HEADER.length).equals(OTS_HEADER)) {
      return {
        hashMatch: false,
        proofValid: false,
        status: "invalid",
        details: "Invalid OTS proof header",
      };
    }

    // Extract hash from proof and compare
    const versionOffset = OTS_HEADER.length;
    const hashTagOffset = versionOffset + 1;
    const hashTag = proofBytes[hashTagOffset];

    if (hashTag !== OTS_SHA256_TAG) {
      return {
        hashMatch: false,
        proofValid: false,
        status: "invalid",
        details: "Proof does not use SHA-256",
      };
    }

    const hashLenOffset = hashTagOffset + 1;
    const { value: hashLen, bytesRead } = decodeVarint(
      proofBytes,
      hashLenOffset
    );
    const hashStart = hashLenOffset + bytesRead;
    const proofHash = proofBytes
      .subarray(hashStart, hashStart + hashLen)
      .toString("hex");

    const hashMatch = proofHash.toLowerCase() === sha256Hex.toLowerCase();

    // Parse attestations
    const info = parseOtsProof(proofBytes);

    if (info.bitcoinAttestations.length > 0) {
      return {
        hashMatch,
        proofValid: true,
        status: "confirmed",
        bitcoinBlockHeight: info.bitcoinAttestations[0].blockHeight,
        details: hashMatch
          ? `Proof confirmed on Bitcoin at block ${info.bitcoinAttestations[0].blockHeight}`
          : "Hash does not match the proof",
      };
    }

    if (info.calendarUrls.length > 0) {
      return {
        hashMatch,
        proofValid: true,
        status: "pending",
        details: hashMatch
          ? "Proof is valid but not yet anchored to Bitcoin. Try upgrading."
          : "Hash does not match the proof",
      };
    }

    return {
      hashMatch,
      proofValid: false,
      status: "invalid",
      details: "No attestations found in proof",
    };
  } catch (err: any) {
    return {
      hashMatch: false,
      proofValid: false,
      status: "invalid",
      details: `Verification error: ${err.message}`,
    };
  }
}

/**
 * Get human-readable info about a proof.
 */
export function getProofInfo(proofDataBase64: string): OtsProofInfo {
  try {
    const proofBytes = Buffer.from(proofDataBase64, "base64");
    return parseOtsProof(proofBytes);
  } catch {
    return {
      status: "unknown",
      calendarUrls: [],
      bitcoinAttestations: [],
    };
  }
}
