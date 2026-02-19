import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { createHash } from "crypto";
import archiver from "archiver";
import { db } from "./db";
import { proofs, createProofHashSchema } from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { requireAuth } from "./auth";
import {
  stampHash,
  upgradeProof,
  verifyProof,
  getProofInfo,
} from "./otsService";

const router = Router();

// --- Rate limiting (in-memory, per-user) ---

const rateLimitMap = new Map<
  string,
  { count: number; resetAt: number }
>();

function checkRateLimit(
  userId: string,
  limit = 20,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((entry, key) => {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  });
}, 5 * 60_000);

// --- Multer config ---

const MAX_FILE_SIZE = parseInt(
  process.env.PROOF_VAULT_MAX_FILE_SIZE || String(50 * 1024 * 1024),
  10
);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    // Basic sanity check - reject obviously dangerous file names
    if (file.originalname.includes("..") || file.originalname.includes("/")) {
      cb(new Error("Invalid filename"));
      return;
    }
    cb(null, true);
  },
});

// Middleware to conditionally apply multer for multipart requests
function conditionalUpload(req: Request, res: Response, next: NextFunction) {
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart")) {
    upload.single("file")(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
              error: `File too large. Maximum size: ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`,
            });
          }
          return res.status(400).json({ error: err.message });
        }
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  } else {
    next();
  }
}

// All routes require auth
router.use(requireAuth);

// --- POST /proofs - Create a new proof ---

router.post("/proofs", conditionalUpload, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    if (!checkRateLimit(userId, 10, 60_000)) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please wait before creating more proofs.",
      });
    }

    let sha256Hex: string;
    let mode: "file" | "hash";
    let originalFilename: string | null = null;
    let mimeType: string | null = null;
    let sizeBytes: number | null = null;
    let label: string | null = null;

    if (req.file) {
      // File mode: compute SHA-256 from uploaded file
      mode = "file";
      const hash = createHash("sha256").update(req.file.buffer).digest("hex");
      sha256Hex = hash;
      originalFilename = req.file.originalname;
      mimeType = req.file.mimetype;
      sizeBytes = req.file.size;
      label = req.body?.label || null;
    } else {
      // Hash-only mode: user provides SHA-256
      mode = "hash";
      const parsed = createProofHashSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid input. Provide a valid SHA-256 hex string.",
          details: parsed.error.flatten(),
        });
      }
      sha256Hex = parsed.data.sha256.toLowerCase();
      label = parsed.data.label || null;
    }

    // Create OTS timestamp
    const otsResult = await stampHash(sha256Hex);

    // Insert proof record
    const [proof] = await db
      .insert(proofs)
      .values({
        userId,
        mode,
        originalFilename,
        mimeType,
        sizeBytes,
        sha256: sha256Hex,
        provider: "opentimestamps",
        status: otsResult.status,
        otsProof: otsResult.proofData || null,
        label,
        errorMessage: otsResult.error || null,
      })
      .returning();

    res.status(201).json(proof);
  } catch (error: any) {
    console.error("Error creating proof:", error);
    res.status(500).json({ error: "Failed to create proof" });
  }
});

// --- GET /proofs - List user's proofs ---

router.get("/proofs", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const statusFilter = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    let query = db
      .select()
      .from(proofs)
      .where(eq(proofs.userId, userId))
      .orderBy(desc(proofs.createdAt));

    const results = await query;

    // Apply filters in memory (simple for MVP)
    let filtered = results;
    if (statusFilter && ["pending", "confirmed", "failed"].includes(statusFilter)) {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.sha256.toLowerCase().includes(s) ||
          p.originalFilename?.toLowerCase().includes(s) ||
          p.label?.toLowerCase().includes(s)
      );
    }

    res.json(filtered);
  } catch (error: any) {
    console.error("Error listing proofs:", error);
    res.status(500).json({ error: "Failed to list proofs" });
  }
});

// --- GET /proofs/:id - Get a single proof ---

router.get("/proofs/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const [proof] = await db
      .select()
      .from(proofs)
      .where(and(eq(proofs.id, req.params.id), eq(proofs.userId, userId)));

    if (!proof) {
      return res.status(404).json({ error: "Proof not found" });
    }

    // Enrich with OTS info
    let otsInfo = null;
    if (proof.otsProof) {
      otsInfo = getProofInfo(proof.otsProof);
    }

    res.json({ ...proof, otsInfo });
  } catch (error: any) {
    console.error("Error fetching proof:", error);
    res.status(500).json({ error: "Failed to fetch proof" });
  }
});

