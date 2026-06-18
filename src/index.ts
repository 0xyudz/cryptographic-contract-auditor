// Core Agent Kit Integration
export { PharosAgentKit, PharosAgentKitConfig } from "./agent/index.js";
export { pharosTestnet } from "./agent/chains.js";

// Native Tools
export { audit_contract } from "./tools/cryptographic_contract_auditor/index.js";

// LangChain Integration
export { AuditContractTool } from "./langchain/cryptographic_contract_auditor/audit_contract.js";

// Agent Actions
export { auditContractAction } from "./actions/cryptographic_contract_auditor/audit_contract.js";

// Domain Models, Entities & Value Objects
export { ContractAddress } from "./domain/value-objects/address.js";
export { AttestationHash, Signature } from "./domain/value-objects/attestation.js";
export { ContractBytecode } from "./domain/entities/bytecode.js";
export { HeuristicCheck, Severity, HeuristicCheckProps } from "./domain/entities/heuristic-check.js";
export { RiskScore, RiskLevel } from "./domain/entities/risk-score.js";
export { AuditResult, AuditResultProps } from "./domain/entities/audit-result.js";

// Interfaces
export { IHeuristicEngine } from "./domain/interfaces/heuristic-engine.js";
export { IAttestationGenerator } from "./domain/interfaces/attestation-generator.js";

// Custom Domain Errors
export {
  DomainError,
  ValidationError,
  InvalidAddressError,
  InvalidBytecodeError,
  RiskScoreCalculationError,
} from "./domain/errors/errors.js";

// Types
export { Action } from "./types/action.js";
