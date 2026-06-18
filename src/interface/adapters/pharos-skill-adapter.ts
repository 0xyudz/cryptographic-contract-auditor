import { AuditContractOutput } from "../../application/dto/audit-contract.dto.js";

export interface PharosSkillResponse {
  success: boolean;
  skill: string;
  version: string;
  data: AuditContractOutput;
}

export class PharosSkillAdapter {
  /**
   * Wraps the application audit output into a standardized Pharos Skill response.
   */
  public static toResponse(output: AuditContractOutput): PharosSkillResponse {
    return {
      success: true,
      skill: "cryptographic-contract-auditor",
      version: "1.0.0",
      data: output,
    };
  }
}
