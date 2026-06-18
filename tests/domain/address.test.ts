import { describe, it, expect } from "vitest";
import { ContractAddress } from "../../src/domain/value-objects/address.js";
import { InvalidAddressError } from "../../src/domain/errors/errors.js";

describe("ContractAddress", () => {
  it("should create a valid address with 0x prefix", () => {
    const raw = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
    const address = new ContractAddress(raw);
    expect(address.getValue()).toBe(raw.toLowerCase());
  });

  it("should create a valid address without 0x prefix and add it", () => {
    const raw = "89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
    const address = new ContractAddress(raw);
    expect(address.getValue()).toBe(`0x${raw.toLowerCase()}`);
  });

  it("should throw InvalidAddressError if address is empty", () => {
    expect(() => new ContractAddress("")).toThrow(InvalidAddressError);
  });

  it("should throw InvalidAddressError if address is invalid length", () => {
    expect(() => new ContractAddress("0x123")).toThrow(InvalidAddressError);
    expect(() => new ContractAddress("0x" + "a".repeat(41))).toThrow(InvalidAddressError);
  });

  it("should throw InvalidAddressError if address contains non-hex characters", () => {
    expect(() => new ContractAddress("0x" + "g".repeat(40))).toThrow(InvalidAddressError);
  });

  it("should support equality checks", () => {
    const addr1 = new ContractAddress("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7");
    const addr2 = new ContractAddress("89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7");
    const addr3 = new ContractAddress("0x0000000000000000000000000000000000000000");

    expect(addr1.equals(addr2)).toBe(true);
    expect(addr1.equals(addr3)).toBe(false);
  });
});
