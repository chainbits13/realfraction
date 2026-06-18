const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const BPS = 10_000;
const FEE_BPS = 250; // 2.5%

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1. RealFractionToken (RFT)
  const RealFractionToken = await hre.ethers.getContractFactory("RealFractionToken");
  const rft = await RealFractionToken.deploy();
  await rft.waitForDeployment();
  const rftAddress = await rft.getAddress();
  console.log("RealFractionToken deployed:", rftAddress);

  // 2. PropertyNft
  const PropertyNft = await hre.ethers.getContractFactory("PropertyNft");
  const propertyNft = await PropertyNft.deploy("RealFraction Property", "RFP");
  await propertyNft.waitForDeployment();
  const propertyNftAddress = await propertyNft.getAddress();
  console.log("PropertyNft deployed:", propertyNftAddress);

  // 3. PlatformConfig
  const PlatformConfig = await hre.ethers.getContractFactory("PlatformConfig");
  const platformConfig = await PlatformConfig.deploy(deployer.address, FEE_BPS, deployer.address);
  await platformConfig.waitForDeployment();
  const platformConfigAddress = await platformConfig.getAddress();
  console.log("PlatformConfig deployed:", platformConfigAddress);

  // 4. Marketplace
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(propertyNftAddress, platformConfigAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("Marketplace deployed:", marketplaceAddress);

  // 5. RentalManager
  const RentalManager = await hre.ethers.getContractFactory("RentalManager");
  const rentalManager = await RentalManager.deploy(propertyNftAddress, platformConfigAddress);
  await rentalManager.waitForDeployment();
  const rentalManagerAddress = await rentalManager.getAddress();
  console.log("RentalManager deployed:", rentalManagerAddress);

  // 6. FractionalPropertyFactory
  const FractionalPropertyFactory = await hre.ethers.getContractFactory("FractionalPropertyFactory");
  const fractionalFactory = await FractionalPropertyFactory.deploy();
  await fractionalFactory.waitForDeployment();
  const fractionalFactoryAddress = await fractionalFactory.getAddress();
  console.log("FractionalPropertyFactory deployed:", fractionalFactoryAddress);

  // 7. Staking (staking and reward token = RFT)
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(rftAddress, rftAddress);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("Staking deployed:", stakingAddress);

  // 8. Grant PropertyNft MINTER_ROLE to deployer (platform can mint)
  const MINTER_ROLE = await propertyNft.MINTER_ROLE();
  await propertyNft.grantRole(MINTER_ROLE, deployer.address);
  console.log("Granted MINTER_ROLE to deployer");

  const addresses = {
    RealFractionToken: rftAddress,
    PropertyNft: propertyNftAddress,
    PlatformConfig: platformConfigAddress,
    Marketplace: marketplaceAddress,
    RentalManager: rentalManagerAddress,
    FractionalPropertyFactory: fractionalFactoryAddress,
    Staking: stakingAddress,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
  };

  const outDir = path.join(__dirname, "..", "server", "config");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "contract-addresses.json"), JSON.stringify(addresses, null, 2));
  console.log("Saved contract-addresses.json to server/config");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
