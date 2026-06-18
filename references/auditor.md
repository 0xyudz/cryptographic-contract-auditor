# Cryptographic Contract Auditor Operation Instructions

> Network Configuration: RPC url is read from local setup or defaults to https://testnet.dplabs-internal.com.
> Execution Engine: Requires Node.js and TypeScript runner (npx tsx).

---

## Audit Contract Bytecode

### Overview
Performs a deterministic, heuristic-based security analysis on a contract's EVM bytecode. It scans for dangerous opcodes (`ff` for SELFDESTRUCT, `f4` for DELEGATECALL, `46` for TX.ORIGIN, and `42` for TIMESTAMP), computes a risk score, and provides a cryptographically attested SHA-256 signature sealing the audit integrity.

### Command Template

```bash
npx tsx src/interface/cli.ts --address <contractAddress> --auditor <auditorId>
```

### Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `--address` | `string` | Yes | The 40-character hex-encoded EVM contract address to audit (optional `0x` prefix). |
| `--auditor` | `string` | No | Identifier for the auditor performing the audit (defaults to `pharos-cli-auditor`). |

### Output Parsing

The command returns a single JSON object wrapped in a success envelope:

| Field | Type | Description |
| :--- | :--- | :--- |
| `success` | `boolean` | Indicates if the execution completed successfully. |
| `skill` | `string` | Identifies the name of the skill (`cryptographic-contract-auditor`). |
| `version` | `string` | Verifies the skill module version. |
| `data.contractAddress` | `string` | Lowercase 0x-prefixed canonical EVM address. |
| `data.riskScore` | `number` | Aggregated risk points between 0 and 100. |
| `data.riskLevel` | `string` | Qualitative risk tier (`SECURE`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`). |
| `data.isSafeForAgent` | `boolean` | Set to `true` if `riskScore < 40` (safe for agent interaction). |
| `data.checks` | `array` | Details of all heuristic scanning rules and their outcomes. |
| `data.attestation` | `object` | SHA-256 hash and mock signature sealing the audit metadata. |

### Error Handling

| Error Signature | Cause | Suggested Action |
| :--- | :--- | :--- |
| `Invalid EVM address` | Address provided does not conform to hex EVM formatting. | Confirm target address has exactly 40 hex characters. |
| `Bytecode must be a valid hex string` | The contract bytecode retrieved or provided is malformed. | Verify that the contract is compiled and verified on-chain. |
| `No contract bytecode found` | The address has no code deployed. | Verify that the target is a smart contract address. |

> **Agent Guidelines**:
> 1. Extract the contract address of the target DeFi interaction.
> 2. Execute the CLI command template passing the address parameter.
> 3. Read the output JSON object.
> 4. Verify if `data.isSafeForAgent` is `true`. If `false`, abort the transaction pipeline immediately and raise a safety warning.
