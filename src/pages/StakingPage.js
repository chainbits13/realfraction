import React, { useState, useCallback } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useWeb3 } from "../context/Web3Context";
import { ConnectGate } from "../components/shared/ConnectGate";
import { ContractGuard } from "../components/shared/ContractGuard";
import { PageLayout } from "../components/shared/PageLayout";
import { useStakingBalances } from "../hooks/useStakingBalances";
import { useTransaction } from "../hooks/useTransaction";
import { formatEth } from "../utils/format";
import { CONTRACT_NAMES } from "../config/constants";
import { ethers } from "ethers";

function StakingContent() {
  const { address, contracts } = useWeb3();
  const { stakedBalance, pendingRewards, rftBalance, loading, refetch } = useStakingBalances(
    contracts,
    address
  );
  const { execute, isPending } = useTransaction();
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");

  const handleStake = useCallback(async () => {
    if (!contracts?.Staking || !stakeAmount?.trim()) return;
    const amount = ethers.parseEther(stakeAmount.trim());
    try {
      await execute(
        "stake",
        () => contracts.Staking.stake(amount).then((tx) => tx.wait()),
        { successMessage: "Staked.", errorMessage: "Stake failed." }
      );
      setStakeAmount("");
      refetch();
    } catch (_) {}
  }, [contracts?.Staking, stakeAmount, execute, refetch]);

  const handleUnstake = useCallback(async () => {
    if (!contracts?.Staking || !unstakeAmount?.trim()) return;
    const amount = ethers.parseEther(unstakeAmount.trim());
    try {
      await execute(
        "unstake",
        () => contracts.Staking.unstake(amount).then((tx) => tx.wait()),
        { successMessage: "Unstaked.", errorMessage: "Unstake failed." }
      );
      setUnstakeAmount("");
      refetch();
    } catch (_) {}
  }, [contracts?.Staking, unstakeAmount, execute, refetch]);

  const handleClaimRewards = useCallback(async () => {
    if (!contracts?.Staking) return;
    try {
      await execute(
        "claim",
        () => contracts.Staking.claimRewards().then((tx) => tx.wait()),
        { successMessage: "Rewards claimed.", errorMessage: "Claim failed." }
      );
      refetch();
    } catch (_) {}
  }, [contracts?.Staking, execute, refetch]);

  if (loading) {
    return (
      <PageLayout title="Stake RFT">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" aria-label="Loading" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Stake RFT">
      <Row>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title className="small gray-50">RFT balance</Card.Title>
              <p className="mb-0 fs-4">{formatEth(rftBalance)} RFT</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title className="small gray-50">Staked</Card.Title>
              <p className="mb-0 fs-4">{formatEth(stakedBalance)} RFT</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title className="small gray-50">Pending rewards</Card.Title>
              <p className="mb-0 fs-4">{formatEth(pendingRewards)} RFT</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card>
        <Card.Body>
          <Form.Group className="mb-2">
            <Form.Label>Stake amount (RFT)</Form.Label>
            <Form.Control
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="0"
            />
          </Form.Group>
          <Button
            variant="primary"
            className="me-2"
            disabled={isPending("stake") || !stakeAmount?.trim()}
            onClick={handleStake}
          >
            Stake
          </Button>
          <Form.Group className="mb-2 mt-3">
            <Form.Label>Unstake amount (RFT)</Form.Label>
            <Form.Control
              value={unstakeAmount}
              onChange={(e) => setUnstakeAmount(e.target.value)}
              placeholder="0"
            />
          </Form.Group>
          <Button
            variant="outline-primary"
            className="me-2"
            disabled={isPending("unstake") || !unstakeAmount?.trim()}
            onClick={handleUnstake}
          >
            Unstake
          </Button>
          <Button
            variant="success"
            disabled={isPending("claim") || !pendingRewards || pendingRewards === "0"}
            onClick={handleClaimRewards}
          >
            Claim rewards
          </Button>
        </Card.Body>
      </Card>
    </PageLayout>
  );
}

export default function StakingPage() {
  return (
    <ConnectGate message="Connect your wallet to stake RFT and claim rewards.">
      <ContractGuard contractNames={[CONTRACT_NAMES.STAKING, CONTRACT_NAMES.REAL_FRACTION_TOKEN]}>
        <StakingContent />
      </ContractGuard>
    </ConnectGate>
  );
}
