import { describe, it, expect } from "vitest";
import { PharosAgentKit } from "../../src/agent/index.js";

describe("PharosAgentKit Integration", () => {
  const agent = new PharosAgentKit({
    rpcUrl: "https://testnet.dplabs-internal.com",
    chainId: 688688,
  });

  it("should perform an audit on a preset secure address and return correct data", async () => {
    const address = "0x0000000000000000000000000000000000000001";
    const result = await agent.auditContract(address, "agent-test");

    expect(result.contractAddress).toBe(address.toLowerCase());
    expect(result.riskScore).toBe(0);
    expect(result.riskLevel).toBe("SECURE");
    expect(result.isSafeForAgent).toBe(true);
    expect(result.checks).toHaveLength(4);
    expect(result.checks.every((c: any) => c.passed)).toBe(true);
    expect(result.attestation.hash).toBeDefined();
    expect(result.attestation.signature).toBeDefined();
    expect(result.attestation.auditorId).toBe("agent-test");
  });

  it("should perform an audit on a preset malicious address and mark it unsafe", async () => {
    const address = "0x0000000000000000000000000000000000009999";
    const result = await agent.auditContract(address, "agent-test");

    expect(result.contractAddress).toBe(address.toLowerCase());
    expect(result.riskScore).toBe(75);
    expect(result.riskLevel).toBe("HIGH");
    expect(result.isSafeForAgent).toBe(false);
    expect(result.checks).toHaveLength(4);
    expect(result.checks.filter((c: any) => !c.passed)).toHaveLength(4);
    expect(result.attestation.hash).toBeDefined();
  });
});
