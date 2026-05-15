const mongoose = require("mongoose");
const Property = require("../models/Property");
const { contractAddresses } = require("../config/contracts");
const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const documentService = require("../services/documentService");

// Get contract config for frontend (addresses, chainId)
exports.getConfig = asyncErrorHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    config: {
      ...contractAddresses,
      chainId: contractAddresses.chainId || null,
    },
  });
});

// List properties (off-chain metadata; optionally filter by owner)
exports.getProperties = asyncErrorHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(200).json({ success: true, properties: [] });
  }
  const { owner, tokenId, status } = req.query;
  const filter = {};
  if (owner) filter.ownerAddress = owner.toLowerCase();
  if (tokenId) filter.tokenId = Number(tokenId);
  if (status) filter.status = status;
  const properties = await Property.find(filter).sort({ tokenId: 1 });
  res.status(200).json({ success: true, properties });
});

// Get single property by tokenId
exports.getProperty = asyncErrorHandler(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return next(new ErrorHandler("Database not connected", 503));
  }
  const prop = await Property.findOne({ tokenId: Number(req.params.tokenId) });
  if (!prop) return next(new ErrorHandler("Property not found", 404));
  res.status(200).json({ success: true, property: prop });
});

// Create or update property metadata (on-chain mint is separate; this is for onboarding/display)
exports.upsertProperty = asyncErrorHandler(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return next(new ErrorHandler("Database not connected", 503));
  }
  const tokenId = req.body.tokenId ?? (req.params.tokenId != null ? Number(req.params.tokenId) : undefined);
  const { ownerAddress, tokenURI, title, description, location, propertyType, images, attributes, smartHomeEnabled, status } = req.body;
  if (tokenId === undefined) return next(new ErrorHandler("tokenId required", 400));
  const data = {
    ownerAddress: (ownerAddress || req.body.owner).toLowerCase(),
    tokenURI: tokenURI || "",
    title: title || "",
    description: description || "",
    location: location || "",
    propertyType: propertyType || "",
    images: Array.isArray(images) ? images : [],
    attributes: attributes || {},
    smartHomeEnabled: Boolean(smartHomeEnabled),
    status: status || "draft",
  };
  const prop = await Property.findOneAndUpdate(
    { tokenId: Number(tokenId) },
    { ...data, tokenId: Number(tokenId) },
    { new: true, upsert: true }
  );
  res.status(200).json({ success: true, property: prop });
});

// Generate rental agreement document (off-chain)
exports.generateRentalAgreement = asyncErrorHandler(async (req, res, next) => {
  const { tokenId, landlordAddress, tenantAddress, rentWeiPerPeriod, periodSeconds, startTime, propertyTitle } = req.body;
  const doc = documentService.generateRentalAgreement({
    tokenId,
    landlordAddress,
    tenantAddress,
    rentWeiPerPeriod,
    periodSeconds,
    startTime,
    propertyTitle,
  });
  res.status(200).json({ success: true, document: doc });
});

// Generate purchase contract document (off-chain)
exports.generatePurchaseContract = asyncErrorHandler(async (req, res, next) => {
  const { tokenId, sellerAddress, buyerAddress, priceWei, propertyTitle } = req.body;
  const doc = documentService.generatePurchaseContract({
    tokenId,
    sellerAddress,
    buyerAddress,
    priceWei,
    propertyTitle,
  });
  res.status(200).json({ success: true, document: doc });
});

// Smart home access: verify NFT ownership (stub).
// In production: call PropertyNft.ownerOf(tokenId) via ethers + RPC_URL, or use an indexer;
// then integrate with IoT/access management to grant or deny building access.
exports.verifySmartHomeAccess = asyncErrorHandler(async (req, res, next) => {
  const { tokenId, walletAddress } = req.query;
  if (!tokenId || !walletAddress) return next(new ErrorHandler("tokenId and walletAddress required", 400));
  // Stub: hasAccess always true; replace with on-chain ownerOf check when RPC and contract address are configured
  res.status(200).json({
    success: true,
    hasAccess: true,
    message: "Smart-home verification stub. Configure RPC and PropertyNft address to verify ownership on-chain.",
  });
});
