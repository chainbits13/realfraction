# RealFraction 🏠

**RealFraction** is a blockchain-powered smart real estate platform. It simplifies property ownership, rental management, and investment through automation, tokenization, and smart infrastructure. This is the **MVP / template** stage—a scaffold for production implementation.

---

## 🌟 Key Features

Aligned with the RealFraction project requirements (MVP scope where noted).

- **Property ownership (on-chain)**: ERC-721 property NFTs (PropertyNft). Digital proof of ownership, transferable; basis for smart-home access integration (planned).
- **Fractional ownership & tokenization**: Properties tokenized into fractional ERC-20 tokens per property (FractionalPropertyToken + Factory); smaller capital entry, shared ownership. See `contracts/`.
- **Rent, buy & auction marketplace**: List properties for sale, rent, or auction; buy listing (ETH); place bid and settle auction. Transparent, on-chain. Marketplace contract; platform fee (PlatformConfig).
- **Rental agreements & income**: On-chain rental agreements (RentalManager); tenant pays rent per period (ETH); platform fee; structured payment flow.
- **Native utility token & staking**: Platform token (RFT, ERC-20) for fees and rewards; Staking contract to stake RFT, unstake, claim rewards. Governance (planned).
- **Automated documentation**: Backend generates rental agreement and purchase contract text from verified inputs (`/api/realfraction/documents/rental`, `/api/realfraction/documents/purchase`).
- **Premium discovery (app)**: Property browser, Marketplace (list/buy/rent/auction), My Properties, Rentals, Fractional, Staking, Admin; Connect Wallet (MetaMask) and full Web3 integration (ethers.js).
- **Backend & auth**: Node.js/Express, MongoDB; JWT-based auth; RealFraction API (properties, config, documents, smart-home verify stub).
- **Off-chain**: Document generation; smart-home NFT access verification stub (`/api/realfraction/smart-home/verify`); identity/indexing/compliance for production.
- **Responsive design**: Mobile, tablet, and desktop.

---

## 🛠 Tech Stack

- **Frontend**: React.js, Bootstrap 5, Swiper, Framer Motion.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Blockchain / Smart Contracts**: Hardhat, Solidity (Ethereum-compatible), OpenZeppelin, ethers.js. PropertyNft (ERC-721), FractionalPropertyToken (ERC-20), Marketplace (buy/rent/auction), RentalManager, RealFractionToken (RFT), Staking. Deploy with `npm run deploy:contracts`; ABIs copied via `npm run compile:copy`. See `contracts/` and `contracts/README.md`.
- **Icons/Fonts**: Font Awesome 6.

---

## 📂 Project Structure

The project separates blockchain/contracts, Express backend, and React frontend:

