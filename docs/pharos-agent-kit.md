# Pharos Agent Kit Integration

To allow AI Agents to interact programmatically with our auditor, the skill is packaged to integrate directly with the **Pharos Agent Kit** ecosystem.

---

## 🛠️ 1. Core Tool: `audit_contract`

Located in `src/tools/cryptographic_contract_auditor/audit_contract.ts`. This native function coordinates the bytecode query from the network client and invokes the application use case.

It implements a **Smart Fallback** mechanism:
1.  It attempts to query the live blockchain bytecode using the agent's RPC connection (`agent.connection.getBytecode`).
2.  If the RPC call fails (e.g. no connection) or if the contract is not deployed, it falls back to looking for preset demo address bytecodes (`0x...9999` for malicious, `0x...0001` for secure).
3.  If no preset is found, it falls back to a default simulated vulnerable bytecode to demonstrate security checks in a dry-run environment.

```typescript
import { PharosAgentKit, audit_contract } from "@pharos/cryptographic-contract-auditor";

// 1. Initialize the Pharos Agent Kit Connection
const agent = new PharosAgentKit({
  rpcUrl: "https://testnet.dplabs-internal.com",
  chainId: 688688
});

// 2. Perform the audit
const result = await audit_contract(
  agent, 
  "0x0000000000000000000000000000000000009999", 
  "auditor-1"
);

console.log(`Contract is safe: ${result.isSafeForAgent}`);
console.log(`Risk Score: ${result.riskScore}/100`);
```

---

## 🦜 2. LangChain Tool: `AuditContractTool`

Located in `src/langchain/cryptographic_contract_auditor/audit_contract.ts`. Extends LangChain's base `Tool` class. This wrapper allows LLM planners (like LangChain Agent executors) to discover and call our auditor skill during natural language reasoning loops.

*   **Inputs**: Expects a JSON string containing `contractAddress` and `auditorId`, or falls back to a raw address string.
*   **Outputs**: Returns a serialized JSON string containing status, data, and human-readable audit summaries.

```typescript
import { PharosAgentKit, AuditContractTool } from "@pharos/cryptographic-contract-auditor";

const agent = new PharosAgentKit({ /* config */ });
const auditTool = new AuditContractTool(agent);

// LLMs call this tool programmatically
const response = await auditTool.call(JSON.stringify({
  contractAddress: "0x0000000000000000000000000000000000000001",
  auditorId: "langchain-agent"
}));

console.log(response);
```

---

## 🎭 3. Agent Action: `auditContractAction`

Located in `src/actions/cryptographic_contract_auditor/audit_contract.ts`. A metadata-rich Action definition that can be loaded directly into agent action registries.

*   **Zod Schema**: Enforces input validation strictly using `z.object({...})` so LLM reasoning engines (e.g., function calling models) can parse parameters safely.
*   **Similes**: Mapped to command synonyms like `"audit contract"`, `"check contract security"`, and `"verify contract safety"`.
*   **Handler**: Resolves inputs, triggers `agent.auditContract()`, and returns standard success responses.

### Schema Definition
```typescript
export const auditContractActionSchema = z.object({
  contractAddress: z.string()
    .min(40, "EVM address must be at least 40 characters")
    .max(42, "EVM address must be at most 42 characters")
    .describe("The EVM smart contract address to audit for security vulnerabilities"),
  auditorId: z.string()
    .optional()
    .default("pharos-agent-auditor")
    .describe("The identifier of the auditor generating the attestation"),
});
```
This Zod schema acts as a robust firewall, catching malformed parameters before they hit the application use case layer.
