import { describe, it, expect } from "vitest";
import {
  loginSchema,
  insertContactSchema,
  insertForumThreadSchema,
  updateUserRoleSchema,
  createProofHashSchema,
  updatePageContentSchema,
} from "../schema";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "securepass123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "securepass123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    expect(loginSchema.safeParse({}).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.com" }).success).toBe(false);
    expect(loginSchema.safeParse({ password: "123456" }).success).toBe(false);
  });
});

describe("insertContactSchema", () => {
  it("accepts valid contact submission", () => {
    const result = insertContactSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      subject: "Question",
      message: "Hello there",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = insertContactSchema.safeParse({
      name: "John",
    });
    expect(result.success).toBe(false);
  });
});

describe("insertForumThreadSchema", () => {
  it("accepts valid thread data", () => {
    const result = insertForumThreadSchema.safeParse({
      title: "Discussion topic",
      content: "This is the thread body",
      categoryId: "cat-1",
      authorId: "user-1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = insertForumThreadSchema.safeParse({
      content: "Body",
      categoryId: "cat-1",
      authorId: "user-1",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateUserRoleSchema", () => {
  it("accepts valid role update", () => {
    const result = updateUserRoleSchema.safeParse({
      userId: "user-123",
      role: "admin",
    });
    expect(result.success).toBe(true);
  });

  it.each(["student", "instructor", "moderator", "admin"])(
    "accepts %s role",
    (role) => {
      const result = updateUserRoleSchema.safeParse({
        userId: "u1",
        role,
      });
      expect(result.success).toBe(true);
    }
  );

  it("rejects invalid role", () => {
    const result = updateUserRoleSchema.safeParse({
      userId: "user-123",
      role: "superadmin",
    });
    expect(result.success).toBe(false);
  });
});

describe("createProofHashSchema", () => {
  it("accepts valid SHA-256 hash", () => {
    const result = createProofHashSchema.safeParse({
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    });
    expect(result.success).toBe(true);
  });

  it("accepts hash with optional label", () => {
    const result = createProofHashSchema.safeParse({
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      label: "My document",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-hex string", () => {
    const result = createProofHashSchema.safeParse({
      sha256: "not-a-hash",
    });
    expect(result.success).toBe(false);
  });

  it("rejects wrong-length hex", () => {
    const result = createProofHashSchema.safeParse({
      sha256: "abcdef1234",
    });
    expect(result.success).toBe(false);
  });
});

describe("updatePageContentSchema", () => {
  it("accepts contentValue with optional description", () => {
    const result = updatePageContentSchema.safeParse({
      contentValue: "https://example.com/image.jpg",
      description: "Hero image",
    });
    expect(result.success).toBe(true);
  });

  it("accepts contentValue without description", () => {
    const result = updatePageContentSchema.safeParse({
      contentValue: "Some text content",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing contentValue", () => {
    const result = updatePageContentSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
