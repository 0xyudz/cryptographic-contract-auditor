import { describe, it, expect } from "vitest";
import { Sha256AttestationGenerator } from "../../src/infrastructure/crypto/sha256-attestation-generator.js";
import { AuditResult } from "../../src/domain/entities/audit-result.js";
import { ContractAddress } from "../../src/domain/value-objects/address.js";
import { ContractBytecode } from "../../src/domain/entities/bytecode.js";
import { HeuristicCheck } from "../../src/domain/entities/heuristic-check.js";
import { RiskScore } from "../../src/domain/entities/risk-score.js";

describe("Sha256AttestationGenerator", () => {
  const generator = new Sha256AttestationGenerator();

  const address = new ContractAddress("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7");
  const bytecode = new ContractBytecode("0x6080604052");
  const checks = [
    new HeuristicCheck({ id: "1", name: "C1", description: "D1", severity: "LOW", passed: true }),
  ];
  const riskScore = RiskScore.fromChecks(checks);
  const timestamp = 1718092800000; // Fixed timestamp for determinism
  const auditorId = "pharos-auditor-1";

  const result = new AuditResult({
    contractAddress: address,
    bytecode,
    checks,
    riskScore,
    timestamp,
    auditorId,
  });

  it("should generate a valid 64-character hex hash starting with 0x", () => {
    const hash = generator.generateHash(result, auditorId, timestamp);
    const value = hash.getValue();
    
    expect(value.startsWith("0x")).toBe(true);
    expect(value.slice(2)).toHaveLength(64);
    // hex check
    expect(/^[0-9a-fA-F]{64}$/.test(value.slice(2))).toBe(true);
  });

  it("should be deterministic and generate identical hash for same inputs", () => {
    const hash1 = generator.generateHash(result, auditorId, timestamp);
    const hash2 = generator.generateHash(result, auditorId, timestamp);

    expect(hash1.equals(hash2)).toBe(true);
    expect(hash1.getValue()).toBe(hash2.getValue());
  });

  it("should produce different hash when auditorId changes", () => {
    const hash1 = generator.generateHash(result, auditorId, timestamp);
    const hash2 = generator.generateHash(result, "pharos-auditor-2", timestamp);

    expect(hash1.equals(hash2)).toBe(false);
  });

  it("should produce different hash when timestamp changes", () => {
    const hash1 = generator.generateHash(result, auditorId, timestamp);
    const hash2 = generator.generateHash(result, auditorId, timestamp + 1000);

    expect(hash1.equals(hash2)).toBe(false);
  });

  it("should produce different hash when audit data changes (e.g. risk score)", () => {
    const hash1 = generator.generateHash(result, auditorId, timestamp);

    const checksModified = [
      new HeuristicCheck({ id: "1", name: "C1", description: "D1", severity: "LOW", passed: false }),
    ];
    const riskScoreModified = RiskScore.fromChecks(checksModified);
    const resultModified = new AuditResult({
      contractAddress: address,
      bytecode,
      checks: checksModified,
      riskScore: riskScoreModified,
      timestamp,
      auditorId,
    });

    const hash2 = generator.generateHash(resultModified, auditorId, timestamp);
    expect(hash1.equals(hash2)).toBe(false);
  });

  it("should generate a deterministic mock signature starting with 0x", () => {
    const hash = generator.generateHash(result, auditorId, timestamp);
    const sig1 = generator.sign(hash);
    const sig2 = generator.sign(hash);

    expect(sig1.getValue().startsWith("0x")).toBe(true);
    expect(sig1.equals(sig2)).toBe(true);
  });
});
