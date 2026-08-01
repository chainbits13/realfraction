import { useState, useEffect, useCallback } from "react";
import { LISTING_TYPE_LABELS } from "../constants";

/**
 * Fetches active marketplace listings, optionally filtered by tab (all | sale | rent | auction).
 */
/**
 * Fetches active marketplace listings, optionally filtered by tab.
 * @param {Object} contracts - Web3 contracts from useWeb3()
 * @param {string} tab - "all" | "sale" | "rent" | "auction"
 * @returns {{ listings: Array, loading: boolean, error: string|null, refetch: function }}
 */
export function useMarketplaceListings(contracts, tab = "all") {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!contracts?.Marketplace) {
      setListings([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const marketplace = contracts.Marketplace;
        const len = await marketplace.listingsLength();
        const arr = [];

        for (let i = 0; i < Number(len); i++) {
          const list = await marketplace.getListing(i);
          if (!list.active) continue;

          const listingType = Number(list.listingType);
          const typeLabel = LISTING_TYPE_LABELS[listingType] ?? "Unknown";
          if (tab !== "all" && typeLabel.toLowerCase() !== tab) continue;

          arr.push({
            listingIndex: i,
            tokenId: list.tokenId.toString(),
            lister: list.lister,
            listingType: typeLabel,
            priceWei: list.priceWei.toString(),
            rentDurationSeconds: list.rentDurationSeconds?.toString(),
            auctionEndTime: list.auctionEndTime?.toString(),
          });
        }

        if (!cancelled) setListings(arr);
      } catch (e) {
        if (!cancelled) {
          setListings([]);
          setError(e.message ?? "Failed to load listings");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [contracts?.Marketplace, tab, refreshKey]);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { listings, loading, error, refetch };
}
