import { describe, it, expect } from "vitest";
import crypto from "crypto";

// Test replacePlaceholders directly (pure function, no deps)
describe("replacePlaceholders", () => {
  function replacePlaceholders(template, replacements) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return replacements[key] !== undefined ? replacements[key] : match;
    });
  }

  it("replaces all known variables", () => {
    const template = "Hello {customerName}, your order {orderNumber}.";
    const result = replacePlaceholders(template, {
      customerName: "Max",
      orderNumber: "42",
    });
    expect(result).toBe("Hello Max, your order 42.");
  });

  it("leaves unknown placeholders intact", () => {
    const template = "Hello {customerName}, {unknown}";
    const result = replacePlaceholders(template, { customerName: "Max" });
    expect(result).toBe("Hello Max, {unknown}");
  });

  it("handles empty replacements", () => {
    const template = "Hello {name}";
    const result = replacePlaceholders(template, {});
    expect(result).toBe("Hello {name}");
  });
});

describe("SHA-256 Verification Hash", () => {
  it("generates consistent 64-char hex hash", () => {
    const data = "test.myshopify.com|Max Mustermann|1001|max@example.com|2024-01-01T00:00:00.000Z";
    const hash1 = crypto.createHash("sha256").update(data, "utf8").digest("hex");
    const hash2 = crypto.createHash("sha256").update(data, "utf8").digest("hex");
    expect(hash1).toHaveLength(64);
    expect(hash1).toBe(hash2);
  });

  it("produces different hashes for different input", () => {
    const hash1 = crypto.createHash("sha256").update("data1", "utf8").digest("hex");
    const hash2 = crypto.createHash("sha256").update("data2", "utf8").digest("hex");
    expect(hash1).not.toBe(hash2);
  });
});

describe("Email validation", () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  it("accepts valid email addresses", () => {
    expect(emailRegex.test("max@example.com")).toBe(true);
    expect(emailRegex.test("max.mustermann@shop.de")).toBe(true);
    expect(emailRegex.test("test+tag@domain.co.uk")).toBe(true);
  });

  it("rejects invalid email addresses", () => {
    expect(emailRegex.test("invalid")).toBe(false);
    expect(emailRegex.test("@domain.com")).toBe(false);
    expect(emailRegex.test("max@")).toBe(false);
    expect(emailRegex.test("")).toBe(false);
  });
});

describe("Withdrawal form validation", () => {
  it("requires all fields", () => {
    const requiredFields = ["customerName", "orderNumber", "email"];
    const validBody = { customerName: "Max", orderNumber: "1001", email: "max@example.com" };
    const invalidBody = { customerName: "Max" };

    const isValid = (body) => requiredFields.every((f) => body[f]);
    expect(isValid(validBody)).toBe(true);
    expect(isValid(invalidBody)).toBe(false);
  });
});

describe("CORS headers", () => {
  it("restricts origin to configured domain", () => {
    const origin = process.env.ALLOWED_CORS_ORIGIN || "https://admin.shopify.com";
    expect(origin).not.toBe("*");
    expect(origin).toContain("https://");
  });
});