```bash
realfraction-mvp/
├── public/                 # Static assets for the React app (favicon, index.html)
├── contracts/              # Solidity smart contracts (Hardhat)
│   ├── core/               # PlatformConfig.sol (fee, fee recipient)
│   ├── tokens/             # PropertyNft.sol, RealFractionToken.sol, FractionalPropertyFactory.sol, FractionalPropertyToken.sol
│   ├── marketplace/        # Marketplace.sol, IMarketplace.sol (list, buy, auction)
│   ├── rental/             # RentalManager.sol, IRentalManager.sol
│   ├── staking/            # Staking.sol (RFT stake & rewards)
│   └── README.md           # Contract deploy order & notes
├── server/                 # Express backend
│   ├── config/             # config.env.example, database.js, contracts.js
│   ├── controllers/        # realfractionController.js, orderController, paymentController, productController, userController
│   ├── models/             # Property.js (realfraction), plus order, payment, product, user, etc.
│   ├── routes/             # realfractionRoute.js, orderRoute, paymentRoute, productRoute, userRoute
│   ├── services/           # documentService.js (rental & purchase document generation)
│   ├── middlewares/        # auth, validator, helpers (multer, errorHandler, etc.)
│   ├── utils/              # regionChecker, sendToken, sendEmail, jwtToken, errorHandler, apiFeatures, etc.
│   ├── app.js              # Express app (mounts routes; realfraction at /api/realfraction)
│   └── server.js           # Server entry (PORT 3099, connectDatabase optional)
├── src/                    # React frontend (Create React App)
│   ├── api/                # realfraction.js (getConfig, getProperties, documents, smart-home verify)
│   ├── components/         # UI components
│   │   ├── shared/         # PageLayout.js, ConnectGate.js, ContractGuard.js
│   │   ├── navbar/         # Navbar.js, navbar.css
│   │   ├── dashboard/      # AnimatedCounter.js
│   │   └── functions/      # AnimationTitles.js, CountDown.js
│   ├── config/             # routes.js, routeElements.js, constants.js
│   ├── context/            # Web3Context.js, ToastContext.js
│   ├── hooks/               # useStakingBalances, useMarketplaceListings, useTransaction, useOwnedTokenIds, useTxPending, useListings
│   ├── pages/              # DashboardPage, Header, Footer; HowItWorksPage, AboutPage, DevelopersPage; MarketplacePage, MyPropertiesPage, RentalsPage, FractionalPage, StakingPage, AdminPage; NotFoundPage
│   ├── images/             # UI images & assets (dashboard, about, developers)
│   ├── utils/              # format.js (formatEth, formatAddress, formatDate)
│   ├── style.css           # Global styles, design tokens, btn-cta, card-glass
│   ├── App.js              # Root component, React Router, Suspense, lazy routes
│   └── index.js            # Frontend entry
├── scripts/                # copy-abis.js (copy ABIs to src/abis, public/abis), deploy.js (Hardhat deploy)
├── hardhat.config.js       # Hardhat network & compile config
├── package.json            # Dependencies, proxy to backend (3099), scripts (start, compile:copy, deploy:contracts)
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v20+)
- For smart contracts: Solidity toolchain (e.g. Hardhat/Foundry), Ethereum-compatible wallet (e.g. MetaMask). See `contracts/README.md` for deploy order.

### 2. Installation
Install dependencies in the root directory:
```bash
npm install
```

### 3. Environment Setup
- Copy `server/config/config.env.example` to `server/config/config.env` (or `.env` in project root) and set `PORT`, `MONGO_URI` if using the database.
- For blockchain: optional `RPC_URL`, `PRIVATE_KEY` for deploy; after deploying contracts, addresses are written to `server/config/contract-addresses.json` (or set env vars for production).

### 4. Smart contracts (Hardhat)
Compile and copy ABIs to server, frontend, and public:
```bash
npm run compile:copy
```
Deploy to a local node (run in another terminal first: `npm run deploy:local`):
```bash
npm run deploy:contracts
```
Then the API will serve contract addresses from `server/config/contract-addresses.json`. Connect MetaMask to the same network (e.g. localhost 8545).

### 5. Launch
Start both the server and the frontend concurrently:
```bash
npm start
```
- Frontend: Connect Wallet (MetaMask), then use **Marketplace** (list/buy/auction), **My Properties**, **Rentals**, **Fractional**, **Staking**, **Admin** (mint property NFT if you have MINTER_ROLE).
- API: `GET/POST /api/realfraction/properties`, `GET /api/realfraction/config`, `POST /api/realfraction/documents/rental`, `POST /api/realfraction/documents/purchase`, `GET /api/realfraction/smart-home/verify` (stub).

---

## 📋 Implementation summary (RealFraction requirements)

| Requirement | Implementation |
|-------------|-----------------|
| **Property onboarding** | Admin page mints Property NFT (MINTER_ROLE); backend Property model for metadata; `POST /api/realfraction/properties`. |
| **NFT-based ownership** | PropertyNft (ERC-721); My Properties lists owned tokens; list/buy/auction transfer ownership. |
| **Fractional tokenization** | FractionalPropertyFactory + FractionalPropertyToken; Fractional page to create fractional tokens per property. |
| **Buy, rent & auction marketplace** | Marketplace page: list (sale/rent/auction), buy, bid, settle auction; My Properties: list on marketplace. |
| **Rental income** | Rentals page: create rental agreement, pay rent; RentalManager contract; optional document generation. |
| **Utility token & staking** | RFT (RealFractionToken); Staking page: stake, unstake, claim rewards. |
| **Document generation** | `documentService`: rental agreement and purchase contract text; `POST /api/realfraction/documents/rental`, `.../purchase`. |
| **Smart home NFT access** | Stub: `GET /api/realfraction/smart-home/verify?tokenId=&walletAddress=`; production would verify ownership on-chain or via indexer. |
| **Admin / operational control** | Admin page (mint property); PlatformConfig owner can set fee and fee recipient on-chain. |

---

## ⚖️ License
This project is licensed under the MIT License.