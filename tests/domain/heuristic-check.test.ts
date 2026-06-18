import { describe, it, expect } from "vitest";
import { HeuristicCheck } from "../../src/domain/entities/heuristic-check.js";

describe("HeuristicCheck", () => {
  it("should create a valid heuristic check", () => {
    const check = new HeuristicCheck({
      id: "SELFDESTRUCT",
      name: "Selfdestruct Check",
      description: "Detects selfdestruct instruction",
      severity: "CRITICAL",
      passed: false,
      details: "selfdestruct instruction found at instruction 100",
    });

    expect(check.id).toBe("SELFDESTRUCT");
    expect(check.name).toBe("Selfdestruct Check");
    expect(check.description).toBe("Detects selfdestruct instruction");
    expect(check.severity).toBe("CRITICAL");
    expect(check.passed).toBe(false);
    expect(check.details).toBe("selfdestruct instruction found at instruction 100");
  });

  it("should throw error if id is empty", () => {
    expect(() => new HeuristicCheck({
      id: "",
      name: "Check",
      description: "Desc",
      severity: "INFO",
      passed: true
    })).toThrow("Heuristic check ID cannot be empty");
  });

  it("should throw error if name is empty", () => {
    expect(() => new HeuristicCheck({
      id: "ID",
      name: "",
      description: "Desc",
      severity: "INFO",
      passed: true
    })).toThrow("Heuristic check name cannot be empty");
  });

  it("should throw error if description is empty", () => {
    expect(() => new HeuristicCheck({
      id: "ID",
      name: "Check",
      description: "",
      severity: "INFO",
      passed: true
    })).toThrow("Heuristic check description cannot be empty");
  });
});
