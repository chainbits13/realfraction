const path = require("path");
const fs = require("fs");

let addresses = {};
const addressesPath = path.join(__dirname, "contract-addresses.json");
if (fs.existsSync(addressesPath)) {
  try {
    addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
  } catch (e) {
    console.warn("Could not load contract-addresses.json:", e.message);
  }
}

// Env overrides (e.g. for production)
if (process.env.PROPERTY_NFT_ADDRESS) addresses.PropertyNft = process.env.PROPERTY_NFT_ADDRESS;
if (process.env.MARKETPLACE_ADDRESS) addresses.Marketplace = process.env.MARKETPLACE_ADDRESS;
if (process.env.RENTAL_MANAGER_ADDRESS) addresses.RentalManager = process.env.RENTAL_MANAGER_ADDRESS;
if (process.env.STAKING_ADDRESS) addresses.Staking = process.env.STAKING_ADDRESS;
if (process.env.REAL_FRACTION_TOKEN_ADDRESS) addresses.RealFractionToken = process.env.REAL_FRACTION_TOKEN_ADDRESS;
if (process.env.FRACTIONAL_FACTORY_ADDRESS) addresses.FractionalPropertyFactory = process.env.FRACTIONAL_FACTORY_ADDRESS;
if (process.env.PLATFORM_CONFIG_ADDRESS) addresses.PlatformConfig = process.env.PLATFORM_CONFIG_ADDRESS;

module.exports = { contractAddresses: addresses };
