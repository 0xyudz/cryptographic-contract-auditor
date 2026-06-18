import { Action } from "../../types/action.js";
import { PharosAgentKit } from "../../agent/index.js";
import { z } from "zod";

export const auditContractAction: Action = {
  name: "AUDIT_CONTRACT",
  similes: ["audit contract", "check contract security", "scan contract", "verify contract safety"],
  description:
    "Performs deterministic heuristic security analysis on a smart contract and returns a cryptographically attested risk score.",
  examples: [
    [
      {
        input: {
          contractAddress: "0x0000000000000000000000000000000000009999",
          auditorId: "pharos-sentinel-001",
        },
        output: {
          status: "success",
          data: {
            riskScore: 75,
            riskLevel: "HIGH",
            isSafeForAgent: false,
            checks: [
              { id: "HEURISTIC_SELFDESTRUCT", name: "SELFDESTRUCT Check", severity: "CRITICAL", passed: false },
              { id: "HEURISTIC_DELEGATECALL", name: "DELEGATECALL Check", severity: "HIGH", passed: false },
              { id: "HEURISTIC_TX_ORIGIN", name: "TX.ORIGIN Check", severity: "MEDIUM", passed: false },
              { id: "HEURISTIC_BLOCK_TIMESTAMP", name: "BLOCK.TIMESTAMP Check", severity: "LOW", passed: false },
            ],
            attestation: {
              hash: "0xbde63f21ec59c8d467652625f29ecdb59fbcb3aad074c3fe933733cc607a771d",
              signature: "0xf467a427e8b2a2144cc3e167283a61e4a92e19a68d39c8eefedb8c396cc0bf47",
              auditorId: "pharos-sentinel-001",
              timestamp: "2026-06-11T02:06:02.253Z",
            },
          },
          message: "Contract audited successfully. HIGH RISK detected.",
        },
        explanation:
          "Demonstrates auditing a malicious contract with SELFDESTRUCT and DELEGATECALL vulnerabilities.",
      },
    ],
  ],
  schema: z.object({
    contractAddress: z.string().describe("The contract address to audit (EVM format)"),
    auditorId: z.string().describe("Identifier for the auditor performing the audit"),
  }),
  handler: async (agent: PharosAgentKit, input: Record<string, any>) => {
    const { contractAddress, auditorId } = input;

    const result = await agent.auditContract(contractAddress, auditorId);

    return {
      status: "success",
      data: result,
      message: `Contract ${contractAddress} audited. Risk score: ${result.riskScore}/100 (${result.riskLevel})`,
    };
  },
};
