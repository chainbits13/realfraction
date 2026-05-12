import { useState, useEffect, useCallback } from "react";

/**
 * Fetches staked balance, pending rewards, and RFT balance for the given address.
 * @returns {{ stakedBalance: string, pendingRewards: string, rftBalance: string, loading: boolean, refetch: function }}
 */
export function useStakingBalances(contracts, address) {
  const [staked, setStaked] = useState("0");
  const [pending, setPending] = useState("0");
  const [rftBalance, setRftBalance] = useState("0");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!contracts?.Staking || !contracts?.RealFractionToken || !address) {
      setStaked("0");
      setPending("0");
      setRftBalance("0");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const [s, p, b] = await Promise.all([
          contracts.Staking.stakedBalance(address),
          contracts.Staking.pendingRewards(address),
          contracts.RealFractionToken.balanceOf(address),
        ]);
        if (!cancelled) {
          setStaked(s.toString());
          setPending(p.toString());
          setRftBalance(b.toString());
        }
      } catch {
        if (!cancelled) {
          setStaked("0");
          setPending("0");
          setRftBalance("0");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [contracts?.Staking, contracts?.RealFractionToken, address, refreshKey]);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { stakedBalance: staked, pendingRewards: pending, rftBalance, loading, refetch };
}
