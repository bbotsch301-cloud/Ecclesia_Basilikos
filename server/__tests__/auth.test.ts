import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";

// Mock the storage module before importing auth
vi.mock("../storage", () => ({
  storage: {
    getUser: vi.fn(),
  },
}));

// Mock the db module (needed by sessionMiddleware)
vi.mock("../db", () => ({
  pool: {},
}));

import { requireAuth, requireInstructor, optionalAuth } from "../auth";
import { storage } from "../storage";

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    session: {} as any,
    ...overrides,
  } as unknown as Request;
}

function mockRes(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

describe("requireAuth", () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("returns 401 when no session userId", async () => {
    const req = mockReq();
    const res = mockRes();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Authentication required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when user not found in storage", async () => {
    const req = mockReq({ session: { userId: "nonexistent" } as any });
    const res = mockRes();
    vi.mocked(storage.getUser).mockResolvedValue(null as any);

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid session" });
    expect(req.session.userId).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches user and calls next when session is valid", async () => {
    const fakeUser = { id: "user-1", email: "test@example.com", role: "student" };
    const req = mockReq({ session: { userId: "user-1" } as any });
    const res = mockRes();
    vi.mocked(storage.getUser).mockResolvedValue(fakeUser as any);

    await requireAuth(req, res, next);

    expect((req as any).user).toEqual(fakeUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("requireInstructor", () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
  });

  it("returns 401 when no user on request", async () => {
    const req = mockReq();
    const res = mockRes();

    await requireInstructor(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 for student role", async () => {
    const req = mockReq();
    (req as any).user = { id: "u1", role: "student" };
    const res = mockRes();

    await requireInstructor(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Instructor access required" });
    expect(next).not.toHaveBeenCalled();
  });

  it.each(["admin", "moderator", "instructor"])(
    "allows %s role through",
    async (role) => {
      const req = mockReq();
      (req as any).user = { id: "u1", role };
      const res = mockRes();

      await requireInstructor(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    }
  );
});

describe("optionalAuth", () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("calls next without attaching user when no session", async () => {
    const req = mockReq();
    const res = mockRes();

    await optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect((req as any).user).toBeUndefined();
  });

  it("attaches user when session userId exists and user found", async () => {
    const fakeUser = { id: "user-1", email: "test@example.com" };
    const req = mockReq({ session: { userId: "user-1" } as any });
    const res = mockRes();
    vi.mocked(storage.getUser).mockResolvedValue(fakeUser as any);

    await optionalAuth(req, res, next);

    expect((req as any).user).toEqual(fakeUser);
    expect(next).toHaveBeenCalled();
  });

  it("calls next without user when userId exists but user not found", async () => {
    const req = mockReq({ session: { userId: "gone" } as any });
    const res = mockRes();
    vi.mocked(storage.getUser).mockResolvedValue(null as any);

    await optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect((req as any).user).toBeUndefined();
  });
});
