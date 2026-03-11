/**
 * create-address.ts
 *
 * Creates a ZeroDev Smart Routing Address (SRA) that accepts deposits from
 * multiple source testnets and automatically routes them to Base Sepolia.
 *
 * Usage:
 *   npx tsx src/create-address.ts
 *
 * Required env:
 *   OWNER_ADDRESS — your wallet address
 */

import { createSmartRoutingAddress } from "@zerodev/smart-routing-address"
import { DEST_CHAIN, OWNER_ADDRESS, SRC_CHAINS } from "./config"

async function main() {
  console.log("=== ZeroDev Smart Routing Address POC ===\n")
  console.log(`Destination chain : ${DEST_CHAIN.name} (chain ID ${DEST_CHAIN.id})`)
  console.log(`Owner address     : ${OWNER_ADDRESS}`)
  console.log(
    `Source chains     : ${SRC_CHAINS.map((c) => c.name).join(", ")}`
  )
  console.log("\nCreating Smart Routing Address...")

  const result = await createSmartRoutingAddress({
    owner: OWNER_ADDRESS,
    destChain: DEST_CHAIN,
    slippage: 100, // 1% max slippage
    srcTokens: [
      // Accept USDC from each source chain
      { tokenType: "USDC", chain: SRC_CHAINS[0] }, // Arbitrum Sepolia
      { tokenType: "USDC", chain: SRC_CHAINS[1] }, // Sepolia
      // Accept native ETH (both chains are in NATIVE_TOKENS_SUPPORTED)
      { tokenType: "NATIVE", chain: SRC_CHAINS[0] }, // Arbitrum Sepolia
      { tokenType: "NATIVE", chain: SRC_CHAINS[1] }, // Sepolia
    ],
    actions: {
      // No on-chain action — just receive the bridged tokens on dest chain
      USDC: { action: [], fallBack: [] },
      NATIVE: { action: [], fallBack: [] },
    },
  })

  console.log("\n✅ Smart Routing Address created!\n")
  console.log(`  Address : ${result.smartRoutingAddress}`)
  console.log("")
  console.log("Fee estimates by source chain:")

  for (const feeEntry of result.estimatedFees) {
    const chainName =
      SRC_CHAINS.find((c) => c.id === feeEntry.chainId)?.name ??
      `Chain ${feeEntry.chainId}`
    console.log(`\n  ${chainName} (chain ID ${feeEntry.chainId}):`)
    for (const token of feeEntry.data) {
      const fee = BigInt(token.fee)
      const minDeposit = BigInt(token.minDeposit)
      const decimals = token.decimal
      const fmt = (n: bigint) =>
        (Number(n) / 10 ** decimals).toFixed(decimals > 6 ? 6 : decimals)
      console.log(
        `    ${token.name.padEnd(14)} fee: ${fmt(fee).padStart(12)}  minDeposit: ${fmt(minDeposit)}`
      )
    }
  }

  console.log("\n---")
  console.log("Next steps:")
  console.log(`  1. Send USDC or ETH to ${result.smartRoutingAddress}`)
  console.log(
    `     from any of: ${SRC_CHAINS.map((c) => c.name).join(", ")}`
  )
  console.log(
    `  2. ZeroDev will automatically bridge the funds to ${DEST_CHAIN.name}`
  )
  console.log(
    `  3. Track status: npx tsx src/check-status.ts ${result.smartRoutingAddress}`
  )
}

main().catch((err) => {
  console.error("Error:", err.message ?? err)
  process.exit(1)
})
