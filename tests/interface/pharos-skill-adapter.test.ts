import { describe, it, expect } from "vitest";
import { PharosSkillAdapter } from "../../src/interface/adapters/pharos-skill-adapter.js";
import { AuditContractOutput } from "../../src/application/dto/audit-contract.dto.js";

describe("PharosSkillAdapter", () => {
  it("should wrap output in the standard Pharos Skill envelope", () => {
    const mockOutput: AuditContractOutput = {
      contractAddress: "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7",
      riskScore: 20,
      riskLevel: "LOW",
      isSafeForAgent: true,
      checks: [
        {
          id: "HEURISTIC_SELFDESTRUCT",
          name: "Selfdestruct Check",
          severity: "CRITICAL",
          passed: true,
        },
      ],
      attestation: {
        hash: "0x" + "1".repeat(64),
        signature: "0x" + "2".repeat(130),
        auditorId: "auditor-1",
        timestamp: new Date().toISOString(),
      },
    };

    const response = PharosSkillAdapter.toResponse(mockOutput);

    expect(response.success).toBe(true);
    expect(response.skill).toBe("cryptographic-contract-auditor");
    expect(response.version).toBe("1.0.0");
    expect(response.data).toEqual(mockOutput);
  });
});
