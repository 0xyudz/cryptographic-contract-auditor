import { describe, it, expect } from "vitest";
import { ContractAddress } from "../../src/domain/value-objects/address.js";
import { ContractBytecode } from "../../src/domain/entities/bytecode.js";
import { HeuristicCheck } from "../../src/domain/entities/heuristic-check.js";
import { RiskScore } from "../../src/domain/entities/risk-score.js";
import { AuditResult } from "../../src/domain/entities/audit-result.js";
import { AttestationHash, Signature } from "../../src/domain/value-objects/attestation.js";

describe("AuditResult", () => {
  const address = new ContractAddress("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7");
  const bytecode = new ContractBytecode("0x6080604052");
  const checks = [
    new HeuristicCheck({ id: "1", name: "C1", description: "D1", severity: "LOW", passed: true }),
  ];
  const riskScore = RiskScore.fromChecks(checks);
  const timestamp = Date.now();
  const auditorId = "pharos-auditor-1";

  it("should create a valid audit result", () => {
    const result = new AuditResult({
      contractAddress: address,
      bytecode,
      checks,
      riskScore,
      timestamp,
      auditorId,
    });

    expect(result.contractAddress).toBe(address);
    expect(result.bytecode).toBe(bytecode);
    expect(result.checks).toEqual(checks);
    expect(result.riskScore).toBe(riskScore);
    expect(result.timestamp).toBe(timestamp);
    expect(result.auditorId).toBe(auditorId);
    expect(result.isAttested()).toBe(false);
    expect(result.attestationHash).toBeNull();
    expect(result.signature).toBeNull();
  });

  it("should return a new attested instance when calling attest", () => {
    const result = new AuditResult({
      contractAddress: address,
      bytecode,
      checks,
      riskScore,
      timestamp,
      auditorId,
    });

    const mockHash = new AttestationHash("0x" + "a".repeat(64));
    const mockSig = new Signature("0x" + "b".repeat(130));

    const attested = result.attest(mockHash, mockSig);

    expect(attested).not.toBe(result);
    expect(attested.isAttested()).toBe(true);
    expect(attested.attestationHash).toBe(mockHash);
    expect(attested.signature).toBe(mockSig);
    // Original result remains unattested
    expect(result.isAttested()).toBe(false);
  });
});
