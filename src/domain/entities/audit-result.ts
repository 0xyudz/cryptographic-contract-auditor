import { ContractAddress } from "../value-objects/address.js";
import { ContractBytecode } from "./bytecode.js";
import { HeuristicCheck } from "./heuristic-check.js";
import { RiskScore } from "./risk-score.js";
import { AttestationHash, Signature } from "../value-objects/attestation.js";

export interface AuditResultProps {
  contractAddress: ContractAddress;
  bytecode: ContractBytecode;
  checks: HeuristicCheck[];
  riskScore: RiskScore;
  timestamp: number;
  auditorId: string;
  attestationHash?: AttestationHash;
  signature?: Signature;
}

export class AuditResult {
  public readonly contractAddress: ContractAddress;
  public readonly bytecode: ContractBytecode;
  public readonly checks: HeuristicCheck[];
  public readonly riskScore: RiskScore;
  public readonly timestamp: number;
  public readonly auditorId: string;
  public readonly attestationHash: AttestationHash | null;
  public readonly signature: Signature | null;

  constructor(props: AuditResultProps) {
    if (!props.contractAddress) {
      throw new Error("Contract address is required for an audit result");
    }
    if (!props.bytecode) {
      throw new Error("Contract bytecode is required for an audit result");
    }
    if (!props.checks || props.checks.length === 0) {
      throw new Error("At least one heuristic check must be provided");
    }
    if (!props.riskScore) {
      throw new Error("Risk score is required for an audit result");
    }
    if (!props.auditorId) {
      throw new Error("Auditor ID is required");
    }
    if (!props.timestamp) {
      throw new Error("Timestamp is required");
    }

    this.contractAddress = props.contractAddress;
    this.bytecode = props.bytecode;
    this.checks = [...props.checks];
    this.riskScore = props.riskScore;
    this.timestamp = props.timestamp;
    this.auditorId = props.auditorId;
    this.attestationHash = props.attestationHash ?? null;
    this.signature = props.signature ?? null;
  }

  public isAttested(): boolean {
    return this.attestationHash !== null && this.signature !== null;
  }

  public attest(hash: AttestationHash, sig: Signature): AuditResult {
    return new AuditResult({
      contractAddress: this.contractAddress,
      bytecode: this.bytecode,
      checks: this.checks,
      riskScore: this.riskScore,
      timestamp: this.timestamp,
      auditorId: this.auditorId,
      attestationHash: hash,
      signature: sig,
    });
  }
}
