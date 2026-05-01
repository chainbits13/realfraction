import React, { useState, useCallback } from "react";
import { Card, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { useWeb3 } from "../context/Web3Context";
import { ConnectGate } from "../components/shared/ConnectGate";
import { ContractGuard } from "../components/shared/ContractGuard";
import { PageLayout, LoadingSpinner, EmptyState } from "../components/shared/PageLayout";
import { useOwnedTokenIds } from "../hooks/useOwnedTokenIds";
import { useTransaction } from "../hooks/useTransaction";
import {
  LISTING_TYPES,
  DEFAULT_LIST_FORM,
  CONTRACT_NAMES,
  SECONDS_PER_DAY,
} from "../config/constants";
import { ethers } from "ethers";

const initialListForm = () => ({
  type: String(LISTING_TYPES.SALE),
  price: DEFAULT_LIST_FORM.price,
  rentDays: DEFAULT_LIST_FORM.rentDays,
  auctionEndHours: DEFAULT_LIST_FORM.auctionEndHours,
});

function MyPropertiesContent() {
  const { address, contracts, config } = useWeb3();
  const { tokenIds, loading } = useOwnedTokenIds(contracts, address);
  const { execute, isPending } = useTransaction();
  const [listModal, setListModal] = useState(null);
  const [listForm, setListForm] = useState(initialListForm());

  const resetListModal = useCallback(() => {
    setListModal(null);
    setListForm(initialListForm());
  }, []);

  const handleList = useCallback(
    async () => {
      if (listModal == null || !contracts?.Marketplace || !contracts?.PropertyNft) return;
      const tokenId = listModal;
      const { type, price, rentDays, auctionEndHours } = listForm;
      const priceWei = ethers.parseEther(price?.trim() || "0");
      if (priceWei === 0n) return;
      const rentDurationSeconds = type === String(LISTING_TYPES.RENT) ? Number(rentDays) * SECONDS_PER_DAY : 0;
      const auctionEndTime =
        type === String(LISTING_TYPES.AUCTION)
          ? Math.floor(Date.now() / 1000) + Number(auctionEndHours || 24) * 3600
          : 0;

      try {
        const marketplaceAddress = config?.Marketplace;
        if (marketplaceAddress) {
          const approved = await contracts.PropertyNft.getApproved(tokenId);
          if (approved !== marketplaceAddress) {
            await execute(
              `approve-${tokenId}`,
              () =>
                contracts.PropertyNft.approve(marketplaceAddress, tokenId).then((tx) => tx.wait()),
              { successMessage: "Approval set.", errorMessage: "Approval failed." }
            );
          }
        }
        await execute(
          `list-${tokenId}`,
          () =>
            contracts.Marketplace.list(
              tokenId,
              type,
              priceWei,
              rentDurationSeconds,
              auctionEndTime
            ).then((tx) => tx.wait()),
          { successMessage: "Listed.", errorMessage: "List failed." }
        );
        resetListModal();
      } catch (_) {}
    },
    [listModal, listForm, contracts, config, execute, resetListModal]
  );

  return (
    <PageLayout title="My Properties">
      {loading && <LoadingSpinner />}
      {!loading && tokenIds.length === 0 && (
        <EmptyState
          message="You don't own any property NFTs yet. Mint one from Admin if you have minter role."
        />
      )}
      {!loading && tokenIds.length > 0 && (
        <Row xs={1} md={2} lg={3} className="g-4">
          {tokenIds.map((id) => (
            <Col key={id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Token #{id}</Card.Title>
                  <Button variant="primary" size="sm" onClick={() => setListModal(id)}>
                    List on Marketplace
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={listModal != null} onHide={resetListModal} centered aria-labelledby="list-modal-title">
        <Modal.Header closeButton>
          <Modal.Title id="list-modal-title">List Token #{listModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Type</Form.Label>
            <Form.Select
              value={listForm.type}
              onChange={(e) => setListForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value={String(LISTING_TYPES.SALE)}>Sale</option>
              <option value={String(LISTING_TYPES.RENT)}>Rent</option>
              <option value={String(LISTING_TYPES.AUCTION)}>Auction</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Price (ETH)</Form.Label>
            <Form.Control
              type="text"
              placeholder="0.1"
              value={listForm.price}
              onChange={(e) => setListForm((f) => ({ ...f, price: e.target.value }))}
            />
          </Form.Group>
          {listForm.type === String(LISTING_TYPES.RENT) && (
            <Form.Group className="mb-2">
              <Form.Label>Rent duration (days)</Form.Label>
              <Form.Control
                type="number"
                value={listForm.rentDays}
                onChange={(e) => setListForm((f) => ({ ...f, rentDays: e.target.value }))}
              />
            </Form.Group>
          )}
          {listForm.type === String(LISTING_TYPES.AUCTION) && (
            <Form.Group className="mb-2">
              <Form.Label>Auction end (hours from now)</Form.Label>
              <Form.Control
                type="number"
                value={listForm.auctionEndHours}
                onChange={(e) => setListForm((f) => ({ ...f, auctionEndHours: e.target.value }))}
              />
            </Form.Group>
          )}
          <Button
            variant="primary"
            className="w-100"
            disabled={isPending(`list-${listModal}`) || !listForm.price?.trim()}
            onClick={handleList}
          >
            {isPending(`list-${listModal}`) ? "Confirming…" : "List"}
          </Button>
        </Modal.Body>
      </Modal>
    </PageLayout>
  );
}

export default function MyPropertiesPage() {
  return (
    <ConnectGate message="Connect your wallet to see your properties.">
      <ContractGuard contractNames={CONTRACT_NAMES.PROPERTY_NFT}>
        <MyPropertiesContent />
      </ContractGuard>
    </ConnectGate>
  );
}
