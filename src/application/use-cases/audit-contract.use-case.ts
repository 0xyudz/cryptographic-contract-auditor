import { AuditContractInputSchema, AuditContractOutput, AuditContractOutputSchema } from "../dto/audit-contract.dto.js";
import { ContractAddress } from "../../domain/value-objects/address.js";
import { ContractBytecode } from "../../domain/entities/bytecode.js";
import { RiskScore } from "../../domain/entities/risk-score.js";
import { AuditResult } from "../../domain/entities/audit-result.js";
import { IHeuristicEngine } from "../../domain/interfaces/heuristic-engine.js";
import { IAttestationGenerator } from "../../domain/interfaces/attestation-generator.js";

export class AuditContractUseCase {
  constructor(
    private readonly heuristicEngine: IHeuristicEngine,
    private readonly attestationGenerator: IAttestationGenerator
  ) {}

  /**
   * Executes the smart contract audit flow.
   * Parses validation inputs, invokes heuristic checks, processes risk calculations,
   * performs cryptographic attestation, and maps outputs to the defined DTO structure.
   */
  public async execute(rawInput: unknown): Promise<AuditContractOutput> {
    // 1. Parse and validate the input
    const input = AuditContractInputSchema.parse(rawInput);

    // 2. Instantiate Domain Value Objects/Entities
    const contractAddress = new ContractAddress(input.contractAddress);
    const bytecode = new ContractBytecode(input.bytecode);

    // 3. Invoke deterministic bytecode analysis
    const checks = this.heuristicEngine.run(bytecode);

    // 4. Calculate risk score dynamically
    const riskScore = RiskScore.fromChecks(checks);

    // 5. Generate validation timestamp (Epoch milliseconds)
    const timestamp = Date.now();

    // 6. Instantiate AuditResult entity
    const rawResult = new AuditResult({
      contractAddress,
      bytecode,
      checks,
      riskScore,
      timestamp,
      auditorId: input.auditorId,
    });

    // 7. Generate cryptographic attestation
    const hash = this.attestationGenerator.generateHash(rawResult, input.auditorId, timestamp);
    const signature = this.attestationGenerator.sign(hash);

    // 8. Bind the attestation back to the audit result
    const attestedResult = rawResult.attest(hash, signature);

    // 9. Format response structure
    const output: AuditContractOutput = {
      contractAddress: attestedResult.contractAddress.getValue(),
      riskScore: attestedResult.riskScore.value,
      riskLevel: attestedResult.riskScore.level,
      isSafeForAgent: attestedResult.riskScore.value < 40,
      checks: attestedResult.checks.map((check) => ({
        id: check.id,
        name: check.name,
        severity: check.severity,
        passed: check.passed,
        details: check.details,
      })),
      attestation: {
        hash: hash.getValue(),
        signature: signature.getValue(),
        auditorId: attestedResult.auditorId,
        timestamp: new Date(timestamp).toISOString(),
      },
    };

    // 10. Verify structure conforms to the output schema
    return AuditContractOutputSchema.parse(output);
  }
}
