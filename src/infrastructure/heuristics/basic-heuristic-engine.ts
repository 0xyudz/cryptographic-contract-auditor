import { IHeuristicEngine } from "../../domain/interfaces/heuristic-engine.js";
import { ContractBytecode } from "../../domain/entities/bytecode.js";
import { HeuristicCheck } from "../../domain/entities/heuristic-check.js";

export class BasicHeuristicEngine implements IHeuristicEngine {
  /**
   * Scans a given EVM bytecode using a set of deterministic heuristics.
   * Looks for ff (SELFDESTRUCT), f4 (DELEGATECALL), 46 (TX.ORIGIN), and 42 (TIMESTAMP).
   */
  public run(bytecode: ContractBytecode): HeuristicCheck[] {
    const rawHex = bytecode.getRawHex().toLowerCase();

    return [
      this.checkSelfdestruct(rawHex),
      this.checkDelegatecall(rawHex),
      this.checkTxOrigin(rawHex),
      this.checkBlockTimestamp(rawHex),
    ];
  }

  private checkSelfdestruct(rawHex: string): HeuristicCheck {
    const passed = !rawHex.includes("ff");
    return new HeuristicCheck({
      id: "HEURISTIC_SELFDESTRUCT",
      name: "SELFDESTRUCT Check",
      description: "Detects SELFDESTRUCT/SUICIDE opcode (ff) which allows the contract to be destroyed.",
      severity: "CRITICAL",
      passed,
      details: passed ? undefined : "SELFDESTRUCT opcode 'ff' detected in contract bytecode",
    });
  }

  private checkDelegatecall(rawHex: string): HeuristicCheck {
    const passed = !rawHex.includes("f4");
    return new HeuristicCheck({
      id: "HEURISTIC_DELEGATECALL",
      name: "DELEGATECALL Check",
      description: "Detects DELEGATECALL opcode (f4) which allows execution of external code in calling context.",
      severity: "HIGH",
      passed,
      details: passed ? undefined : "DELEGATECALL opcode 'f4' detected in contract bytecode",
    });
  }

  private checkTxOrigin(rawHex: string): HeuristicCheck {
    const passed = !rawHex.includes("46");
    return new HeuristicCheck({
      id: "HEURISTIC_TX_ORIGIN",
      name: "TX.ORIGIN Check",
      description: "Detects ORIGIN opcode (46) representing tx.origin, which can lead to phishing vulnerability.",
      severity: "MEDIUM",
      passed,
      details: passed ? undefined : "ORIGIN opcode '46' (tx.origin) detected in contract bytecode",
    });
  }

  private checkBlockTimestamp(rawHex: string): HeuristicCheck {
    const passed = !rawHex.includes("42");
    return new HeuristicCheck({
      id: "HEURISTIC_BLOCK_TIMESTAMP",
      name: "BLOCK.TIMESTAMP Check",
      description: "Detects TIMESTAMP opcode (42) representing block.timestamp, vulnerable to miner manipulation.",
      severity: "LOW",
      passed,
      details: passed ? undefined : "TIMESTAMP opcode '42' (block.timestamp) detected in contract bytecode",
    });
  }
}
