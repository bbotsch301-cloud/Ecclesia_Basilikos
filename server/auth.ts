import session from "express-session";
import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export const sessionMiddleware = session({
  secret: (() => {
    const secret = process.env.SESSION_SECRET;
    if (!secret) throw new Error("SESSION_SECRET env var is required");
    return secret;
  })(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
});

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  const user = await storage.getUser(req.session.userId);
  if (!user) {
    req.session.userId = undefined;
    return res.status(401).json({ error: "Invalid session" });
  }
  
  (req as any).user = user;
  next();
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    const user = await storage.getUser(req.session.userId);
    if (user) {
      (req as any).user = user;
    }
  }
  next();
};