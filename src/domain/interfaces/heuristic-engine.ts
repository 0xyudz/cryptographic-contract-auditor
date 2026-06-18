import { ContractBytecode } from "../entities/bytecode.js";
import { HeuristicCheck } from "../entities/heuristic-check.js";

export interface IHeuristicEngine {
  /**
   * Scans a given EVM bytecode using a set of deterministic heuristics.
   * 
   * @param bytecode The contract bytecode entity to audit.
   * @returns An array of heuristic check results.
   */
  run(bytecode: ContractBytecode): HeuristicCheck[];
}
