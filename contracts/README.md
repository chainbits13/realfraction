# RealFraction Smart Contracts

Blockchain-powered real estate platform — Solidity smart contracts for Ethereum-compatible networks (Ethereum, Polygon, etc.). Aligned with the [RealFraction project description](https://github.com/real-fraction): property NFTs, fractional ownership, marketplace (sale / rent / auction), rental agreements, platform token, and staking.

## Overview

RealFraction uses a **hybrid on-chain / off-chain** architecture. Critical ownership and financial logic lives on-chain; identity, documents, and smart-home systems run off-chain.

## Contract Map

| Contract | Purpose | Status |
|----------|---------|--------|
| **PlatformConfig** | Global config (core/): authority, platform fee (bps), fee recipient. Used by Marketplace and RentalManager. | ✅ |
| **PropertyNft** | ERC-721 property ownership NFT. Digital proof of ownership, transferable certificate, programmable access key for smart homes. Minter role for platform/marketplace. | ✅ |
| **FractionalPropertyToken** | ERC-20 fractional ownership tokens for a single property (one deployment per property). | ✅ |
| **FractionalPropertyFactory** | Deploys FractionalPropertyToken per property and mints initial supply to caller. | ✅ |
| **Marketplace** | List properties for sale, rent, or auction; buy listing (ETH); place bid; settle auction. Platform fee on sale and auction. | ✅ |
| **RentalManager** | Create on-chain rental agreements; tenant pays rent (ETH) per period. Platform fee deducted. | ✅ |
| **RealFractionToken** | ERC-20 platform utility token (fees, staking, rewards). | ✅ |
| **Staking** | Stake RFT (or platform) tokens; owner funds reward token; users claim pending rewards. | ✅ |

## On-Chain Components (project description)

- **Ownership NFTs** (ERC-721) — PropertyNft
- **Fractional tokens** (ERC-20) — FractionalPropertyToken per property
- **Marketplace** — List (sale / rent / auction), buy, auction bid/settle
- **Rental** — Rental agreements, pay rent (ETH)
- **Platform config** — Fee (bps), fee recipient
- **Staking** — Stake platform token, claim rewards
- **Transaction transparency** — All above on-chain

## Off-Chain Components (Backend / App)

- Identity verification
- Legal document generation
- Smart home integration
- Data indexing
- Compliance logic

## Directory Layout

One folder per feature; interfaces sit next to their implementations.

```
contracts/
├── core/
│   └── PlatformConfig.sol          # Platform fee & fee recipient
├── tokens/
│   ├── PropertyNft.sol              # ERC-721 property NFT
│   ├── RealFractionToken.sol        # ERC-20 platform token
│   ├── FractionalPropertyToken.sol  # ERC-20 per property
│   └── FractionalPropertyFactory.sol
├── marketplace/
│   ├── IMarketplace.sol
│   └── Marketplace.sol              # List, buy, auction (ETH)
├── rental/
│   ├── IRentalManager.sol
│   └── RentalManager.sol            # Rental agreements, pay rent
└── staking/
    └── Staking.sol                  # Stake + reward claims
```

## Tech Stack

- **Solidity** ^0.8.15
- **OpenZeppelin** — ERC721, ERC20, Ownable, AccessControl, ReentrancyGuard, SafeERC20
- **Ethereum-compatible** networks (Ethereum, Polygon, etc.)

## Deployment Order (suggested)

1. RealFractionToken (RFT) — `tokens/RealFractionToken.sol`
2. PropertyNft (name, symbol) — `tokens/PropertyNft.sol`
3. PlatformConfig (owner, feeBps, feeRecipient) — `core/PlatformConfig.sol`
4. Marketplace (propertyNft, platformConfig) — `marketplace/Marketplace.sol`
5. RentalManager (propertyNft, platformConfig) — `rental/RentalManager.sol`
6. FractionalPropertyFactory — `tokens/FractionalPropertyFactory.sol`
7. Staking (stakingToken = RFT, rewardToken = RFT) — `staking/Staking.sol`
8. Grant PropertyNft MINTER_ROLE to marketplace or platform if needed

## Roadmap

1. Security audit
2. Upgradeability patterns
3. Governance integration
4. Smart home NFT access integration
