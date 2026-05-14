const fs = require("fs");
const path = require("path");

const ARTIFACTS = path.join(__dirname, "..", "artifacts", "contracts");
const TARGETS = [
  path.join(__dirname, "..", "server", "abis"),
  path.join(__dirname, "..", "src", "abis"),
  path.join(__dirname, "..", "public", "abis"),
];

const CONTRACTS = [
  "core/PlatformConfig.sol",
  "tokens/PropertyNft.sol",
  "tokens/RealFractionToken.sol",
  "tokens/FractionalPropertyToken.sol",
  "tokens/FractionalPropertyFactory.sol",
  "marketplace/Marketplace.sol",
  "rental/RentalManager.sol",
  "staking/Staking.sol",
];

function getContractName(solPath) {
  return path.basename(solPath, ".sol");
}

CONTRACTS.forEach((rel) => {
  const name = getContractName(rel);
  const abiPath = path.join(ARTIFACTS, rel, `${name}.json`);
  if (!fs.existsSync(abiPath)) return;
  const artifact = JSON.parse(fs.readFileSync(abiPath, "utf8"));
  const abi = artifact.abi;
  TARGETS.forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${name}.json`), JSON.stringify(abi, null, 0));
  });
  console.log("Copied ABI:", name);
});

console.log("ABIs copied to server/abis and src/abis");
