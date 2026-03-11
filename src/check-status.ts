/**
 * check-status.ts
 *
 * Polls the status of a Smart Routing Address — shows deposit, bridge,
 * and execution status for funds sent to the SRA.
 *
 * Usage:
 *   npx tsx src/check-status.ts <smartRoutingAddress>
 *
 * Example:
 *   npx tsx src/check-status.ts 0xAbCd...1234
 */

import { getSmartRoutingAddressStatus } from "@zerodev/smart-routing-address"

async function main() {
  const rawArg = process.argv[2]

  if (!rawArg || !rawArg.startsWith("0x")) {
    console.error(
      "Usage: npx tsx src/check-status.ts <smartRoutingAddress>"
    )
    process.exit(1)
  }

  const sraAddress = rawArg as `0x${string}`

  console.log("=== Smart Routing Address Status ===\n")
  console.log(`SRA address  : ${sraAddress}`)
  console.log("\nFetching status...\n")

  const result = await getSmartRoutingAddressStatus({
    smartRoutingAddress: sraAddress,
  })

  if (!result || result.totalCount === 0) {
    console.log("No deposits found yet. Send funds to the SRA and try again.")
    return
  }

  console.log(`Total deposits: ${result.totalCount}  (page ${result.nextPage ?? result.totalPages}/${result.totalPages})\n`)

  for (const deposit of result.deposits) {
    console.log("--- Deposit ---")
    console.log(JSON.stringify(deposit, null, 2))
    console.log("")
  }
}

main().catch((err) => {
  console.error("Error:", err.message ?? err)
  process.exit(1)
})
