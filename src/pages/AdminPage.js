import React, { useState, useCallback } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useWeb3 } from "../context/Web3Context";
import { ConnectGate } from "../components/shared/ConnectGate";
import { ContractGuard } from "../components/shared/ContractGuard";
import { PageLayout } from "../components/shared/PageLayout";
import { useTransaction } from "../hooks/useTransaction";
import { CONTRACT_NAMES } from "../config/constants";

function AdminContent() {
  const { contracts } = useWeb3();
  const { execute, isPending } = useTransaction();
  const [mintTo, setMintTo] = useState("");
  const [tokenURI, setTokenURI] = useState("");

  const handleMint = useCallback(async () => {
    if (!contracts?.PropertyNft || !mintTo?.trim() || !tokenURI?.trim()) return;
    try {
      await execute(
        "mint",
        () =>
          contracts.PropertyNft.mint(mintTo.trim(), tokenURI.trim()).then((tx) => tx.wait()),
        {
          successMessage: "Property NFT minted.",
          errorMessage: "Mint failed. Ensure you have MINTER_ROLE.",
        }
      );
      setMintTo("");
      setTokenURI("");
    } catch (_) {}
  }, [contracts?.PropertyNft, mintTo, tokenURI, execute]);

  return (
    <PageLayout title="Admin – Property onboarding">
      <p className="gray-50 mb-3">Mint property NFTs (requires MINTER_ROLE on PropertyNft).</p>
      <Card style={{ maxWidth: 480 }}>
        <Card.Body>
          <Form.Group className="mb-2">
            <Form.Label>Mint to address</Form.Label>
            <Form.Control
              value={mintTo}
              onChange={(e) => setMintTo(e.target.value)}
              placeholder="0x..."
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Token URI (metadata URL)</Form.Label>
            <Form.Control
              value={tokenURI}
              onChange={(e) => setTokenURI(e.target.value)}
              placeholder="ipfs://... or https://..."
            />
          </Form.Group>
          <Button
            variant="primary"
            disabled={isPending("mint") || !mintTo?.trim() || !tokenURI?.trim()}
            onClick={handleMint}
          >
            {isPending("mint") ? "Minting…" : "Mint property NFT"}
          </Button>
        </Card.Body>
      </Card>
    </PageLayout>
  );
}

export default function AdminPage() {
  return (
    <ConnectGate message="Connect your wallet to access admin.">
      <ContractGuard contractNames={CONTRACT_NAMES.PROPERTY_NFT}>
        <AdminContent />
      </ContractGuard>
    </ConnectGate>
  );
}
