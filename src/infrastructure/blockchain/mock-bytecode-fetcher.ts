import { ContractAddress } from "../../domain/value-objects/address.js";
import { ContractBytecode } from "../../domain/entities/bytecode.js";

export class MockBytecodeFetcher {
  private readonly mockBytecodes: Record<string, string> = {
    // 1. A clean, safe contract (minimal deployment bytecode example)
    "0x0000000000000000000000000000000000000001": "0x6080604052348015600f57600080fd5b5060043610602857",
    
    // 2. Contract with SELFDESTRUCT (opcode ff)
    "0x00000000000000000000000000000000000000ff": "0x6080604052ff",
    
    // 3. Contract with DELEGATECALL (opcode f4)
    "0x00000000000000000000000000000000000000f4": "0x6080604052f4",
    
    // 4. Contract with tx.origin (opcode 46)
    "0x0000000000000000000000000000000000000046": "0x608060405246",
    
    // 5. Contract with block.timestamp (opcode 42)
    "0x0000000000000000000000000000000000000042": "0x608060405242",

    // 6. Contract with all dangerous opcodes (ff, f4, 46, 42)
    "0x0000000000000000000000000000000000009999": "0x6080604052fff44642",
  };

  /**
   * Mock-fetches bytecode by contract address.
   * If the address doesn't match any mock preset, returns a default safe bytecode.
   */
  public async fetch(contractAddress: ContractAddress): Promise<ContractBytecode> {
    const canonicalAddr = contractAddress.getValue();
    const bytecodeHex = this.mockBytecodes[canonicalAddr] ?? "0x6080604052348015600f57600080fd5b5060043610602857";
    return new ContractBytecode(bytecodeHex);
  }
}