// --- POST /proofs/:id/upgrade - Upgrade a pending proof ---

router.post("/proofs/:id/upgrade", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    if (!checkRateLimit(userId + ":upgrade", 30, 60_000)) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please wait before upgrading more proofs.",
      });
    }

    const [proof] = await db
      .select()
      .from(proofs)
      .where(and(eq(proofs.id, req.params.id), eq(proofs.userId, userId)));

    if (!proof) {
      return res.status(404).json({ error: "Proof not found" });
    }

    if (proof.status === "confirmed") {
      return res.json({ message: "Proof is already confirmed", proof });
    }

    if (!proof.otsProof) {
      return res.status(400).json({
        error: "No OTS proof data available. Proof creation may have failed.",
      });
    }

    const result = await upgradeProof(proof.otsProof);

    // Update the proof record
    const [updated] = await db
      .update(proofs)
      .set({
        status: result.status,
        otsProof: result.proofData,
        lastUpgradeAttemptAt: new Date(),
        updatedAt: new Date(),
        errorMessage: result.error || null,
      })
      .where(eq(proofs.id, proof.id))
      .returning();

    res.json({
      message: result.upgraded
        ? result.status === "confirmed"
          ? "Proof confirmed on Bitcoin blockchain!"
          : "Proof upgraded but not yet fully confirmed."
        : result.status === "pending"
          ? "Not yet confirmed on Bitcoin. Timestamps typically take a few hours. Try again later."
          : result.error || "Upgrade failed",
      proof: updated,
      status: result.status,
    });
  } catch (error: any) {
    console.error("Error upgrading proof:", error);
    res.status(500).json({ error: "Failed to upgrade proof" });
  }
});

// --- POST /proofs/upgrade-all - Upgrade all pending proofs for user ---

router.post("/proofs/upgrade-all", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    if (!checkRateLimit(userId + ":upgrade-all", 2, 60_000)) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please wait before bulk upgrading.",
      });
    }

    const pendingProofs = await db
      .select()
      .from(proofs)
      .where(and(eq(proofs.userId, userId), eq(proofs.status, "pending")));

    let upgraded = 0;
    let failed = 0;
    let unchanged = 0;

    for (const proof of pendingProofs) {
      if (!proof.otsProof) {
        failed++;
        continue;
      }
      try {
        const result = await upgradeProof(proof.otsProof);
        await db
          .update(proofs)
          .set({
            status: result.status,
            otsProof: result.proofData,
            lastUpgradeAttemptAt: new Date(),
            updatedAt: new Date(),
            errorMessage: result.error || null,
          })
          .where(eq(proofs.id, proof.id));

        if (result.upgraded) upgraded++;
        else unchanged++;
      } catch {
        failed++;
      }
    }

    res.json({
      message: `Processed ${pendingProofs.length} proofs: ${upgraded} upgraded, ${unchanged} unchanged, ${failed} failed`,
      upgraded,
      unchanged,
      failed,
      total: pendingProofs.length,
    });
  } catch (error: any) {
    console.error("Error upgrading all proofs:", error);
    res.status(500).json({ error: "Failed to upgrade proofs" });
  }
});

// --- POST /verify - Verify a file or hash against a proof ---

router.post("/verify", conditionalUpload, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    if (!checkRateLimit(userId + ":verify", 20, 60_000)) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please wait before verifying more proofs.",
      });
    }

    let sha256Hex: string;

    if (req.file) {
      sha256Hex = createHash("sha256").update(req.file.buffer).digest("hex");
    } else if (req.body?.sha256) {
      const parsed = createProofHashSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid SHA-256 hash",
          details: parsed.error.flatten(),
        });
      }
      sha256Hex = parsed.data.sha256.toLowerCase();
    } else {
      return res.status(400).json({
        error: "Provide a file or SHA-256 hash to verify",
      });
    }

    const proofId = req.body?.proofId;

    // Find matching proofs
    let matchingProofs;
    if (proofId) {
      matchingProofs = await db
        .select()
        .from(proofs)
        .where(
          and(eq(proofs.id, proofId), eq(proofs.userId, userId))
        );
    } else {
      matchingProofs = await db
        .select()
        .from(proofs)
        .where(
          and(eq(proofs.sha256, sha256Hex), eq(proofs.userId, userId))
        );
    }

    if (matchingProofs.length === 0) {
      return res.json({
        found: false,
        hashMatch: false,
        message: proofId
          ? "Proof not found or access denied"
          : "No proof found for this hash",
        sha256: sha256Hex,
      });
    }

    const proof = matchingProofs[0];
    const hashMatch =
      proof.sha256.toLowerCase() === sha256Hex.toLowerCase();

    let otsVerification = null;
    if (proof.otsProof) {
      otsVerification = await verifyProof(proof.otsProof, sha256Hex);
    }

    res.json({
      found: true,
      hashMatch,
      proof: {
        id: proof.id,
        mode: proof.mode,
        originalFilename: proof.originalFilename,
        sha256: proof.sha256,
        status: proof.status,
        provider: proof.provider,
        createdAt: proof.createdAt,
        label: proof.label,
      },
      otsVerification,
      message: hashMatch
        ? proof.status === "confirmed"
          ? "File matches a confirmed timestamped proof"
          : "File matches a pending proof (not yet anchored to Bitcoin)"
        : "Hash does not match the stored proof",
    });
  } catch (error: any) {
    console.error("Error verifying proof:", error);
    res.status(500).json({ error: "Failed to verify proof" });
  }
});

