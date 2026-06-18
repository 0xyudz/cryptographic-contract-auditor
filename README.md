# @pharos/cryptographic-contract-auditor

[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-success.svg?style=for-the-badge)](https://en.wikipedia.org/wiki/Multilayered_architecture)
[![Pharos Agent Kit](https://img.shields.io/badge/Ecosystem-Pharos%20Agent%20Kit-purple.svg?style=for-the-badge)](https://github.com/pharos-agent-kit/pharos-agent-kit)
[![Vitest](https://img.shields.io/badge/Tests-Vitest-orange.svg?style=for-the-badge&logo=vitest)](https://vitest.dev/)

A deterministic, heuristic-based smart contract security scanner integrated directly with the official **Pharos Agent Kit** ecosystem. It returns a cryptographically attested risk score to guarantee safety for autonomous DeFi Agents.

---

## 🌟 The Product Vision & Agent Kit Integration

Autonomous AI Agents operating in DeFi need a standardized, reliable method to verify smart contract safety before invoking transactions. `@pharos/cryptographic-contract-auditor` implements the official Pharos Agent Kit specs to integrate seamlessly as a Tool, a LangChain Tool, or an Action.

*   **Tool Function**: High-performance core module for direct agent invocation.
*   **LangChain Tool Wrapper**: Natural-language-to-tool routing support for LLM-driven agents.
*   **Agent Action**: Metadata-rich action with strict Zod validations for structured agent reasoning.

---

## ⚡ Key Features

1.  **Pharos Network Connection**: Integrates with the official Pharos Testnet RPC (Chain ID: `688688`) using `viem` to fetch live contract bytecodes.
2.  **Deterministic Heuristic Scans**: Matches bytecode against dangerous opcodes:
    *   **CRITICAL**: `SELFDESTRUCT` (`ff`)
    *   **HIGH**: `DELEGATECALL` (`f4`)
    *   **MEDIUM**: `TX.ORIGIN` (`46`)
    *   **LOW**: `BLOCK.TIMESTAMP` (`42`)
3.  **Cryptographic Attestation**: Computes and signs a canonical SHA-256 hash representing the audit results, preventing audit tampering.
4.  **Time-bound Integrity**: Bounds audits to a timestamp and auditor identifier to safeguard against replay attacks.

---

## 🏗️ Refactored Folder Structure

Conforms directly to the Pharos Agent Kit standards:

```text
src/
├── agent/            # PharosAgentKit integration & chains definition
├── tools/            # Native tool implementations (uses agent.connection)
├── langchain/        # LangChain custom Tool wrapper classes
├── actions/          # Agent Actions (Zod validated schemas & handlers)
├── types/            # Common type definitions (Action interface)
├── domain/           # Core clean domain entities (zero-dependencies)
├── application/      # Use case orchestrations
└── infrastructure/   # Heuristics scanners and SHA-256 generators
```

---

## 🚀 Quick Start

### 1. Installation

Install project dependencies including standard Agent Kit modules (`viem`, `langchain`, `@langchain/core`):

```bash
npm install
```

### 2. Run the Agent Integration Demo

Launch the simulated agent scenario to witness the tool query contract bytecodes and dynamically output the audit attestation payload:

```bash
npx tsx examples/agent-demo.ts
```

### 3. Run the Test Suite

We maintain a comprehensive suite of unit tests verifying all layers, tool adaptors, and LLM formatting outputs:

```bash
npm test
```

---

## 📖 Comprehensive Documentation

### 🌐 Live Online Documentation
If you host this repository on GitHub with GitHub Pages enabled, the premium interactive documentation will be live at:
`https://<your-github-username>.github.io/cryptographic-contract-auditor`

### 📄 Local Markdown Documentation
For local offline reading, the documentation is located inside the `docs/` folder:

*   [**Table of Contents (SUMMARY.md)**](file:///c:/xampp/htdocs/cryptographic-contract-auditor/docs/SUMMARY.md): Navigation sidebar outline.
*   [**Introduction & Vision**](file:///c:/xampp/htdocs/cryptographic-contract-auditor/docs/introduction.md): The DeFi agent safety challenge and the Dual-Cascade roadmap.
*   [**Clean Architecture Design**](file:///c:/xampp/htdocs/cryptographic-contract-auditor/docs/architecture.md): Decoding layer separations, DDD, and our zero-dependency domain policy.
*   [**Pharos Agent Kit Integration**](file:///c:/xampp/htdocs/cryptographic-contract-auditor/docs/pharos-agent-kit.md): Details on tools, LangChain integration, and structured Actions.
*   [**Pharos Skill Engine CLI**](file:///c:/xampp/htdocs/cryptographic-contract-auditor/docs/pharos-skill-engine.md): Configuration for capability index tables and markdown command specs.
*   [**Verification Suite**](file:///c:/xampp/htdocs/cryptographic-contract-auditor/docs/verification.md): Overview of automated Vitest verification.
