import { describe, it, expect } from "vitest";
import { HeuristicCheck } from "../../src/domain/entities/heuristic-check.js";
import { RiskScore } from "../../src/domain/entities/risk-score.js";

describe("RiskScore", () => {
  it("should calculate 0 score (SECURE) if all checks passed", () => {
    const checks = [
      new HeuristicCheck({ id: "1", name: "C1", description: "D1", severity: "CRITICAL", passed: true }),
      new HeuristicCheck({ id: "2", name: "C2", description: "D2", severity: "HIGH", passed: true }),
    ];

    const score = RiskScore.fromChecks(checks);
    expect(score.value).toBe(0);
    expect(score.level).toBe("SECURE");
  });

  it("should calculate score and level correctly for single failed checks", () => {
    // LOW: 5 pts
    const lowCheck = new HeuristicCheck({ id: "1", name: "C1", description: "D1", severity: "LOW", passed: false });
    expect(RiskScore.fromChecks([lowCheck]).value).toBe(5);
    expect(RiskScore.fromChecks([lowCheck]).level).toBe("LOW");

    // MEDIUM: 10 pts
    const medCheck = new HeuristicCheck({ id: "2", name: "C2", description: "D2", severity: "MEDIUM", passed: false });
    expect(RiskScore.fromChecks([medCheck]).value).toBe(10);
    expect(RiskScore.fromChecks([medCheck]).level).toBe("LOW");

    // HIGH: 20 pts
    const highCheck = new HeuristicCheck({ id: "3", name: "C3", description: "D3", severity: "HIGH", passed: false });
    expect(RiskScore.fromChecks([highCheck]).value).toBe(20);
    expect(RiskScore.fromChecks([highCheck]).level).toBe("LOW");

    // CRITICAL: 40 pts
    const critCheck = new HeuristicCheck({ id: "4", name: "C4", description: "D4", severity: "CRITICAL", passed: false });
    expect(RiskScore.fromChecks([critCheck]).value).toBe(40);
    expect(RiskScore.fromChecks([critCheck]).level).toBe("MEDIUM");
  });

  it("should aggregate scores and cap at 100", () => {
    const checks = [
      new HeuristicCheck({ id: "1", name: "C1", description: "D1", severity: "CRITICAL", passed: false }), // 40
      new HeuristicCheck({ id: "2", name: "C2", description: "D2", severity: "CRITICAL", passed: false }), // 40
      new HeuristicCheck({ id: "3", name: "C3", description: "D3", severity: "HIGH", passed: false }),     // 20
      new HeuristicCheck({ id: "4", name: "C4", description: "D4", severity: "MEDIUM", passed: false }),   // 10
    ];

    const score = RiskScore.fromChecks(checks);
    expect(score.value).toBe(100); // capped
    expect(score.level).toBe("CRITICAL");
  });

  it("should categorize levels correctly", () => {
    // SECURE: 0
    expect(RiskScore.fromChecks([]).level).toBe("SECURE");

    // LOW: 1-20
    const checkLow = new HeuristicCheck({ id: "1", name: "C", description: "D", severity: "HIGH", passed: false }); // 20
    expect(RiskScore.fromChecks([checkLow]).level).toBe("LOW");

    // MEDIUM: 21-50
    const checkMed = new HeuristicCheck({ id: "1", name: "C", description: "D", severity: "CRITICAL", passed: false }); // 40
    expect(RiskScore.fromChecks([checkMed]).level).toBe("MEDIUM");

    // HIGH: 51-80
    const checkHigh = [
      new HeuristicCheck({ id: "1", name: "C", description: "D", severity: "CRITICAL", passed: false }), // 40
      new HeuristicCheck({ id: "2", name: "C", description: "D", severity: "HIGH", passed: false }), // 20
    ]; // 60
    expect(RiskScore.fromChecks(checkHigh).level).toBe("HIGH");

    // CRITICAL: 81-100
    const checkCrit = [
      new HeuristicCheck({ id: "1", name: "C", description: "D", severity: "CRITICAL", passed: false }), // 40
      new HeuristicCheck({ id: "2", name: "C", description: "D", severity: "CRITICAL", passed: false }), // 40
      new HeuristicCheck({ id: "3", name: "C", description: "D", severity: "HIGH", passed: false }), // 20
    ]; // 100
    expect(RiskScore.fromChecks(checkCrit).level).toBe("CRITICAL");
  });
});
