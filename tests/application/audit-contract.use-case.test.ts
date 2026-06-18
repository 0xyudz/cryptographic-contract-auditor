import { describe, it, expect, vi } from "vitest";
import { ZodError } from "zod";
import { AuditContractUseCase } from "../../src/application/use-cases/audit-contract.use-case.js";
import { IHeuristicEngine } from "../../src/domain/interfaces/heuristic-engine.js";
import { IAttestationGenerator } from "../../src/domain/interfaces/attestation-generator.js";
import { HeuristicCheck } from "../../src/domain/entities/heuristic-check.js";
import { AttestationHash, Signature } from "../../src/domain/value-objects/attestation.js";

describe("AuditContractUseCase", () => {
  // Simple mock interfaces
  const mockHeuristicEngine = {
    run: vi.fn(),
  } as unknown as IHeuristicEngine;

  const mockAttestationGenerator = {
    generateHash: vi.fn(),
    sign: vi.fn(),
  } as unknown as IAttestationGenerator;

  const useCase = new AuditContractUseCase(mockHeuristicEngine, mockAttestationGenerator);

  const validAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
  const validBytecode = "0x6080604052";
  const validAuditorId = "pharos-agent-auditor";

  it("should execute successfully on the happy path", async () => {
    // 1. Mock engine to return heuristic checks
    const mockChecks = [
      new HeuristicCheck({
        id: "SELFDESTRUCT",
        name: "Selfdestruct opcode",
        description: "Detects the presence of dangerous SELFDESTRUCT",
        severity: "CRITICAL",
        passed: false,
        details: "Vulnerability found at offset 12",
      }),
      new HeuristicCheck({
        id: "DELEGATECALL",
        name: "Delegatecall check",
        description: "Detects presence of delegatecall instruction",
        severity: "HIGH",
        passed: true,
      }),
    ];
    vi.mocked(mockHeuristicEngine.run).mockReturnValue(mockChecks);

    // 2. Mock attestation generator
    const expectedHashHex = "0x" + "1".repeat(64);
    const expectedSigHex = "0x" + "2".repeat(130);
    vi.mocked(mockAttestationGenerator.generateHash).mockReturnValue(new AttestationHash(expectedHashHex));
    vi.mocked(mockAttestationGenerator.sign).mockReturnValue(new Signature(expectedSigHex));

    // 3. Run Use Case
    const result = await useCase.execute({
      contractAddress: validAddress,
      bytecode: validBytecode,
      auditorId: validAuditorId,
    });

    // 4. Assertions
    expect(result.contractAddress).toBe(validAddress.toLowerCase());
    // CRITICAL failed check = 40 pts, HIGH passed check = 0 pts. Total = 40 pts.
    expect(result.riskScore).toBe(40);
    expect(result.riskLevel).toBe("MEDIUM");
    expect(result.isSafeForAgent).toBe(false); // 40 is not < 40
    expect(result.checks).toHaveLength(2);
    expect(result.checks[0]).toEqual({
      id: "SELFDESTRUCT",
      name: "Selfdestruct opcode",
      severity: "CRITICAL",
      passed: false,
      details: "Vulnerability found at offset 12",
    });

    expect(result.attestation.hash).toBe(expectedHashHex);
    expect(result.attestation.signature).toBe(expectedSigHex);
    expect(result.attestation.auditorId).toBe(validAuditorId);
    expect(result.attestation.timestamp).toBeDefined();
    expect(() => new Date(result.attestation.timestamp)).not.toThrow();

    // Verify engine and generator were called with correct values
    expect(mockHeuristicEngine.run).toHaveBeenCalled();
    expect(mockAttestationGenerator.generateHash).toHaveBeenCalled();
    expect(mockAttestationGenerator.sign).toHaveBeenCalled();
  });

  it("should throw ZodError if input validation fails", async () => {
    // Address too short, empty bytecode, empty auditorId
    await expect(
      useCase.execute({
        contractAddress: "0x123",
        bytecode: "",
        auditorId: "",
      })
    ).rejects.toThrow(ZodError);
  });

  it("should throw ZodError if bytecode is not byte-aligned (odd character length)", async () => {
    await expect(
      useCase.execute({
        contractAddress: validAddress,
        bytecode: "0x123", // odd length (3 characters after 0x)
        auditorId: validAuditorId,
      })
    ).rejects.toThrow(ZodError);
  });
});
