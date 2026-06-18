export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidAddressError extends ValidationError {
  constructor(address: string, reason: string) {
    super(`Invalid EVM address "${address}": ${reason}`);
  }
}

export class InvalidBytecodeError extends ValidationError {
  constructor(reason: string) {
    super(`Invalid EVM bytecode: ${reason}`);
  }
}

export class RiskScoreCalculationError extends DomainError {
  constructor(reason: string) {
    super(`Failed to calculate risk score: ${reason}`);
  }
}
