# ZeroDev Smart Routing Address — POC

A proof-of-concept demonstrating [ZeroDev's Smart Routing Address (SRA)](https://docs.zerodev.app/smart-routing-address) feature. Users send tokens from multiple source testnets and they are **automatically bridged to the destination chain** — no manual bridging required.

## What This Demonstrates

- Generate a single deposit address that accepts funds from multiple chains
- ZeroDev automatically detects deposits and bridges to the destination chain
- Supports both USDC (ERC-20) and native ETH

## How It Works

A Smart Routing Address encodes a cross-chain intent as a deterministic smart contract address. When funds arrive at that address on any source chain, ZeroDev's off-chain router detects the deposit, triggers a bridge to the destination chain, and executes the configured on-chain action (in this POC: just receive the tokens — no further action). The user never touches a bridge UI.

## Chain Configuration

| Role | Chain | Chain ID |
|------|-------|----------|
| **Destination** | Base Sepolia | 84532 |
| Source | Arbitrum Sepolia | 421614 |
| Source | Sepolia | 11155111 |

> **Note on Monad testnet:** Monad testnet (chain ID 10143) is not yet supported in the ZeroDev SRA SDK registry (`@zerodev/smart-routing-address` v0.2.1). The SDK validates destination chains against a hardcoded list and will reject unsupported chains. Base Sepolia is used as the destination for this POC.

> **Note on OP Sepolia:** Optimism Sepolia (chain ID 11155420) is also not in the ZeroDev SRA token registry and cannot be used as a source chain with this SDK version.

## Prerequisites

- Node.js 18+
- A wallet address to use as the owner

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set OWNER_ADDRESS to your wallet address
```

## Usage

### Step 1 — Create a Smart Routing Address

```bash
npm run create-address
# or: npx tsx src/create-address.ts
```

This will output:
- Your unique Smart Routing Address
- Fee estimates per source chain and token type
- Min/max deposit amounts

### Step 2 — Send Funds

Send USDC or ETH from any source chain to the printed Smart Routing Address using MetaMask or any testnet wallet.

Get testnet funds:
- Arbitrum Sepolia ETH: https://faucet.quicknode.com/arbitrum/sepolia
- Sepolia ETH: https://sepoliafaucet.com
- Testnet USDC: https://faucet.circle.com

### Step 3 — Check Status

```bash
npm run check-status -- 0xYourSmartRoutingAddress
# or: npx tsx src/check-status.ts 0xYourSmartRoutingAddress
```

This polls ZeroDev's API and shows:
- Deposit detection status
- Bridge status
- Execution status on the destination chain

### Step 4 — Verify on Explorer

Check your destination wallet on Base Sepolia:
- https://sepolia.basescan.org

## Sample Output

```
=== ZeroDev Smart Routing Address POC ===

Destination chain : Base Sepolia (chain ID 84532)
Owner address     : 0xYourWallet...
Source chains     : Arbitrum Sepolia, Sepolia

Creating Smart Routing Address...

✅ Smart Routing Address created!

  Address : 0xAbCd...1234

Fee estimates by source chain:

  Arbitrum Sepolia (chain ID 421614):
    USDC           fee:     0.000020  minDeposit: 1.000000
    ETH            fee:     0.000010  minDeposit: 0.001000

  Sepolia (chain ID 11155111):
    USDC           fee:     0.000020  minDeposit: 1.000000
    ETH            fee:     0.000010  minDeposit: 0.001000

---
Next steps:
  1. Send USDC or ETH to 0xAbCd...1234
     from any of: Arbitrum Sepolia, Sepolia
  2. ZeroDev will automatically bridge the funds to Base Sepolia
  3. Track status: npx tsx src/check-status.ts 0xAbCd...1234
```

## Fees

ZeroDev charges:
- **0.20%** for transfers under $1,000
- **0.10%** for transfers over $1,000

Developers can sponsor fees via the [ZeroDev Dashboard](https://dashboard.zerodev.app) so users receive the full deposit amount.

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `OWNER_ADDRESS env var is required` | `.env` not created or address missing | Run `cp .env.example .env` and set `OWNER_ADDRESS=0x...` |
| `Unsupported chain` | Chain not in ZeroDev SDK registry | Only use chains listed in the Chain Configuration table above |
| `Native is not supported on chain X` | Chain doesn't support native token deposits | Remove `NATIVE` srcToken entry for that chain |
| `Fetch failed / TLS error` | Network/proxy issue in local environment | Try on a different network; for local testing only: `NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx src/create-address.ts` |

## Resources

- [ZeroDev SRA Docs](https://docs.zerodev.app/smart-routing-address)
- [ZeroDev Dashboard](https://dashboard.zerodev.app)
- [npm: @zerodev/smart-routing-address](https://www.npmjs.com/package/@zerodev/smart-routing-address)
