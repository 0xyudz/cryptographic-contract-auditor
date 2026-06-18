# Pharos Skill Engine CLI Integration

The `@pharos/cryptographic-contract-auditor` is designed to be fully compatible with the CLI-driven **Pharos Skill Engine** format. This allows AI Agents that run command-line tools (e.g. via bash or terminal executors) to execute our auditor.

---

## 🗺️ 1. The Capability Index

In `SKILL.md` at the root of the project, we register the audit capabilities. This maps natural language user intents to the detailed instruction references:

| User Need | Capability | Detailed Instructions |
| :--- | :--- | :--- |
| Audit smart contract security / verify safety / scan bytecode | npx tsx + CLI runner | → [references/auditor.md](file:///c:/xampp/htdocs/cryptographic-contract-auditor/references/auditor.md) |

---

## 📖 2. Reference File: `references/auditor.md`

We provide a machine-readable reference specification in [references/auditor.md](file:///c:/xampp/htdocs/cryptographic-contract-auditor/references/auditor.md) detailing the execution parameters.

Every command section follows the official GitBook Skill Engine guidelines:
1.  **Overview**: Explaining what the command does.
2.  **Command Template**: Expressing the CLI command as a bash code block.
3.  **Parameters**: Defining arguments and requirement flags.
4.  **Output Parsing**: Schema table indicating how the agent interprets JSON outputs.
5.  **Error Handling**: Mapping common runtime errors to suggested agent actions.
6.  **Agent Guidelines**: Clear numbered instructions telling the agent how to execute pre-checks and interpret results.

---

## 💻 3. Dual-Purpose CLI Runner

Our entry point CLI in `src/interface/cli.ts` supports dual-mode operations:

### Mode A: E2E Demo Mode (No arguments)
```bash
npm run cli
# or npx tsx src/interface/cli.ts
```
Runs Scenario 1 & Scenario 2 automatically, outputting explanatory logs for developers.

### Mode B: Skill Engine CLI Mode (With arguments)
```bash
npx tsx src/interface/cli.ts --address <contractAddress> --auditor <auditorId>
```
Executes a single audit on the target contract and prints **only** the raw JSON output envelope. This allows the AI Agent terminal runner to parse the JSON output directly without being cluttered by decorative console messages.

---

## 📄 4. Example CLI Output Payload

Running the command:
```bash
npx tsx src/interface/cli.ts --address 0x0000000000000000000000000000000000009999 --auditor my-agent-007
```
Produces the following pure JSON envelope:
```json
{
  "success": true,
  "skill": "cryptographic-contract-auditor",
  "version": "1.0.0",
  "data": {
    "contractAddress": "0x0000000000000000000000000000000000009999",
    "riskScore": 75,
    "riskLevel": "HIGH",
    "isSafeForAgent": false,
    "checks": [
      {
        "id": "HEURISTIC_SELFDESTRUCT",
        "name": "SELFDESTRUCT Check",
        "severity": "CRITICAL",
        "passed": false,
        "details": "SELFDESTRUCT opcode 'ff' detected in contract bytecode"
      },
      {
        "id": "HEURISTIC_DELEGATECALL",
        "name": "DELEGATECALL Check",
        "severity": "HIGH",
        "passed": false,
        "details": "DELEGATECALL opcode 'f4' detected in contract bytecode"
      },
      {
        "id": "HEURISTIC_TX_ORIGIN",
        "name": "TX.ORIGIN Check",
        "severity": "MEDIUM",
        "passed": false,
        "details": "TX.ORIGIN opcode '46' detected in contract bytecode"
      },
      {
        "id": "HEURISTIC_TIMESTAMP",
        "name": "BLOCK.TIMESTAMP Check",
        "severity": "LOW",
        "passed": true,
        "details": "Passed. No TIMESTAMP opcode '42' detected"
      }
    ],
    "attestation": {
      "hash": "0xea5bee9ab7984bfddbde18a7699f2f985b7037666563948656b24e51f0de32d0",
      "signature": "0x9596e05d4987792f3fbebcbf145704565692cc265c280708dce9ec7d1c7fba62",
      "auditorId": "my-agent-007",
      "timestamp": "2026-06-18T15:18:00.000Z"
    }
  }
}
```
AI Agents running in bash executors can parse this output using `jq` to verify safety before calling transaction contracts:
```bash
# Example bash check in an Agent script
SAFE=$(npx tsx src/interface/cli.ts --address 0x... | jq '.data.isSafeForAgent')
if [ "$SAFE" = "true" ]; then
  echo "SAFE to transact."
else
  echo "WARNING: Unsafe contract bytecode. Transaction aborted."
fi
```
