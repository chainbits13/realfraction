import React, { useState, useCallback } from "react";
import { Card, Row, Col, Button, Tabs, Tab, Badge } from "react-bootstrap";
import { useWeb3 } from "../context/Web3Context";
import { ConnectGate } from "../components/shared/ConnectGate";
import { ContractGuard } from "../components/shared/ContractGuard";
import { PageLayout, LoadingSpinner, EmptyState } from "../components/shared/PageLayout";
import { useMarketplaceListings } from "../hooks/useMarketplaceListings";
import { useTransaction } from "../hooks/useTransaction";
import { formatEth, formatAddress, formatDate } from "../utils/format";
import { LISTING_TYPE_LABELS, CONTRACT_NAMES } from "../config/constants";
import { ethers } from "ethers";

function MarketplaceContent() {
  const { contracts } = useWeb3();
  const [tab, setTab] = useState("all");
  const { listings, loading, error, refetch } = useMarketplaceListings(contracts, tab);
  const { execute, isPending } = useTransaction();

  const handleBuy = useCallback(
    async (listingIndex, priceWei) => {
      if (!contracts?.Marketplace) return;
      try {
        await execute(
          `buy-${listingIndex}`,
          () =>
            contracts.Marketplace.buyListing(listingIndex, { value: priceWei }).then((tx) => tx.wait()),
          { successMessage: "Purchase complete.", errorMessage: "Purchase failed." }
        );
        refetch();
      } catch (_) {}
    },
    [contracts, execute, refetch]
  );

  const handleBid = useCallback(
    async (listingIndex, bidEth) => {
      if (!contracts?.Marketplace || !bidEth) return;
      const bidWei = ethers.parseEther(String(bidEth));
      await execute(
        `bid-${listingIndex}`,
        () => contracts.Marketplace.placeBid(listingIndex, { value: bidWei }).then((tx) => tx.wait()),
        { successMessage: "Bid placed.", errorMessage: "Bid failed." }
      );
    },
    [contracts, execute]
  );

  const handleSettle = useCallback(
    async (listingIndex) => {
      if (!contracts?.Marketplace) return;
      try {
        await execute(
          `settle-${listingIndex}`,
          () => contracts.Marketplace.settleAuction(listingIndex).then((tx) => tx.wait()),
          { successMessage: "Auction settled.", errorMessage: "Settle failed." }
        );
        refetch();
      } catch (_) {}
    },
    [contracts, execute, refetch]
  );

  return (
    <PageLayout title="Marketplace">
      <Tabs activeKey={tab} onSelect={(k) => setTab(k ?? "all")} className="mb-4">
        <Tab eventKey="all" title="All" />
        <Tab eventKey="sale" title="Sale" />
        <Tab eventKey="rent" title="Rent" />
        <Tab eventKey="auction" title="Auction" />
      </Tabs>

      {error && <p className="text-danger small">{error}</p>}
      {loading && <LoadingSpinner />}
      {!loading && listings.length === 0 && (
        <EmptyState message="No active listings." />
      )}
      {!loading && listings.length > 0 && (
        <Row xs={1} md={2} lg={3} className="g-4">
          {listings.map((l) => (
            <Col key={l.listingIndex}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Badge bg="secondary">Token #{l.tokenId}</Badge>
                  <Badge bg="info" className="ms-1">{l.listingType}</Badge>
                  <Card.Title className="mt-2">
                    {formatEth(l.priceWei)} ETH
                    {l.listingType === LISTING_TYPE_LABELS[1] && l.rentDurationSeconds && (
                      <small className="gray-50"> / {Number(l.rentDurationSeconds) / 86400} days</small>
                    )}
                  </Card.Title>
                  <Card.Text className="small gray-50">
                    Lister: {formatAddress(l.lister)}
                  </Card.Text>
                  {l.listingType === LISTING_TYPE_LABELS[0] && (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isPending(`buy-${l.listingIndex}`)}
                      onClick={() => handleBuy(l.listingIndex, l.priceWei)}
                    >
                      {isPending(`buy-${l.listingIndex}`) ? "Confirming…" : "Buy"}
                    </Button>
                  )}
                  {l.listingType === LISTING_TYPE_LABELS[2] && (
                    <>
                      <p className="small mb-1">Ends: {formatDate(l.auctionEndTime)}</p>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                        disabled={isPending(`bid-${l.listingIndex}`)}
                        onClick={() => {
                          const bid = window.prompt("Enter bid in ETH");
                          if (bid != null && bid !== "") handleBid(l.listingIndex, bid);
                        }}
                      >
                        Bid
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        disabled={isPending(`settle-${l.listingIndex}`)}
                        onClick={() => handleSettle(l.listingIndex)}
                      >
                        Settle
                      </Button>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </PageLayout>
  );
}

export default function MarketplacePage() {
  return (
    <ConnectGate message="Connect your wallet to view and interact with the marketplace.">
      <ContractGuard contractNames={[CONTRACT_NAMES.MARKETPLACE]}>
        <MarketplaceContent />
      </ContractGuard>
    </ConnectGate>
  );
}
