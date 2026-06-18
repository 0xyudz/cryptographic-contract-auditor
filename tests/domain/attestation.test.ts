import { describe, it, expect } from "vitest";
import { AttestationHash, Signature } from "../../src/domain/value-objects/attestation.js";
import { ValidationError } from "../../src/domain/errors/errors.js";

describe("AttestationHash", () => {
  const validHash = "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2";

  it("should create valid hash with 0x prefix", () => {
    const hash = new AttestationHash(`0x${validHash}`);
    expect(hash.getValue()).toBe(`0x${validHash.toLowerCase()}`);
  });

  it("should create valid hash without 0x prefix and add it", () => {
    const hash = new AttestationHash(validHash);
    expect(hash.getValue()).toBe(`0x${validHash.toLowerCase()}`);
  });

  it("should throw ValidationError on empty hash", () => {
    expect(() => new AttestationHash("")).toThrow(ValidationError);
  });

  it("should throw ValidationError on invalid format", () => {
    expect(() => new AttestationHash("0x123")).toThrow(ValidationError);
    expect(() => new AttestationHash("0x" + "g".repeat(64))).toThrow(ValidationError);
  });
});

describe("Signature", () => {
  const validSig = "0x" + "a".repeat(130); // Mock 65-byte signature

  it("should create valid signature", () => {
    const sig = new Signature(validSig);
    expect(sig.getValue()).toBe(validSig);
  });

  it("should create valid signature without 0x prefix and add it", () => {
    const rawSig = "a".repeat(130);
    const sig = new Signature(rawSig);
    expect(sig.getValue()).toBe(`0x${rawSig}`);
  });

  it("should throw ValidationError on empty signature", () => {
    expect(() => new Signature("")).toThrow(ValidationError);
  });

  it("should throw ValidationError on non-hex signature", () => {
    expect(() => new Signature("invalid-signature")).toThrow(ValidationError);
  });
});
