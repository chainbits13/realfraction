const express = require("express");
const {
  getConfig,
  getProperties,
  getProperty,
  upsertProperty,
  generateRentalAgreement,
  generatePurchaseContract,
  verifySmartHomeAccess,
} = require("../controllers/realfractionController");

const router = express.Router();

router.get("/config", getConfig);
router.get("/properties", getProperties);
router.get("/properties/:tokenId", getProperty);
router.post("/properties", upsertProperty);
router.patch("/properties/:tokenId", upsertProperty);

router.post("/documents/rental", generateRentalAgreement);
router.post("/documents/purchase", generatePurchaseContract);

router.get("/smart-home/verify", verifySmartHomeAccess);

module.exports = router;
