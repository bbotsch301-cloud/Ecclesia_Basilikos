import { Request, Response, NextFunction } from "express";
import { randomBytes } from "crypto";

const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";
const TOKEN_LENGTH = 32;

/**
 * Double-submit cookie CSRF protection.
 *
 * - On every response, if no CSRF cookie exists yet, set one.
 * - On state-changing requests (POST / PUT / PATCH / DELETE), verify
 *   that the request header `x-csrf-token` matches the cookie value.
 * - GET / HEAD / OPTIONS are safe methods and are always allowed.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Ensure a CSRF cookie is always present
  let token = req.cookies?.[CSRF_COOKIE];
  if (!token) {
    token = randomBytes(TOKEN_LENGTH).toString("hex");
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false, // JS must be able to read it to send in header
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  // Safe methods — no check needed
  const safeMethod = ["GET", "HEAD", "OPTIONS"].includes(req.method);
  if (safeMethod) return next();

  // State-changing request — validate token
  const headerToken = req.headers[CSRF_HEADER] as string | undefined;
  if (!headerToken || headerToken !== token) {
    return res.status(403).json({ error: "Invalid or missing CSRF token" });
  }

  next();
}
