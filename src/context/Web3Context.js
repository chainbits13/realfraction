import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { getConfig as fetchConfigFromApi } from "../api/realfraction";

const Web3Context = createContext(null);

async function fetchConfig() {
  try {
    const data = await fetchConfigFromApi();
    return data?.config ?? null;
  } catch {
    return null;
  }
}

async function loadAbi(name) {
  try {
    const res = await fetch(`${process.env.PUBLIC_URL || ""}/abis/${name}.json`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [config, setConfig] = useState(null);
  const [contracts, setContracts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    setError(null);
    if (!window.ethereum) {
      setError("MetaMask (or Web3 wallet) not found. Please install MetaMask.");
      return;
    }
    try {
      const prov = new ethers.BrowserProvider(window.ethereum);
      const accounts = await prov.send("eth_requestAccounts", []);
      if (!accounts.length) return;
      const sig = await prov.getSigner();
      const network = await prov.getNetwork();
      setProvider(prov);
      setSigner(sig);
      setAddress(accounts[0]);
      setChainId(Number(network.chainId));
    } catch (e) {
      setError(e.message || "Failed to connect wallet");
    }
  }, []);

  const disconnect = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setChainId(null);
    setContracts({});
  }, []);

  // Load backend config (contract addresses)
  useEffect(() => {
    let cancelled = false;
    fetchConfig().then((c) => {
      if (!cancelled && c) setConfig(c);
    });
    return () => { cancelled = true; };
  }, []);

  // When wallet connects, re-create provider/signer and attach contract instances
  useEffect(() => {
    if (!signer || !config) {
      setContracts({});
      setLoading(false);
      return;
    }
    let cancelled = false;
    const init = async () => {
      const abiPromises = [
        ["PropertyNft", config.PropertyNft],
        ["Marketplace", config.Marketplace],
        ["RentalManager", config.RentalManager],
        ["Staking", config.Staking],
        ["RealFractionToken", config.RealFractionToken],
        ["FractionalPropertyFactory", config.FractionalPropertyFactory],
      ];
      const result = {};
      for (const [name, addr] of abiPromises) {
        if (!addr) continue;
        const abi = await loadAbi(name);
        if (abi) result[name] = new ethers.Contract(addr, abi, signer);
      }
      if (!cancelled) setContracts(result);
      setLoading(false);
    };
    init();
    return () => { cancelled = true; };
  }, [signer, config]);

  // Listen for account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;
    const onAccounts = () => disconnect();
    const onChain = () => window.ethereum?.request({ method: "eth_chainId" }).then((id) => setChainId(parseInt(id, 16)));
    window.ethereum.on("accountsChanged", onAccounts);
    window.ethereum.on("chainChanged", onChain);
    return () => {
      window.ethereum.removeListener("accountsChanged", onAccounts);
      window.ethereum.removeListener("chainChanged", onChain);
    };
  }, [disconnect]);

  const value = {
    provider,
    signer,
    address,
    chainId,
    config,
    contracts,
    loading,
    error,
    connect,
    disconnect,
    isConnected: !!address,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

/**
 * Web3 and contract state. Must be used within Web3Provider.
 * @returns {{ provider: ethers.BrowserProvider|null, signer: ethers.Signer|null, address: string|null, chainId: number|null, config: Object|null, contracts: Object, loading: boolean, error: string|null, connect: function, disconnect: function, isConnected: boolean }}
 */
export function useWeb3() {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error("useWeb3 must be used within Web3Provider");
  return ctx;
}
