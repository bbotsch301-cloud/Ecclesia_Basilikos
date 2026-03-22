import { Response } from "express";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import { createReadStream } from "fs";
import path from "path";
import { lookup } from "mime-types";
import logger from "./logger";

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export class ObjectStorageService {
  constructor() {}

  getPublicObjectSearchPaths(): Array<string> {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p.length > 0)
      )
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Set it to a comma-separated list of directories."
      );
    }
    return paths;
  }

  getPrivateObjectDir(): string {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Set it to the private object storage directory."
      );
    }
    return dir;
  }

  /** Search for a public object across configured search paths. */
  async searchPublicObject(filePath: string): Promise<string | null> {
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = path.resolve(searchPath, filePath);

      // Prevent directory traversal
      if (!fullPath.startsWith(path.resolve(searchPath))) {
        continue;
      }

      try {
        await fs.access(fullPath);
        return fullPath;
      } catch {
        // File not found in this search path, try next
      }
    }
    return null;
  }

  /** Stream a local file to the response. */
  async downloadObject(filePath: string, res: Response, cacheTtlSec: number = 3600) {
    try {
      const stat = await fs.stat(filePath);
      const contentType = lookup(filePath) || "application/octet-stream";

      res.set({
        "Content-Type": contentType,
        "Content-Length": String(stat.size),
        "Cache-Control": `public, max-age=${cacheTtlSec}`,
      });

      const stream = createReadStream(filePath);
      stream.on("error", (err) => {
        logger.error({ err }, "Stream error");
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming file" });
        }
      });
      stream.pipe(res);
    } catch (error) {
      logger.error({ err: error }, "Error downloading file:");
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }

  /**
   * Generate a server-side upload token/path.
   * Returns a path like `/api/objects/upload/<token>` that the client can PUT/POST to.
   */
  async getObjectEntityUploadURL(): Promise<string> {
    const privateObjectDir = this.getPrivateObjectDir();
    const objectId = randomUUID();

    // Ensure the uploads directory exists
    const uploadsDir = path.join(privateObjectDir, "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    return `/api/objects/upload/${objectId}`;
  }

  /** Resolve an object entity path to an absolute filesystem path. */
  async getObjectEntityFile(objectPath: string): Promise<string> {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }

    const parts = objectPath.slice(1).split("/");
    if (parts.length < 2) {
      throw new ObjectNotFoundError();
    }

    const entityId = parts.slice(1).join("/");
    const entityDir = this.getPrivateObjectDir();
    const fullPath = path.resolve(entityDir, entityId);

    // Prevent directory traversal
    if (!fullPath.startsWith(path.resolve(entityDir))) {
      throw new ObjectNotFoundError();
    }

    try {
      await fs.access(fullPath);
    } catch {
      throw new ObjectNotFoundError();
    }

    return fullPath;
  }

  /** Normalize an object entity path (strips any legacy URL prefix). */
  normalizeObjectEntityPath(rawPath: string): string {
    // If it's already a local /objects/ path, return as-is
    if (rawPath.startsWith("/objects/")) {
      return rawPath;
    }

    // Handle legacy Google Cloud Storage URLs
    if (rawPath.startsWith("https://storage.googleapis.com/")) {
      const url = new URL(rawPath);
      const rawObjectPath = url.pathname;
      let objectEntityDir = this.getPrivateObjectDir();
      if (!objectEntityDir.endsWith("/")) {
        objectEntityDir = `${objectEntityDir}/`;
      }
      if (rawObjectPath.startsWith(objectEntityDir)) {
        const entityId = rawObjectPath.slice(objectEntityDir.length);
        return `/objects/${entityId}`;
      }
      return rawObjectPath;
    }

    return rawPath;
  }
}
