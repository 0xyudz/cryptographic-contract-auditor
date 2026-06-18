import { InvalidBytecodeError } from "../errors/errors.js";

export class ContractBytecode {
  private readonly value: string;

  constructor(bytecode: string) {
    if (!bytecode) {
      throw new InvalidBytecodeError("Bytecode cannot be empty");
    }

    const cleanBytecode = bytecode.trim();
    // Match optional 0x followed by hex chars
    const hexPattern = /^(0x)?[0-9a-fA-F]+$/;

    if (!hexPattern.test(cleanBytecode)) {
      throw new InvalidBytecodeError("Bytecode must be a valid hex string");
    }

    // Strip optional 0x to count hex characters
    const hexWithoutPrefix = cleanBytecode.startsWith("0x") 
      ? cleanBytecode.slice(2) 
      : cleanBytecode;

    if (hexWithoutPrefix.length === 0) {
      throw new InvalidBytecodeError("Bytecode cannot contain only 0x prefix");
    }

    if (hexWithoutPrefix.length % 2 !== 0) {
      throw new InvalidBytecodeError("Bytecode hex representation must have an even length (byte-aligned)");
    }

    this.value = `0x${hexWithoutPrefix.toLowerCase()}`;
  }

  public getValue(): string {
    return this.value;
  }

  public getRawHex(): string {
    return this.value.slice(2);
  }

  public getLengthInBytes(): number {
    return this.getRawHex().length / 2;
  }
}
