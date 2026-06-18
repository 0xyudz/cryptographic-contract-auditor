import { createPublicClient, http, PublicClient } from "viem";
import { pharosTestnet } from "./chains.js";
import { audit_contract } from "../tools/cryptographic_contract_auditor/audit_contract.js";

export interface PharosAgentKitConfig {
  rpcUrl?: string;
  chainId?: number;
}

export class PharosAgentKit {
  public readonly connection: PublicClient;

  constructor(config: PharosAgentKitConfig = {}) {
    const rpcUrl = config.rpcUrl || "https://testnet.dplabs-internal.com";
    this.connection = createPublicClient({
      chain: pharosTestnet,
      transport: http(rpcUrl),
    });
  }

  /**
   * Performs an audit on the target smart contract address.
   * Exposes the audit_contract tool function through the Agent interface.
   */
  public async auditContract(contractAddress: string, auditorId: string): Promise<any> {
    return audit_contract(this, contractAddress as `0x${string}`, auditorId);
  }
}
