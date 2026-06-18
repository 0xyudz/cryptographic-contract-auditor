import { describe, it, expect } from "vitest";
import { ContractBytecode } from "../../src/domain/entities/bytecode.js";
import { InvalidBytecodeError } from "../../src/domain/errors/errors.js";

describe("ContractBytecode", () => {
  it("should create valid bytecode with 0x prefix", () => {
    const raw = "0x6080604052";
    const bytecode = new ContractBytecode(raw);
    expect(bytecode.getValue()).toBe(raw.toLowerCase());
  });

  it("should create valid bytecode without 0x prefix and add it", () => {
    const raw = "6080604052";
    const bytecode = new ContractBytecode(raw);
    expect(bytecode.getValue()).toBe(`0x${raw}`);
  });

  it("should throw InvalidBytecodeError if empty", () => {
    expect(() => new ContractBytecode("")).toThrow(InvalidBytecodeError);
  });

  it("should throw InvalidBytecodeError if only 0x", () => {
    expect(() => new ContractBytecode("0x")).toThrow(InvalidBytecodeError);
  });

  it("should throw InvalidBytecodeError on odd length", () => {
    expect(() => new ContractBytecode("608060405")).toThrow(InvalidBytecodeError);
  });

  it("should throw InvalidBytecodeError on non-hex", () => {
    expect(() => new ContractBytecode("608060405g")).toThrow(InvalidBytecodeError);
  });

  it("should retrieve raw hex and length in bytes correctly", () => {
    const raw = "0x6080604052";
    const bytecode = new ContractBytecode(raw);
    expect(bytecode.getRawHex()).toBe("6080604052");
    expect(bytecode.getLengthInBytes()).toBe(5);
  });
});
