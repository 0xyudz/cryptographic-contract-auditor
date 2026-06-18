import { ValidationError } from "../errors/errors.js";

export class AttestationHash {
  private readonly value: string;

  constructor(hash: string) {
    if (!hash) {
      throw new ValidationError("Attestation hash cannot be empty");
    }

    const cleanHash = hash.trim();
    // Validate SHA-256 hash (64 hex characters, optional 0x prefix)
    const hashPattern = /^(0x)?[0-9a-fA-F]{64}$/;

    if (!hashPattern.test(cleanHash)) {
      throw new ValidationError(`Invalid attestation hash "${cleanHash}": Must be a 64-character hex string (SHA-256)`);
    }

    this.value = cleanHash.startsWith("0x") 
      ? cleanHash.toLowerCase() 
      : `0x${cleanHash.toLowerCase()}`;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: AttestationHash): boolean {
    return this.value === other.getValue();
  }
}

export class Signature {
  private readonly value: string;

  constructor(sig: string) {
    if (!sig) {
      throw new ValidationError("Signature cannot be empty");
    }

    const cleanSig = sig.trim();
    
    // Check if it's a valid hex string
    const hexPattern = /^(0x)?[0-9a-fA-F]+$/;
    if (!hexPattern.test(cleanSig)) {
      throw new ValidationError(`Invalid signature format: Must be a hex string`);
    }

    this.value = cleanSig.startsWith("0x")
      ? cleanSig.toLowerCase()
      : `0x${cleanSig.toLowerCase()}`;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Signature): boolean {
    return this.value === other.getValue();
  }
}
