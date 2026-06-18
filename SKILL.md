---
name: cryptographic-contract-auditor
description: Performs deterministic heuristic security checks on Pharos smart contracts and returns cryptographically attested risk scores. Essential for AI Agents to verify contract safety before interaction.
version: 1.0.0
author: Pharos Agent Developer
tags: [security, auditing, cryptography, defi, agent-safety, pharos]
network: pharos-testnet
chainId: 688688
---

# Cryptographic Contract Auditor

## Overview
This Skill enables AI Agents on Pharos network to safely evaluate smart contract security before interaction. It uses deterministic heuristic bytecode analysis combined with cryptographic attestation (SHA-256) to guarantee audit integrity.

## Pharos Network Integration
- **Chain ID**: 688688
- **Network**: Pharos Testnet
- **RPC**: testnet.dplabs-internal.com
- **Explorer**: testnet.pharosscan.xyz

## When to Use
- Before an AI Agent executes a swap, provides liquidity, or interacts with any contract on Pharos.
- When an Agent needs to verify if a contract has dangerous functions (SELFDESTRUCT, DELEGATECALL, etc.).
- To generate cryptographic proof that an audit was performed (tamper-evident).

## Capability Index

| User Need | Capability | Detailed Instructions |
| :--- | :--- | :--- |
| Audit smart contract security / verify safety / scan bytecode | npx tsx + CLI runner | → [references/auditor.md](file:///c:/xampp/htdocs/cryptographic-contract-auditor/references/auditor.md) |

## Inputs
- `contractAddress` (string): The Pharos contract address to audit
- `auditorId` (string): Identifier for the auditor (for attestation binding)

## Outputs
- `riskScore` (number): 0-100 risk score
- `riskLevel` (string): 'SECURE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
- `isSafeForAgent` (boolean): true if riskScore < 40
- `checks` (array): Detailed breakdown of heuristic checks
- `attestation` (object): SHA-256 hash + signature proving audit integrity

## Example Usage
```typescript
// AI Agent calls this Skill
const result = await agent.auditContract(
  "0x0000000000000000000000000000000000009999",
  "pharos-sentinel-001"
);

if (result.isSafeForAgent) {
  // Proceed with transaction
  await agent.sendTransaction(...);
} else {
  // Abort and alert
  console.log("UNSAFE CONTRACT:", result.attestation.hash);
}
```

## Security Features
- **Deterministic Analysis**: No LLM hallucination - pure bytecode pattern matching
- **Cryptographic Attestation**: SHA-256 hash of canonical JSON proves audit was performed
- **Time-Bound**: Attestation includes timestamp to prevent replay attacks
- **Auditor-Bound**: Attestation includes auditorId for accountability

## Heuristic Checks
- SELFDESTRUCT opcode (CRITICAL)
- DELEGATECALL opcode (HIGH)
- TX.ORIGIN usage (MEDIUM)
- BLOCK.TIMESTAMP usage (LOW)
