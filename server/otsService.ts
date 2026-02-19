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
    const info = parseOtsProof(proofBytes);

    if (info.bitcoinAttestations.length > 0) {
      return {
        upgraded: false,
        proofData: proofDataBase64,
        status: "confirmed",
      };
    }

    if (info.calendarUrls.length === 0) {
      return {
        upgraded: false,
        proofData: proofDataBase64,
        status: "pending",
        error: "No calendar URLs found in proof",
      };
    }

    // Try each calendar URL to get upgraded proof
    for (const url of info.calendarUrls) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(url, {
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

          // Rebuild the OTS file with the upgraded attestation
          const upgradedProof = replaceCalendarAttestation(
            proofBytes,
            info,
            upgradedData
          );

          if (upgradedProof) {
            const upgradedInfo = parseOtsProof(upgradedProof);
            const isConfirmed = upgradedInfo.bitcoinAttestations.length > 0;

            return {
              upgraded: true,
              proofData: upgradedProof.toString("base64"),
              status: isConfirmed ? "confirmed" : "pending",
            };
          }
        }
        // 404 means not yet confirmed, try next calendar
      } catch (err: any) {
        console.warn(`OTS upgrade from ${url} failed: ${err.message}`);
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
 * Parse an OTS proof to extract attestation info.
 */
export function parseOtsProof(proofBytes: Buffer): OtsProofInfo {
  const info: OtsProofInfo = {
    status: "unknown",
    calendarUrls: [],
    bitcoinAttestations: [],
  };

  try {
    // Scan for attestation tags in the proof data
    for (let i = 0; i < proofBytes.length - ATTESTATION_TAG_SIZE; i++) {
      const slice = proofBytes.subarray(i, i + ATTESTATION_TAG_SIZE);

      if (slice.equals(PENDING_ATTESTATION_TAG)) {
        // Pending attestation: followed by varint length + URL
        const urlStart = i + ATTESTATION_TAG_SIZE;
        const { value: urlLen, bytesRead } = decodeVarint(
          proofBytes,
          urlStart
        );
        if (urlLen > 0 && urlLen < 500) {
          const url = proofBytes
            .subarray(urlStart + bytesRead, urlStart + bytesRead + urlLen)
            .toString("utf-8");
          if (url.startsWith("http")) {
            info.calendarUrls.push(url);
          }
        }
      }

      if (slice.equals(BITCOIN_ATTESTATION_TAG)) {
        // Bitcoin attestation: followed by varint block height
        const blockStart = i + ATTESTATION_TAG_SIZE;
        const { value: blockHeight } = decodeVarint(proofBytes, blockStart);
        if (blockHeight > 0) {
          info.bitcoinAttestations.push({ blockHeight });
        }
      }
    }

    if (info.bitcoinAttestations.length > 0) {
      info.status = "confirmed";
    } else if (info.calendarUrls.length > 0) {
      info.status = "pending";
    }
  } catch (err) {
    console.warn("Error parsing OTS proof:", err);
  }

  return info;
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
 * Replace the pending calendar attestation with upgraded data.
 * Returns the new proof bytes, or null if replacement failed.
 */
function replaceCalendarAttestation(
  originalProof: Buffer,
  info: OtsProofInfo,
  upgradedData: Buffer
): Buffer | null {
  try {
    // Find the pending attestation in the proof and replace it
    // with the upgraded calendar response data
    for (let i = 0; i < originalProof.length - ATTESTATION_TAG_SIZE; i++) {
      const slice = originalProof.subarray(i, i + ATTESTATION_TAG_SIZE);
      if (slice.equals(PENDING_ATTESTATION_TAG)) {
        // Replace from the attestation tag onward with upgraded data
        const before = originalProof.subarray(0, i);
        return Buffer.concat([before, upgradedData]);
      }
    }

    return null;
  } catch {
    return null;
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
