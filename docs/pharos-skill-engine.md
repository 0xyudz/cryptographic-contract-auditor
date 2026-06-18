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

1.  **E2E Demo Mode** (No arguments):
    ```bash
    npx tsx src/interface/cli.ts
    ```
    Runs Scenario 1 & Scenario 2 automatically, outputting explanatory logs for developers.
2.  **Skill Engine CLI Mode** (With arguments):
    ```bash
    npx tsx src/interface/cli.ts --address <contractAddress> --auditor <auditorId>
    ```
    Executes a single audit on the target contract and prints **only** the raw JSON output envelope. This allows the AI Agent terminal runner to parse the JSON output directly without being cluttered by decorative console messages.
