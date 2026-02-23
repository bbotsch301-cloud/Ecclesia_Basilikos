import { Request, Response, NextFunction } from "express";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Map<string, RateLimitEntry>>();

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  buckets.forEach((bucket) => {
    bucket.forEach((entry, key) => {
      if (now > entry.resetAt) bucket.delete(key);
    });
  });
}, 5 * 60_000);

/**
 * Creates an Express rate-limiting middleware.
 * @param name   - unique bucket name (e.g. "auth-login")
 * @param limit  - max requests per window
 * @param windowMs - window size in ms
 */
export function rateLimit(name: string, limit: number, windowMs: number) {
  if (!buckets.has(name)) buckets.set(name, new Map());
  const bucket = buckets.get(name)!;

  return (req: Request, res: Response, next: NextFunction) => {
    // Key by IP (forwarded or direct)
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const entry = bucket.get(key);

    if (!entry || now > entry.resetAt) {
      bucket.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= limit) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.set("Retry-After", String(retryAfter));
      return res.status(429).json({
        error: "Too many requests. Please try again later.",
      });
    }

    entry.count++;
    next();
  };
}
