import { AuditContractUseCase } from "../application/use-cases/audit-contract.use-case.js";
import { BasicHeuristicEngine } from "../infrastructure/heuristics/basic-heuristic-engine.js";
import { Sha256AttestationGenerator } from "../infrastructure/crypto/sha256-attestation-generator.js";
import { MockBytecodeFetcher } from "../infrastructure/blockchain/mock-bytecode-fetcher.js";
import { ContractAddress } from "../domain/value-objects/address.js";
import { PharosSkillAdapter } from "./adapters/pharos-skill-adapter.js";

async function main() {
  const args = process.argv.slice(2);
  let addressArg = "";
  let auditorArg = "pharos-cli-auditor";

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--address" || args[i] === "-a") && args[i + 1]) {
      addressArg = args[i + 1];
      i++;
    } else if ((args[i] === "--auditor" || args[i] === "-u") && args[i + 1]) {
      auditorArg = args[i + 1];
      i++;
    }
  }

  // 1. Instantiate concrete Infrastructure modules
  const heuristicEngine = new BasicHeuristicEngine();
  const attestationGenerator = new Sha256AttestationGenerator();
  const bytecodeFetcher = new MockBytecodeFetcher();

  // 2. Inject dependencies into Use Case
  const auditUseCase = new AuditContractUseCase(heuristicEngine, attestationGenerator);

  if (addressArg) {
    try {
      const contractAddress = new ContractAddress(addressArg);
      const bytecode = await bytecodeFetcher.fetch(contractAddress);
      
      const resultRaw = await auditUseCase.execute({
        contractAddress: contractAddress.getValue(),
        bytecode: bytecode.getValue(),
        auditorId: auditorArg,
      });

      const response = PharosSkillAdapter.toResponse(resultRaw);
      console.log(JSON.stringify(response, null, 2));
    } catch (error: any) {
      console.error(JSON.stringify({
        success: false,
        error: error.message || error
      }, null, 2));
      process.exit(1);
    }
  } else {
    // Run the default E2E Demo Scenarios
    console.log("==========================================================================");
    console.log(" Pharos Hackathon - @pharos/cryptographic-contract-auditor CLI Demo");
    console.log("==========================================================================\n");

    const maliciousAddress = new ContractAddress("0x0000000000000000000000000000000000009999");
    const secureAddress = new ContractAddress("0x0000000000000000000000000000000000000001");
    const auditorId = "pharos-sentinel-authority-1";

    try {
      // === SCENARIO 1: Malicious Contract Audit ===
      console.log(`[SCENARIO 1] Auditing malicious contract address: ${maliciousAddress.getValue()}`);
      const maliciousBytecode = await bytecodeFetcher.fetch(maliciousAddress);
      
      console.log("Fetching bytecode... Success.");
      console.log("Running use case orchestration & generating attestation...");
      
      const maliciousResultRaw = await auditUseCase.execute({
        contractAddress: maliciousAddress.getValue(),
        bytecode: maliciousBytecode.getValue(),
        auditorId,
      });
      
      const maliciousResponse = PharosSkillAdapter.toResponse(maliciousResultRaw);
      console.log("\n[MALICIOUS CONTRACT ENVELOPE OUTPUT]:");
      console.log(JSON.stringify(maliciousResponse, null, 2));
      console.log("\n--------------------------------------------------------------------------\n");

      // === SCENARIO 2: Secure Contract Audit ===
      console.log(`[SCENARIO 2] Auditing secure contract address: ${secureAddress.getValue()}`);
      const secureBytecode = await bytecodeFetcher.fetch(secureAddress);
      
      console.log("Fetching bytecode... Success.");
      console.log("Running use case orchestration & generating attestation...");
      
      const secureResultRaw = await auditUseCase.execute({
        contractAddress: secureAddress.getValue(),
        bytecode: secureBytecode.getValue(),
        auditorId,
      });
      
      const secureResponse = PharosSkillAdapter.toResponse(secureResultRaw);
      console.log("\n[SECURE CONTRACT ENVELOPE OUTPUT]:");
      console.log(JSON.stringify(secureResponse, null, 2));
      console.log("\n==========================================================================");

    } catch (error) {
      console.error("An error occurred during CLI audit run:", error);
      process.exit(1);
    }
  }
}

main();
