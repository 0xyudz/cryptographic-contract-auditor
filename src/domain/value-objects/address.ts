import { InvalidAddressError } from "../errors/errors.js";

export class ContractAddress {
  private readonly value: string;

  constructor(address: string) {
    if (!address) {
      throw new InvalidAddressError("", "Address cannot be empty");
    }

    const cleanAddress = address.trim();
    const hexPattern = /^(0x)?[0-9a-fA-F]{40}$/;

    if (!hexPattern.test(cleanAddress)) {
      throw new InvalidAddressError(cleanAddress, "Must be a 40-character hex string, optionally prefixed with 0x");
    }

    // Ensure it has 0x prefix and is lowercase
    const formatted = cleanAddress.startsWith("0x") 
      ? cleanAddress.toLowerCase() 
      : `0x${cleanAddress.toLowerCase()}`;

    this.value = formatted;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: ContractAddress): boolean {
    return this.value === other.getValue();
  }
}
