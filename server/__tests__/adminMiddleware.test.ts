import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";

// Mock logger to avoid pino initialization
vi.mock("../logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

import { requireAdmin, requireModerator, requireInstructor } from "../adminMiddleware";

function mockReq(user?: any): Request {
  const req = {
    session: {} as any,
    user,
  } as unknown as Request;
  return req;
}

function mockRes(): Response {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

describe("requireAdmin", () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
  });

  it("returns 401 when no user", () => {
    const res = mockRes();
    requireAdmin(mockReq(), res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Authentication required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 for non-admin role", () => {
    const res = mockRes();
    requireAdmin(mockReq({ role: "student" }), res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Admin access required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 for moderator", () => {
    const res = mockRes();
    requireAdmin(mockReq({ role: "moderator" }), res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("allows admin through", () => {
    const res = mockRes();
    requireAdmin(mockReq({ role: "admin" }), res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("requireModerator", () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
  });

  it("returns 401 when no user", () => {
    const res = mockRes();
    requireModerator(mockReq(), res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 for student", () => {
    const res = mockRes();
    requireModerator(mockReq({ role: "student" }), res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Moderator access required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 for instructor", () => {
    const res = mockRes();
    requireModerator(mockReq({ role: "instructor" }), res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it.each(["admin", "moderator"])("allows %s through", (role) => {
    const res = mockRes();
    requireModerator(mockReq({ role }), res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("requireInstructor (adminMiddleware)", () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
  });

  it("returns 401 when no user", () => {
    const res = mockRes();
    requireInstructor(mockReq(), res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 for student", () => {
    const res = mockRes();
    requireInstructor(mockReq({ role: "student" }), res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Instructor access required" });
    expect(next).not.toHaveBeenCalled();
  });

  it.each(["admin", "moderator", "instructor"])(
    "allows %s through",
    (role) => {
      const res = mockRes();
      requireInstructor(mockReq({ role }), res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    }
  );
});
