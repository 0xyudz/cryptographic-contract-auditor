import { Tool } from "langchain/tools";
import { PharosAgentKit } from "../../agent/index.js";

export class AuditContractTool extends Tool {
  public name = "audit_contract";
  public description = `Audit a smart contract on Pharos network for security vulnerabilities.
  
  Inputs (JSON string):
    - contractAddress: string, the contract address to audit (required)
    - auditorId: string, identifier for the auditor (required)`;

  constructor(private agent: PharosAgentKit) {
    super();
  }

  /**
   * Invoked by LangChain executor when tool is executed.
   */
  protected async _call(input: string): Promise<string> {
    try {
      let contractAddress: string | undefined;
      let auditorId = "pharos-agent-tool";

      try {
        const parsedInput = JSON.parse(input);
        if (typeof parsedInput === "object" && parsedInput !== null) {
          contractAddress = parsedInput.contractAddress;
          if (parsedInput.auditorId) {
            auditorId = parsedInput.auditorId;
          }
        }
      } catch {
        contractAddress = input.trim();
      }

      if (!contractAddress) {
        throw new Error("contractAddress is required.");
      }

      const result = await this.agent.auditContract(contractAddress, auditorId);

      return JSON.stringify({
        status: "success",
        data: result,
        message: `Contract ${contractAddress} audited. Risk score: ${result.riskScore}/100`,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
      });
    }
  }
}
