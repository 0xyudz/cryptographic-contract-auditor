import { describe, it, expect } from "vitest";
import { MockBytecodeFetcher } from "../../src/infrastructure/blockchain/mock-bytecode-fetcher.js";
import { ContractAddress } from "../../src/domain/value-objects/address.js";

describe("MockBytecodeFetcher", () => {
  const fetcher = new MockBytecodeFetcher();

  it("should fetch safe bytecode for preset address 0x...1", async () => {
    const address = new ContractAddress("0x0000000000000000000000000000000000000001");
    const bytecode = await fetcher.fetch(address);

    expect(bytecode.getValue()).toBe("0x6080604052348015600f57600080fd5b5060043610602857");
  });

  it("should fetch bytecode containing SELFDESTRUCT for preset address 0x...ff", async () => {
    const address = new ContractAddress("0x00000000000000000000000000000000000000ff");
    const bytecode = await fetcher.fetch(address);

    expect(bytecode.getValue()).toBe("0x6080604052ff");
  });

  it("should return default bytecode if address has no preset", async () => {
    const address = new ContractAddress("0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead");
    const bytecode = await fetcher.fetch(address);

    expect(bytecode.getValue()).toBe("0x6080604052348015600f57600080fd5b5060043610602857");
  });
});
