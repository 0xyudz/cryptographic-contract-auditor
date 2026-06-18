# Verification & Test Suite

To ensure the technical quality and correctness of the `@pharos/cryptographic-contract-auditor` package, we maintain a comprehensive suite of unit and integration tests.

---

## 🧪 Test Coverage & Organization

We have implemented **55 automated tests** across 11 test files covering 100% of the project's critical paths:

```text
tests/
├── domain/
│   ├── address.test.ts          # ContractAddress EVM format check
│   ├── attestation.test.ts      # AttestationHash and Signature syntax checks
│   ├── bytecode.test.ts         # Even-length check, raw bytecode utility tests
│   ├── heuristic-check.test.ts  # Properties validation
│   ├── risk-score.test.ts       # Points arithmetic check (CRITICAL=40, etc.)
│   └── audit-result.test.ts     # Immutable result binding and attestation check
├── application/
│   └── audit-contract.use-case.test.ts # Orchestrations and mocked boundary checks
├── infrastructure/
│   ├── basic-heuristic-engine.test.ts  # Matching ff, f4, 46, 42 opcodes
│   ├── sha256-attestation-generator.test.ts # Deterministic SHA-256 keys-sorted hashing
│   └── mock-bytecode-fetcher.test.ts   # Presets target tests
├── interface/
│   └── pharos-skill-adapter.test.ts    # Wrapping outputs in JSON envelopes
├── agent/
│   └── agent.test.ts            # E2E Agent kit client connection tests
└── langchain/
    └── langchain.test.ts        # LangChain tool call formatting and JSON output tests
```

---

## ⚙️ Running the Test Suite

Run the full automated test suite using:

```bash
npm test
```

### Typical Verification Run Output

```text
 RUN  v1.6.1 C:/xampp/htdocs/cryptographic-contract-auditor

 ✓ tests/agent/agent.test.ts  (2 tests) 4208ms
 ✓ tests/langchain/langchain.test.ts  (3 tests) 6495ms
 ✓ tests/domain/address.test.ts  (6 tests) 12ms
 ✓ tests/domain/risk-score.test.ts  (4 tests) 15ms
 ✓ tests/domain/attestation.test.ts  (8 tests) 15ms
 ✓ tests/infrastructure/basic-heuristic-engine.test.ts  (6 tests) 21ms
 ✓ tests/domain/audit-result.test.ts  (2 tests) 12ms
 ✓ tests/infrastructure/sha256-attestation-generator.test.ts  (6 tests) 17ms
 ✓ tests/application/audit-contract.use-case.test.ts  (3 tests) 32ms
 ✓ tests/domain/bytecode.test.ts  (7 tests) 29ms
 ✓ tests/domain/heuristic-check.test.ts  (4 tests) 20ms
 ✓ tests/infrastructure/mock-bytecode-fetcher.test.ts  (3 tests) 9ms
 ✓ tests/interface/pharos-skill-adapter.test.ts  (1 test) 8ms

 Test Files  13 passed (13)
      Tests  55 passed (55)
   Duration  18.96s
```
