import { defineChain } from "viem";

export const pharosTestnet = defineChain({
  id: 688688,
  name: "Pharos Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "PROS",
    symbol: "PROS",
  },
  rpcUrls: {
    default: { http: ["https://testnet.dplabs-internal.com"] },
  },
  blockExplorers: {
    default: { name: "PharosScan", url: "https://testnet.pharosscan.xyz" },
  },
  testnet: true,
});
