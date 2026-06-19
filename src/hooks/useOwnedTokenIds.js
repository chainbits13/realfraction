import { useState, useEffect } from "react";

/**
 * Returns token IDs owned by the given address from PropertyNft (ERC721Enumerable).
 */
export function useOwnedTokenIds(contracts, address) {
  const [tokenIds, setTokenIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contracts?.PropertyNft || !address) {
      setTokenIds([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const nft = contracts.PropertyNft;
        const balance = await nft.balanceOf(address);
        const ids = [];

        for (let i = 0; i < Number(balance); i++) {
          const tokenId = await nft.tokenOfOwnerByIndex(address, i);
          ids.push(Number(tokenId));
        }

        if (!cancelled) setTokenIds(ids);
      } catch {
        if (!cancelled) setTokenIds([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [contracts?.PropertyNft, address]);

  return { tokenIds, loading };
}
