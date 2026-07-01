import React from "react";
import { Container } from "react-bootstrap";
import { useWeb3 } from "../../context/Web3Context";
import { CONTRACT_NAMES } from "../../constants";

const CONTRACT_MESSAGES = {
  [CONTRACT_NAMES.MARKETPLACE]: "Marketplace contract not configured. Deploy contracts and set addresses.",
  [CONTRACT_NAMES.PROPERTY_NFT]: "Property NFT contract not configured.",
  [CONTRACT_NAMES.RENTAL_MANAGER]: "Rental Manager contract not configured.",
  [CONTRACT_NAMES.STAKING]: "Staking or RFT contract not configured.",
  [CONTRACT_NAMES.FRACTIONAL_PROPERTY_FACTORY]: "Fractional Property Factory not configured.",
};

/**
 * Renders children only when the given contract(s) are available; otherwise shows message.
 * Use after ConnectGate when the page needs a specific contract.
 */
export function ContractGuard({ contractNames, children, message }) {
  const { contracts } = useWeb3();
  const names = Array.isArray(contractNames) ? contractNames : [contractNames];
  const missing = names.find((name) => !contracts[name]);
  const displayMessage = message || (missing && CONTRACT_MESSAGES[missing]) || "Required contract not configured.";

  if (missing) {
    return (
      <Container className="py-5 text-center">
        <p className="gray-50">{displayMessage}</p>
      </Container>
    );
  }

  return children;
}
