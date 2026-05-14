import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { useWeb3 } from "../context/Web3Context";
import { ConnectGate } from "../components/shared/ConnectGate";
import { ContractGuard } from "../components/shared/ContractGuard";
import { PageLayout, LoadingSpinner } from "../components/shared/PageLayout";
import { useTransaction } from "../hooks/useTransaction";
import { formatEth, formatAddress } from "../utils/format";
import { CONTRACT_NAMES } from "../config/constants";
import { ethers } from "ethers";
import { SECONDS_PER_DAY } from "../config/constants";

const emptyCreateForm = () => ({ tokenId: "", tenant: "", rentEth: "", periodDays: "" });

function RentalsContent() {
  const { address, contracts } = useWeb3();
  const { execute, isPending } = useTransaction();
  const [asLandlord, setAsLandlord] = useState([]);
  const [asTenant, setAsTenant] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm());
  const [lookupTokenId, setLookupTokenId] = useState("");
  const [lookupRental, setLookupRental] = useState(null);

  const loadRentals = useCallback(async () => {
    if (!contracts?.RentalManager || !contracts?.PropertyNft || !address) return;
    setLoading(true);
    try {
      const landlordList = [];
      const tenantList = [];
      const balance = await contracts.PropertyNft.balanceOf(address);
      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await contracts.PropertyNft.tokenOfOwnerByIndex(address, i);
        const rental = await contracts.RentalManager.getRental(Number(tokenId));
        if (rental.landlord !== ethers.ZeroAddress) {
          if (rental.landlord.toLowerCase() === address.toLowerCase())
            landlordList.push({ tokenId: Number(tokenId), ...rental });
          if (rental.tenant.toLowerCase() === address.toLowerCase())
            tenantList.push({ tokenId: Number(tokenId), ...rental });
        }
      }
      setAsLandlord(landlordList);
      setAsTenant(tenantList);
    } catch {
      setAsLandlord([]);
      setAsTenant([]);
    } finally {
      setLoading(false);
    }
  }, [contracts?.RentalManager, contracts?.PropertyNft, address]);

  useEffect(() => {
    loadRentals();
  }, [loadRentals]);

  const handleLookupRental = useCallback(async () => {
    if (!contracts?.RentalManager || !lookupTokenId) return;
    try {
      const r = await contracts.RentalManager.getRental(Number(lookupTokenId));
      setLookupRental(r);
    } catch {
      setLookupRental(null);
    }
  }, [contracts?.RentalManager, lookupTokenId]);

  const handleCreateRental = useCallback(async () => {
    const { tokenId, tenant, rentEth, periodDays } = createForm;
    if (!contracts?.RentalManager || !tokenId?.trim() || !tenant?.trim() || !rentEth?.trim() || !periodDays?.trim())
      return;
    const rentWei = ethers.parseEther(rentEth.trim());
    const periodSeconds = Number(periodDays) * SECONDS_PER_DAY;
    try {
      await execute(
        "create-rental",
        () =>
          contracts.RentalManager.createRentalAgreement(
            Number(tokenId),
            tenant.trim(),
            rentWei,
            periodSeconds
          ).then((tx) => tx.wait()),
        { successMessage: "Rental created.", errorMessage: "Create rental failed." }
      );
      setCreateModal(false);
      setCreateForm(emptyCreateForm());
      loadRentals();
    } catch (_) {}
  }, [createForm, contracts?.RentalManager, execute, loadRentals]);

  const handlePayRent = useCallback(
    async (tokenId, rentWeiPerPeriod) => {
      if (!contracts?.RentalManager) return;
      try {
        await execute(
          `pay-${tokenId}`,
          () =>
            contracts.RentalManager.payRent(tokenId, { value: rentWeiPerPeriod }).then((tx) => tx.wait()),
          { successMessage: "Rent paid.", errorMessage: "Pay rent failed." }
        );
        setAsTenant((prev) => prev.filter((r) => r.tokenId !== tokenId));
        if (lookupRental && Number(lookupTokenId) === tokenId) setLookupRental(null);
      } catch (_) {}
    },
    [contracts?.RentalManager, execute, lookupRental, lookupTokenId]
  );

  const isTenant = useCallback(
    (tenantAddr) => tenantAddr && address && String(tenantAddr).toLowerCase() === address.toLowerCase(),
    [address]
  );

  return (
    <PageLayout title="Rentals">
      <div className="mb-3">
        <Button variant="outline-primary" onClick={() => setCreateModal(true)}>
          Create Rental Agreement
        </Button>
      </div>

      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <h5>As landlord</h5>
          {asLandlord.length === 0 ? (
            <p className="gray-50">No rentals where you are the landlord.</p>
          ) : (
            <Row xs={1} md={2} className="g-3 mb-4">
              {asLandlord.map((r) => (
                <Col key={r.tokenId}>
                  <Card>
                    <Card.Body>
                      <Card.Title>Token #{r.tokenId}</Card.Title>
                      <p className="small mb-0">
                        Tenant: {formatAddress(r.tenant)} · Rent: {formatEth(r.rentWeiPerPeriod)} ETH/period
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <h5>Look up rental (by property token ID)</h5>
          <div className="d-flex gap-2 mb-3">
            <Form.Control
              style={{ maxWidth: 120 }}
              type="number"
              value={lookupTokenId}
              onChange={(e) => setLookupTokenId(e.target.value)}
              placeholder="Token ID"
            />
            <Button variant="outline-secondary" size="sm" onClick={handleLookupRental}>
              Look up
            </Button>
          </div>
          {lookupRental && lookupRental.landlord !== ethers.ZeroAddress && (
            <Card className="mb-3">
              <Card.Body>
                <p className="mb-1">
                  Token #{lookupTokenId} · Tenant: {formatAddress(lookupRental.tenant)} · Rent:{" "}
                  {formatEth(lookupRental.rentWeiPerPeriod)} ETH
                </p>
                {isTenant(lookupRental.tenant) && (
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={isPending(`pay-${lookupTokenId}`)}
                    onClick={() => handlePayRent(Number(lookupTokenId), lookupRental.rentWeiPerPeriod)}
                  >
                    Pay Rent
                  </Button>
                )}
              </Card.Body>
            </Card>
          )}

          <h5 className="mt-4">As tenant</h5>
          {asTenant.length === 0 ? (
            <p className="gray-50">No rentals where you are the tenant.</p>
          ) : (
            <Row xs={1} md={2} className="g-3">
              {asTenant.map((r) => (
                <Col key={r.tokenId}>
                  <Card>
                    <Card.Body>
                      <Card.Title>Token #{r.tokenId}</Card.Title>
                      <p className="small mb-2">Rent: {formatEth(r.rentWeiPerPeriod)} ETH</p>
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={isPending(`pay-${r.tokenId}`)}
                        onClick={() => handlePayRent(r.tokenId, r.rentWeiPerPeriod)}
                      >
                        Pay Rent
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      <Modal show={createModal} onHide={() => setCreateModal(false)} centered aria-labelledby="create-rental-title">
        <Modal.Header closeButton>
          <Modal.Title id="create-rental-title">Create Rental</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Property Token ID</Form.Label>
            <Form.Control
              value={createForm.tokenId}
              onChange={(e) => setCreateForm((f) => ({ ...f, tokenId: e.target.value }))}
              placeholder="0"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Tenant address</Form.Label>
            <Form.Control
              value={createForm.tenant}
              onChange={(e) => setCreateForm((f) => ({ ...f, tenant: e.target.value }))}
              placeholder="0x..."
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Rent per period (ETH)</Form.Label>
            <Form.Control
              value={createForm.rentEth}
              onChange={(e) => setCreateForm((f) => ({ ...f, rentEth: e.target.value }))}
              placeholder="0.1"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Period (days)</Form.Label>
            <Form.Control
              type="number"
              value={createForm.periodDays}
              onChange={(e) => setCreateForm((f) => ({ ...f, periodDays: e.target.value }))}
            />
          </Form.Group>
          <Button
            variant="primary"
            className="w-100"
            disabled={isPending("create-rental")}
            onClick={handleCreateRental}
          >
            {isPending("create-rental") ? "Confirming…" : "Create"}
          </Button>
        </Modal.Body>
      </Modal>
    </PageLayout>
  );
}

export default function RentalsPage() {
  return (
    <ConnectGate message="Connect your wallet to manage rentals.">
      <ContractGuard contractNames={CONTRACT_NAMES.RENTAL_MANAGER}>
        <RentalsContent />
      </ContractGuard>
    </ConnectGate>
  );
}
