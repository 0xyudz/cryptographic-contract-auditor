import { HeuristicCheck } from "./heuristic-check.js";
import { RiskScoreCalculationError } from "../errors/errors.js";

export type RiskLevel = "SECURE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export class RiskScore {
  public readonly value: number;
  public readonly level: RiskLevel;

  private constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new RiskScoreCalculationError(`Risk score must be between 0 and 100, got ${value}`);
    }
    this.value = value;
    this.level = this.calculateRiskLevel(value);
  }

  /**
   * Factory method to dynamically calculate the risk score from a set of heuristic checks.
   * Capped at 100.
   */
  public static fromChecks(checks: HeuristicCheck[]): RiskScore {
    let totalScore = 0;

    for (const check of checks) {
      if (!check.passed) {
        switch (check.severity) {
          case "CRITICAL":
            totalScore += 40;
            break;
          case "HIGH":
            totalScore += 20;
            break;
          case "MEDIUM":
            totalScore += 10;
            break;
          case "LOW":
            totalScore += 5;
            break;
          case "INFO":
            totalScore += 0;
            break;
          default:
            // Fallback for unexpected string types
            break;
        }
      }
    }

    const cappedScore = Math.min(totalScore, 100);
    return new RiskScore(cappedScore);
  }

  private calculateRiskLevel(score: number): RiskLevel {
    if (score === 0) return "SECURE";
    if (score <= 20) return "LOW";
    if (score <= 50) return "MEDIUM";
    if (score <= 80) return "HIGH";
    return "CRITICAL";
  }
}
