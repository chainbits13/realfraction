import React from "react";
import { Container, Button } from "react-bootstrap";
import { useWeb3 } from "../../context/Web3Context";

/**
 * Renders children only when wallet is connected; otherwise shows connect CTA.
 * Use on pages that require wallet (marketplace, my-properties, rentals, etc.).
 */
export function ConnectGate({ children, message = "Connect your wallet to continue." }) {
  const { isConnected, connect, loading } = useWeb3();

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status" aria-label="Loading">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!isConnected) {
    return (
      <Container className="py-5 text-center">
        <p className="gray-50 mb-3">{message}</p>
        <Button variant="primary" onClick={connect} aria-label="Connect wallet">
          Connect Wallet
        </Button>
      </Container>
    );
  }

  return children;
}
