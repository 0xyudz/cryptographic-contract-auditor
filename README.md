# CrypCA

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-4CAF50?style=for-the-badge)](https://en.wikipedia.org/wiki/Multilayered_architecture)
[![Pharos Agent Kit](https://img.shields.io/badge/Ecosystem-Pharos%20Agent%20Kit-9C27B0?style=for-the-badge)](https://github.com/pharos-agent-kit/pharos-agent-kit)
[![Vitest](https://img.shields.io/badge/Tests-55%20Passing-orange?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**The Foundational Security Layer for the Pharos AI Agent Economy**

*CrypCA (Cryptographic Contract Auditor): Deterministic smart contract auditing with cryptographic attestation for autonomous DeFi agents*

[Interactive Docs](https://0xyudz.github.io/cryptographic-contract-auditor/) • [Slide Deck](https://0xyudz.github.io/cryptographic-contract-auditor/slides.html) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [Phase 2 Vision](#-phase-2-vision-sentinel-defi-agent)

</div>

---

## 🎯 The Problem

Autonomous AI Agents are deploying capital on-chain at lightning speed, but they face a critical vulnerability: **they cannot verify smart contract safety before interacting**.

- 🚨 **Blind Interactions**: Agents execute transactions without knowing if contracts contain `SELFDESTRUCT`, `DELEGATECALL`, or other dangerous opcodes.
- 💸 **Catastrophic Losses**: One interaction with a malicious contract can drain an agent's entire treasury in seconds.
- 🔓 **No Audit Trail**: Traditional LLM-based auditors hallucinate, have high latency, and provide no cryptographic proof of their analysis.
- 🎭 **Trust Deficit**: Users and other agents cannot verify if an agent actually performed due diligence before executing trades.

**Current solutions are either too slow (LLM-based) or too opaque (no proof of audit).**

---

## 💡 The Solution

`CrypCA` is a **deterministic, heuristic-based security scanner** that provides AI Agents with cryptographically provable safety guarantees before they interact with any smart contract on the Pharos network.

### Why This Matters

| Traditional Approach | Our Approach |
|---------------------|--------------|
| LLM-based analysis (slow, hallucinates) | **Deterministic opcode matching** (fast, gas-free, reliable) |
| No proof of audit | **SHA-256 cryptographic attestation** |
| Centralized trust | **Tamper-evident verification** |
| Generic security checks | **EVM-specific heuristic engine** |
| Standalone tool | **First-class Pharos Agent Kit integration** |

---

## ⚡ Key Features

### 1. **Pharos Agent Kit Integration** 🔌
Built as a native Pharos Agent Kit component with three integration layers:
- **Tool Function**: High-performance core for direct agent invocation
- **LangChain Tool**: Natural language routing for LLM-driven agents
- **Agent Action**: Metadata-rich action with strict Zod schema validation

### 2. **Deterministic Heuristic Engine** 🔍
Scans EVM bytecode for dangerous opcodes with severity classification:
- 🔴 **CRITICAL**: `SELFDESTRUCT` (`ff`) - Contract can self-destruct
- 🟠 **HIGH**: `DELEGATECALL` (`f4`) - Arbitrary code execution risk
- 🟡 **MEDIUM**: `TX.ORIGIN` (`46`) - Phishing vulnerability
- 🟢 **LOW**: `BLOCK.TIMESTAMP` (`42`) - Miner manipulation risk

### 3. **Cryptographic Attestation** 🔐
Every audit generates a **tamper-evident SHA-256 attestation**:
```json
{
  "attestation": {
    "hash": "0xea5bee9ab7984bfddbde18a7699f2f985b7037666563948656b24e51f0de32d0",
    "signature": "0x9596e05d4987792f3fbebcbf145704565692cc265c280708dce9ec7d1c7fba62",
    "auditorId": "pharos-sentinel-001",
    "timestamp": "2026-06-11T02:34:23.895Z"
  }
}
```
- **Canonical JSON**: Sorted keys ensure deterministic hashing
- **Time-bound**: Timestamp prevents replay attacks
- **Auditor-bound**: Tied to specific auditor identity
- **Verifiable**: Anyone can recompute the hash from the audit result

### 4. **Clean Architecture** 🏗️
Enterprise-grade separation of concerns:
- **Domain Layer**: Zero external dependencies, pure business logic
- **Application Layer**: Use case orchestration with dependency injection
- **Infrastructure Layer**: Concrete implementations (heuristics, crypto, blockchain)
- **Interface Layer**: Pharos Agent Kit adapters and CLI

### 5. **Comprehensive Testing** ✅
**55 unit and integration tests** passing 100%:
- Domain entities and value objects
- Application use cases
- Infrastructure implementations
- Agent Kit integration
- LangChain tool formatting

---

## 📺 Demo Video & Slides

- 🎬 **Demo Video**: [Link to Video] *(Replace with your recorded video walkthrough)*
- 📊 **Interactive Pitch Slides**: [Open Slide Deck](https://0xyudz.github.io/cryptographic-contract-auditor/slides.html) *(Designed with Outfit/Inter fonts, slide navigation, and animations)*
- 📖 **Interactive Documentation**: [Open Docsify Site](https://0xyudz.github.io/cryptographic-contract-auditor/)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AI AGENT (Pharos)                         │
│  "Audit contract 0x1234... before I swap 10 ETH for USDC"   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              PHAROS INTEGRATION LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Tool Function│  │ LangChain    │  │ Agent Action │      │
│  │              │  │ Tool         │  │ (Zod Schema) │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              APPLICATION LAYER (Use Cases)                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │ AuditContractUseCase                                │    │
│  │ 1. Validate input (Zod)                             │    │
│  │ 2. Fetch bytecode via Pharos RPC                    │    │
│  │ 3. Run heuristic analysis                           │    │
│  │ 4. Calculate risk score                             │    │
│  │ 5. Generate cryptographic attestation               │    │
│  │ 6. Return structured result                         │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              DOMAIN LAYER (Zero Dependencies)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ ContractAddr │  │ HeuristicChk │  │ RiskScore    │      │
│  │ Bytecode     │  │ AuditResult  │  │ Attestation  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              INFRASTRUCTURE LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Heuristic    │  │ SHA-256      │  │ Pharos RPC   │      │
│  │ Engine       │  │ Attestation  │  │ (viem)       │      │
│  │ (regex)      │  │ Generator    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/0xyudz/cryptographic-contract-auditor.git
cd cryptographic-contract-auditor

# Install dependencies (includes viem, langchain, @langchain/core)
npm install
```

### Run the CLI E2E Scenario Demo

See the auditor in action as it retrieves bytecode, runs the heuristic engine to identify vulnerabilities, and outputs signed cryptographic attestations:

```bash
npm run cli
```

**Expected Output:**
```json
==========================================================================
 Pharos Hackathon - @pharos/cryptographic-contract-auditor CLI Demo
==========================================================================

[SCENARIO 1] Auditing malicious contract address: 0x0000000000000000000000000000000000009999
Fetching bytecode... Success.
Running use case orchestration & generating attestation...

[MALICIOUS CONTRACT ENVELOPE OUTPUT]:
{
  "success": true,
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
      ...
    ],
    "attestation": {
      "hash": "0xea5bee9ab7984bfddbde18a7699f2f985b7037666563948656b24e51f0de32d0",
      "signature": "0x9596e05d4987792f3fbebcbf145704565692cc265c280708dce9ec7d1c7fba62",
      "auditorId": "pharos-sentinel-authority-1",
      "timestamp": "2026-06-11T02:34:23.895Z"
    }
  }
}
```

### Run the Test Suite

Verify all 55 unit tests pass:

```bash
npm test
```

---

## 📖 Usage Examples

### Example 1: Direct Tool Invocation

```typescript
import { PharosAgentKit, audit_contract } from '@pharos/cryptographic-contract-auditor';

// Initialize agent with Pharos connection
const agent = new PharosAgentKit({
  rpcUrl: 'https://testnet.dplabs-internal.com',
  chainId: 688688
});

// Audit a contract
const result = await audit_contract(
  agent,
  '0x1234567890abcdef1234567890abcdef12345678',
  'pharos-sentinel-001'
);

// Make decision based on risk score
if (result.isSafeForAgent) {
  console.log('✅ Contract is SAFE. Proceeding with transaction...');
} else {
  console.log('❌ Contract is UNSAFE. Aborting!');
  console.log('Attestation Hash:', result.attestation.hash);
}
```

### Example 2: LangChain Tool Integration

```typescript
import { PharosAgentKit, AuditContractTool } from '@pharos/cryptographic-contract-auditor';

const agent = new PharosAgentKit({ /* config */ });
const tool = new AuditContractTool(agent);

// LLM can invoke this tool via natural language
const result = await tool.invoke(
  JSON.stringify({
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    auditorId: 'pharos-sentinel-001'
  })
);

console.log(result);
```

### Example 3: Agent Action with Zod Schema

```typescript
import { PharosAgentKit, auditContractAction } from '@pharos/cryptographic-contract-auditor';

const agent = new PharosAgentKit({ /* config */ });

// Action handler with strict Zod validation boundaries
const result = await auditContractAction.handler(agent, {
  contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
  auditorId: 'pharos-sentinel-001'
});

console.log(result);
```

---

## 🔐 Cryptographic Attestation: How It Works

The attestation system ensures **audit integrity** through cryptographic guarantees:

### 1. Canonical JSON Serialization
```typescript
// Audit result is serialized with sorted keys to ensure deterministic hashing
const canonical = JSON.stringify(auditResult, Object.keys(auditResult).sort());
```

### 2. SHA-256 Hashing
```typescript
import { createHash } from 'crypto';
const hash = createHash('sha256').update(canonical).digest('hex');
```

### 3. Time-Bound Signature
```typescript
const signature = createHash('sha256')
  .update(`SIGNATURE_PREFIX_${hash}_${auditorId}_${timestamp}`)
  .digest('hex');
```

### 4. Verification
Anyone can verify the attestation by:
1. Recomputing the SHA-256 hash from the audit result.
2. Comparing it to the provided hash.
3. Checking the timestamp and auditor ID.

**This proves the audit was genuinely performed and not tampered with during transit.**

---

## 🎯 Phase 2 Vision: Sentinel DeFi Agent

This Skill is the **foundational security layer** for Phase 2: **Sentinel DeFi Agent**.

### What is Sentinel DeFi Agent?

An autonomous agent that:
1. **Monitors** new contract deployments on Pharos Testnet in real-time.
2. **Audits** every contract using this Skill before interaction.
3. **Decides** whether to execute transactions based on risk score.
4. **Publishes** attestation hashes on-chain for transparent audit trails.

### Use Cases

| Scenario | Agent Behavior |
|----------|----------------|
| New token launch detected | Audit contract → If `riskScore < 40`, provide initial liquidity. |
| User requests swap | Audit target contract → If safe, execute swap; if unsafe, abort & alert user. |
| DeFi yield farming | Audit pool contracts → Only interact with audited, safe pools. |

### On-Chain Audit Trail

Every Sentinel decision is recorded on-chain:
```solidity
event AuditDecision(
    address indexed agent,
    address indexed contractAudited,
    bytes32 attestationHash,
    uint8 riskScore,
    bool executed,
    uint256 timestamp
);
```

Users can verify: *"Did Sentinel actually audit this contract before buying?"* → **Yes, with cryptographic proof.**

---

## 📊 Technical Specifications

### Pharos Network Integration
- **Chain ID**: 688688 (Pharos Testnet)
- **RPC URL**: `https://testnet.dplabs-internal.com`
- **Block Explorer**: `https://testnet.pharosscan.xyz`

### Heuristic Checks
| Opcode | Hex | Severity | Risk |
|--------|-----|----------|------|
| SELFDESTRUCT | `ff` | CRITICAL | Contract can destroy itself, draining funds |
| DELEGATECALL | `f4` | HIGH | Arbitrary code execution from external contracts |
| TX.ORIGIN | `46` | MEDIUM | Phishing attacks, unauthorized access |
| BLOCK.TIMESTAMP | `42` | LOW | Miner manipulation, time-dependent logic |

### Risk Score Calculation
```typescript
CRITICAL failure = 40 points
HIGH failure = 20 points
MEDIUM failure = 10 points
LOW failure = 5 points

Total score capped at 100
isSafeForAgent = (riskScore < 40)
```

### Risk Levels
- **SECURE** (0-19): Safe for autonomous interaction
- **LOW** (20-39): Minor risks, proceed with caution
- **MEDIUM** (40-59): Moderate risks, manual review recommended
- **HIGH** (60-79): Significant risks, avoid unless necessary
- **CRITICAL** (80-100): Dangerous, do not interact

---

## 🧪 Testing

We maintain **55 comprehensive unit tests** across all layers:

```bash
# Run all tests
npm test
```

---

## 📦 Project Structure

```
cryptographic-contract-auditor/
├── src/
│   ├── agent/                    # Pharos Agent Kit integration
│   │   ├── chains.ts            # Pharos Testnet chain definition
│   │   └── index.ts             # PharosAgentKit class
│   ├── tools/                    # Native tool implementations
│   │   └── cryptographic_contract_auditor/
│   │       ├── audit_contract.ts # Core audit function
│   │       └── index.ts
│   ├── langchain/                # LangChain Tool wrappers
│   │   └── cryptographic_contract_auditor/
│   │       └── audit_contract.ts # AuditContractTool class
│   ├── actions/                  # Agent Actions
│   │   └── cryptographic_contract_auditor/
│   │       └── audit_contract.ts # Action with Zod schema
│   ├── types/                    # Type definitions
│   │   └── action.ts            # Action interface
│   ├── domain/                   # Clean domain layer (zero deps)
│   │   ├── entities/            # Business entities
│   │   ├── value-objects/       # Immutable value objects
│   │   ├── interfaces/          # Domain interfaces
│   │   └── errors/              # Custom errors
│   ├── application/              # Use case orchestration
│   │   ├── use-cases/           # Business logic
│   │   └── dto/                 # Data transfer objects
│   └── infrastructure/           # External implementations
│       ├── heuristics/          # Opcode scanners
│       ├── crypto/              # SHA-256 attestation
│       └── blockchain/          # RPC fetchers
├── tests/                        # Comprehensive test suite
├── SKILL.md                      # Pharos Skill manifest
├── package.json
└── tsconfig.json
```

---

## 🏆 Hackathon Submission

This project is submitted to the **Pharos Skill-to-Agent Dual Cascade Hackathon** (Phase 1: Skill Hackathon).

### Judging Criteria Alignment

| Criteria | How We Address It |
|----------|-------------------|
| **Originality** | Cryptographic attestation for AI agent audits - unique approach |
| **Technical Quality** | Clean Architecture, 55 tests, TypeScript strict mode |
| **Practical Use Case** | Solves real problem: agent security in DeFi |
| **Reusability** | Plug-and-play Pharos Agent Kit integration |
| **Deployment** | Fully functional on Pharos Testnet |
| **Documentation** | Comprehensive README, SKILL.md, docs website |
| **Ecosystem Alignment** | Directly supports Pharos AI Agent economy vision |

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built for the Pharos AI Agent Economy**

*Securing autonomous DeFi agents with cryptographic proof*

**Phase 1**: ✅ Skill (This Repository)  
**Phase 2**: 🚀 Sentinel DeFi Agent (Coming Soon)

</div>
