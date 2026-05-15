/**
 * RealFraction backend API client.
 * Single source for config, properties, documents, and smart-home verification.
 */

import { API } from "../config/constants";

const base = () => API.BASE || "";

async function request(url, options = {}) {
  const res = await fetch(`${base()}${url}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || data?.error || res.statusText || "Request failed";
    throw new Error(message);
  }
  return data;
}

/**
 * @returns {Promise<{ success: boolean, config: Object }>}
 */
export async function getConfig() {
  return request(API.CONFIG);
}

/**
 * @param {{ owner?: string, tokenId?: number, status?: string }} params
 * @returns {Promise<{ success: boolean, properties: Array }>}
 */
export async function getProperties(params = {}) {
  const q = new URLSearchParams(params).toString();
  return request(`${API.PROPERTIES}${q ? `?${q}` : ""}`);
}

/**
 * @param {number} tokenId
 * @returns {Promise<{ success: boolean, property: Object }>}
 */
export async function getProperty(tokenId) {
  return request(`${API.PROPERTIES}/${tokenId}`);
}

/**
 * @param {Object} body - Property metadata (tokenId, ownerAddress, tokenURI, title, ...)
 * @returns {Promise<{ success: boolean, property: Object }>}
 */
export async function upsertProperty(body) {
  return request(API.PROPERTIES, { method: "POST", body: JSON.stringify(body) });
}

/**
 * @param {Object} body - tokenId, landlordAddress, tenantAddress, rentWeiPerPeriod, periodSeconds, startTime, propertyTitle
 * @returns {Promise<{ success: boolean, document: { title: string, body: string } }>}
 */
export async function generateRentalDocument(body) {
  return request(API.DOCUMENTS_RENTAL, { method: "POST", body: JSON.stringify(body) });
}

/**
 * @param {Object} body - tokenId, sellerAddress, buyerAddress, priceWei, propertyTitle
 * @returns {Promise<{ success: boolean, document: { title: string, body: string } }>}
 */
export async function generatePurchaseDocument(body) {
  return request(API.DOCUMENTS_PURCHASE, { method: "POST", body: JSON.stringify(body) });
}

/**
 * @param {{ tokenId: string, walletAddress: string }} params
 * @returns {Promise<{ success: boolean, hasAccess: boolean }>}
 */
export async function verifySmartHomeAccess(params) {
  const q = new URLSearchParams(params).toString();
  return request(`${API.SMART_HOME_VERIFY}?${q}`);
}
