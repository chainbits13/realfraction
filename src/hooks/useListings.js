import { useState, useEffect } from "react";
import { LISTING_TYPE_LABELS } from "../config/constants";

/**
 * Fetches active marketplace listings, optionally filtered by tab (all | sale | rent | auction).
 * @param {import("ethers").Contract | null} marketplace
 * @param {import("ethers").Contract | null} propertyNft
 * @param {string} tab - "all" | "sale" | "rent" | "auction"
 * @returns {{ listings: Array; loading: boolean; error: Error | null }}
 */
export function useListings(marketplace, propertyNft, tab = "all") {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!marketplace) {
      setListings([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const len = await marketplace.listingsLength();
        const arr = [];
        for (let i = 0; i < Number(len); i++) {
          const list = await marketplace.getListing(i);
          if (!list.active) continue;
          const listingType = Number(list.listingType);
          const typeLabel = LISTING_TYPE_LABELS[listingType] ?? "Unknown";
          if (tab !== "all" && typeLabel.toLowerCase() !== tab) continue;
          let owner = "";
          if (propertyNft) {
            try {
              owner = await propertyNft.ownerOf(list.tokenId);
            } catch {
              // token may be transferred
            }
          }
          arr.push({
            listingIndex: i,
            tokenId: list.tokenId.toString(),
            lister: list.lister,
            listingType: typeLabel,
            priceWei: list.priceWei.toString(),
            rentDurationSeconds: list.rentDurationSeconds?.toString(),
            auctionEndTime: list.auctionEndTime?.toString(),
            owner,
          });
        }
        if (!cancelled) setListings(arr);
      } catch (err) {
        if (!cancelled) {
          setListings([]);
          setError(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [marketplace, propertyNft, tab]);

  return { listings, loading, error };
}

export default useListings;
