/* global BigInt */
import { ethers } from "ethers";

/**
 * Shorten an Ethereum address for display.
 * @param {string} address - Full address
 * @param {number} chars - Characters to show at start and end (default 6 and 4)
 */
export function formatAddress(address, chars = { start: 6, end: 4 }) {
  if (!address || typeof address !== "string") return "";
  const { start, end } = typeof chars === "number" ? { start: chars, end: 4 } : chars;
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Format wei as ETH string with optional decimal places.
 */
export function formatEth(wei, decimals = 4) {
  if (wei == null || wei === undefined) return "0";
  try {
    const value = typeof wei === "bigint" ? wei : BigInt(wei);
    const formatted = ethers.formatEther(value);
    if (decimals === null) return formatted;
    const num = Number(formatted);
    return num.toFixed(Math.min(decimals, 18));
  } catch {
    return "0";
  }
}

/**
 * Format Unix timestamp (seconds) to locale date string.
 */
export function formatDate(timestamp) {
  if (timestamp == null || timestamp === undefined) return "—";
  try {
    const ts = typeof timestamp === "bigint" ? Number(timestamp) : Number(timestamp);
    return new Date(ts * 1000).toLocaleString();
  } catch {
    return "—";
  }
}

/**
 * Format rent duration in seconds to days for display.
 */
export function formatRentDurationDays(seconds) {
  if (seconds == null) return "—";
  const s = typeof seconds === "bigint" ? Number(seconds) : Number(seconds);
  return (s / 86400).toFixed(0);
}
