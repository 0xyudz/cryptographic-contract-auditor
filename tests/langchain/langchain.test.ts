import { describe, it, expect } from "vitest";
import { PharosAgentKit } from "../../src/agent/index.js";
import { AuditContractTool } from "../../src/langchain/cryptographic_contract_auditor/audit_contract.js";

describe("AuditContractTool", () => {
  const agent = new PharosAgentKit({
    rpcUrl: "https://testnet.dplabs-internal.com",
    chainId: 688688,
  });

  const tool = new AuditContractTool(agent);

  it("should execute via JSON string input successfully", async () => {
    const input = JSON.stringify({
      contractAddress: "0x0000000000000000000000000000000000000001",
      auditorId: "langchain-test",
    });

    const responseStr = await tool.call(input);
    const response = JSON.parse(responseStr);

    expect(response.status).toBe("success");
    expect(response.data.contractAddress).toBe("0x0000000000000000000000000000000000000001");
    expect(response.data.riskScore).toBe(0);
    expect(response.message).toContain("Contract 0x0000000000000000000000000000000000000001 audited");
  });

  it("should fall back to raw address input string", async () => {
    const input = "0x0000000000000000000000000000000000009999";

    const responseStr = await tool.call(input);
    const response = JSON.parse(responseStr);

    expect(response.status).toBe("success");
    expect(response.data.contractAddress).toBe("0x0000000000000000000000000000000000009999");
    expect(response.data.riskScore).toBe(75);
  });

  it("should return error status on invalid address input", async () => {
    const input = JSON.stringify({
      contractAddress: "0xInvalidAddress",
    });

    const responseStr = await tool.call(input);
    const response = JSON.parse(responseStr);

    expect(response.status).toBe("error");
    expect(response.message).toBeDefined();
  });
});
