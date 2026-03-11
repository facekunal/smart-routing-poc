import "dotenv/config"
import { arbitrumSepolia, baseSepolia, sepolia } from "viem/chains"

// Destination chain: Base Sepolia (fully supported by ZeroDev SRA SDK)
// NOTE: Monad testnet (chain ID 10143) is not yet in the ZeroDev SRA registry.
export const DEST_CHAIN = baseSepolia

// Source chains supported by the ZeroDev SRA SDK (testnets with TOKEN_ADDRESSES entries):
//   421614 = Arbitrum Sepolia  ✓ USDC + NATIVE
//   11155111 = Sepolia          ✓ USDC + NATIVE
//   84532 = Base Sepolia        ✓ USDC + NATIVE (used as dest, but can also be a source)
// NOT supported: 11155420 (OP Sepolia), 80001 (Mumbai)
export const SRC_CHAINS = [arbitrumSepolia, sepolia] as const

// Owner address — authorized to recover funds if needed
export const OWNER_ADDRESS = process.env.OWNER_ADDRESS as `0x${string}`

if (!OWNER_ADDRESS || !OWNER_ADDRESS.startsWith("0x")) {
  throw new Error("OWNER_ADDRESS env var is required (e.g. 0xYourWallet...)")
}

// Token types to accept on each source chain
export const SRC_TOKEN_TYPES = ["USDC", "NATIVE"] as const