// --- GET /proofs/:id/bundle - Download proof bundle as ZIP ---

router.get("/proofs/:id/bundle", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const [proof] = await db
      .select()
      .from(proofs)
      .where(and(eq(proofs.id, req.params.id), eq(proofs.userId, userId)));

    if (!proof) {
      return res.status(404).json({ error: "Proof not found" });
    }

    // Build receipt JSON
    const receipt = {
      proofVault: {
        version: "1.0",
        generatedAt: new Date().toISOString(),
      },
      proof: {
        id: proof.id,
        mode: proof.mode,
        sha256: proof.sha256,
        status: proof.status,
        provider: proof.provider,
        originalFilename: proof.originalFilename,
        mimeType: proof.mimeType,
        sizeBytes: proof.sizeBytes,
        label: proof.label,
        createdAt: proof.createdAt,
        updatedAt: proof.updatedAt,
        lastUpgradeAttemptAt: proof.lastUpgradeAttemptAt,
      },
      verification: {
        hashAlgorithm: "SHA-256",
        hash: proof.sha256,
        timestampProvider: "OpenTimestamps (Bitcoin)",
        status: proof.status,
        instructions:
          "To independently verify: use the 'ots verify' command with the included proof.ots file",
      },
    };

    const instructions = `Proof Vault - Verification Instructions
========================================

This bundle contains a timestamped proof record for the following file/hash:

  SHA-256: ${proof.sha256}
  ${proof.originalFilename ? `Original filename: ${proof.originalFilename}` : "Mode: Hash-only (no file stored)"}
  Created: ${proof.createdAt?.toISOString() || "Unknown"}
  Status: ${proof.status?.toUpperCase() || "UNKNOWN"}
  ${proof.label ? `Label: ${proof.label}` : ""}

Contents of this bundle:
  - receipt.json    Machine-readable proof receipt
  - proof.ots       OpenTimestamps proof file (binary)
  - instructions.txt  This file

How to verify independently:
  1. Install OpenTimestamps: pip install opentimestamps-client
  2. Run: ots verify proof.ots
  3. Compare the SHA-256 hash in receipt.json with your file:
     - Linux/Mac: sha256sum <your-file>
     - Windows: certutil -hashfile <your-file> SHA256

About OpenTimestamps:
  OpenTimestamps uses the Bitcoin blockchain to create tamper-proof
  timestamps. A "pending" proof has been submitted to calendar servers
  but not yet anchored to Bitcoin (this typically takes a few hours).
  A "confirmed" proof has been permanently recorded in the Bitcoin
  blockchain and can be independently verified by anyone.

  Learn more: https://opentimestamps.org

Status meanings:
  PENDING   - Timestamp submitted, awaiting Bitcoin confirmation
  CONFIRMED - Timestamp anchored to Bitcoin blockchain
  FAILED    - Timestamp submission failed (hash is still recorded)
`;

    // Create ZIP archive
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="proof-${proof.id.slice(0, 8)}-bundle.zip"`
    );

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    archive.append(JSON.stringify(receipt, null, 2), {
      name: "receipt.json",
    });
    archive.append(instructions, { name: "verification_instructions.txt" });

    if (proof.otsProof) {
      const otsBytes = Buffer.from(proof.otsProof, "base64");
      archive.append(otsBytes, { name: "proof.ots" });
    }

    await archive.finalize();
  } catch (error: any) {
    console.error("Error creating bundle:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to create proof bundle" });
    }
  }
});

export default router;
