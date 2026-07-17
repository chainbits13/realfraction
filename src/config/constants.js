/**
 * Application-wide constants.
 */

export const LISTING_TYPES = Object.freeze({
  SALE: 0,
  RENT: 1,
  AUCTION: 2,
});

export const LISTING_TYPE_LABELS = Object.freeze(["Sale", "Rent", "Auction"]);

export const SECONDS_PER_DAY = 86400;

export const CONTRACT_NAMES = Object.freeze({
  PROPERTY_NFT: "PropertyNft",
  MARKETPLACE: "Marketplace",
  RENTAL_MANAGER: "RentalManager",
  STAKING: "Staking",
  REAL_FRACTION_TOKEN: "RealFractionToken",
  FRACTIONAL_PROPERTY_FACTORY: "FractionalPropertyFactory",
});

/** Default form state for listing a property on the marketplace */
export const DEFAULT_LIST_FORM = Object.freeze({
  type: String(LISTING_TYPES.SALE),
  price: "",
  rentDays: "",
  auctionEndHours: "24",
});

export const API = Object.freeze({
  BASE: process.env.REACT_APP_API_URL || "",
  CONFIG: "/api/realfraction/config",
  PROPERTIES: "/api/realfraction/properties",
  DOCUMENTS_RENTAL: "/api/realfraction/documents/rental",
  DOCUMENTS_PURCHASE: "/api/realfraction/documents/purchase",
  SMART_HOME_VERIFY: "/api/realfraction/smart-home/verify",
});
