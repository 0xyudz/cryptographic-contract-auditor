import { describe, it, expect } from "vitest";
import { BasicHeuristicEngine } from "../../src/infrastructure/heuristics/basic-heuristic-engine.js";
import { ContractBytecode } from "../../src/domain/entities/bytecode.js";

describe("BasicHeuristicEngine", () => {
  const engine = new BasicHeuristicEngine();

  it("should return passed checks on clean bytecode", () => {
    // 0x6080604052
    const bytecode = new ContractBytecode("0x6080604052");
    const checks = engine.run(bytecode);

    expect(checks).toHaveLength(4);
    expect(checks.every((c) => c.passed)).toBe(true);
  });

  it("should fail HEURISTIC_SELFDESTRUCT check if 'ff' opcode is present", () => {
    const bytecode = new ContractBytecode("0x6080604052ff");
    const checks = engine.run(bytecode);

    const selfdestructCheck = checks.find((c) => c.id === "HEURISTIC_SELFDESTRUCT");
    expect(selfdestructCheck).toBeDefined();
    expect(selfdestructCheck?.passed).toBe(false);
    expect(selfdestructCheck?.severity).toBe("CRITICAL");
    expect(selfdestructCheck?.details).toContain("SELFDESTRUCT opcode");
  });

  it("should fail HEURISTIC_DELEGATECALL check if 'f4' opcode is present", () => {
    const bytecode = new ContractBytecode("0x6080604052f4");
    const checks = engine.run(bytecode);

    const delegateCheck = checks.find((c) => c.id === "HEURISTIC_DELEGATECALL");
    expect(delegateCheck).toBeDefined();
    expect(delegateCheck?.passed).toBe(false);
    expect(delegateCheck?.severity).toBe("HIGH");
    expect(delegateCheck?.details).toContain("DELEGATECALL opcode");
  });

  it("should fail HEURISTIC_TX_ORIGIN check if '46' opcode is present", () => {
    const bytecode = new ContractBytecode("0x608060405246");
    const checks = engine.run(bytecode);

    const txOriginCheck = checks.find((c) => c.id === "HEURISTIC_TX_ORIGIN");
    expect(txOriginCheck).toBeDefined();
    expect(txOriginCheck?.passed).toBe(false);
    expect(txOriginCheck?.severity).toBe("MEDIUM");
    expect(txOriginCheck?.details).toContain("ORIGIN opcode");
  });

  it("should fail HEURISTIC_BLOCK_TIMESTAMP check if '42' opcode is present", () => {
    const bytecode = new ContractBytecode("0x608060405242");
    const checks = engine.run(bytecode);

    const timestampCheck = checks.find((c) => c.id === "HEURISTIC_BLOCK_TIMESTAMP");
    expect(timestampCheck).toBeDefined();
    expect(timestampCheck?.passed).toBe(false);
    expect(timestampCheck?.severity).toBe("LOW");
    expect(timestampCheck?.details).toContain("TIMESTAMP opcode");
  });

  it("should detect multiple vulnerabilities simultaneously", () => {
    const bytecode = new ContractBytecode("0x6080604052fff44642");
    const checks = engine.run(bytecode);

    expect(checks).toHaveLength(4);
    expect(checks.every((c) => !c.passed)).toBe(true);
  });
});
