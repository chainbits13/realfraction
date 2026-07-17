import React, { useState, useCallback } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useWeb3 } from "../context/Web3Context";
import { ConnectGate } from "../components/shared/ConnectGate";
import { ContractGuard } from "../components/shared/ContractGuard";
import { PageLayout } from "../components/shared/PageLayout";
import { useTransaction } from "../hooks/useTransaction";
import { CONTRACT_NAMES } from "../config/constants";
import { ethers } from "ethers";

const initialForm = () => ({ propertyTokenId: "", name: "", symbol: "", totalSupply: "" });

function FractionalContent() {
  const { contracts } = useWeb3();
  const { execute, isPending } = useTransaction();
  const [form, setForm] = useState(initialForm());

  const handleCreate = useCallback(async () => {
    const { propertyTokenId, name, symbol, totalSupply } = form;
    const tokenId = Number(propertyTokenId);
    if (
      !contracts?.FractionalPropertyFactory ||
      !tokenId ||
      !name?.trim() ||
      !symbol?.trim() ||
      !totalSupply?.trim()
    )
      return;
    const supply = ethers.parseEther(totalSupply.trim());
    try {
      await execute(
        "create-fractional",
        () =>
          contracts.FractionalPropertyFactory.createFractionalToken(
            tokenId,
            name.trim(),
            symbol.trim(),
            supply
          ).then((tx) => tx.wait()),
        { successMessage: "Fractional token created.", errorMessage: "Create fractional failed." }
      );
      setForm(initialForm());
    } catch (_) {}
  }, [form, contracts?.FractionalPropertyFactory, execute]);

  return (
    <PageLayout title="Fractional Ownership">
      <p className="gray-50 mb-4">
        Create ERC-20 fractional tokens for a property you own (by property NFT token ID).
      </p>
      <Card className="mb-4">
        <Card.Header>Create fractional token</Card.Header>
        <Card.Body>
          <Form.Group className="mb-2">
            <Form.Label>Property NFT Token ID</Form.Label>
            <Form.Control
              type="number"
              value={form.propertyTokenId}
              onChange={(e) => setForm((f) => ({ ...f, propertyTokenId: e.target.value }))}
              placeholder="0"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Token name</Form.Label>
            <Form.Control
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Property 42 Fractions"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Symbol</Form.Label>
            <Form.Control
              value={form.symbol}
              onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value }))}
              placeholder="P42"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Total supply</Form.Label>
            <Form.Control
              value={form.totalSupply}
              onChange={(e) => setForm((f) => ({ ...f, totalSupply: e.target.value }))}
              placeholder="1000000"
            />
          </Form.Group>
          <Button
            variant="primary"
            disabled={
              isPending("create-fractional") ||
              !form.propertyTokenId ||
              !form.name?.trim() ||
              !form.symbol?.trim() ||
              !form.totalSupply?.trim()
            }
            onClick={handleCreate}
          >
            {isPending("create-fractional") ? "Creating…" : "Create fractional token"}
          </Button>
        </Card.Body>
      </Card>
      <p className="gray-50 small mb-0">
        Fractional tokens you create are deployed on-chain. Hold RFT and property NFTs to participate.
      </p>
    </PageLayout>
  );
}

export default function FractionalPage() {
  return (
    <ConnectGate message="Connect your wallet to create fractional ownership tokens.">
      <ContractGuard contractNames={CONTRACT_NAMES.FRACTIONAL_PROPERTY_FACTORY}>
        <FractionalContent />
      </ContractGuard>
    </ConnectGate>
  );
}
