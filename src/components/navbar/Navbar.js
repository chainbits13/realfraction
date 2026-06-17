import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import logo from "../../images/logo/logo.png";
import { useWeb3 } from "../../context/Web3Context";
import { formatAddress } from "../../utils/format";
import ROUTES from "../../config/routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";

const NAV_ITEMS = [
  { to: ROUTES.MARKETPLACE, label: "Marketplace" },
  { to: ROUTES.MY_PROPERTIES, label: "My Properties" },
  { to: ROUTES.RENTALS, label: "Rentals" },
  { to: ROUTES.FRACTIONAL, label: "Fractional" },
  { to: ROUTES.STAKING, label: "Staking" },
  { to: ROUTES.ADMIN, label: "Admin" },
];

/** Header tabs: full-page routes for How it works, About Us, Developers */
const HEADER_TAB_ITEMS = [
  { to: ROUTES.HOW_IT_WORKS, label: "How it works" },
  { to: ROUTES.ABOUT, label: "About Us" },
  { to: ROUTES.DEVELOPERS, label: "Developers" },
];

function NavBar() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { address, isConnected, connect, disconnect, error } = useWeb3();

  const handleWalletClick = () => {
    if (isConnected) setShowWalletModal(true);
    else connect();
  };

  const handleDisconnect = () => {
    disconnect();
    setShowWalletModal(false);
  };

  return (
    <>
      <Navbar expand="lg" className="navbar-pinned" variant="dark">
        <Container className="navbar-container">
          <Navbar.Brand as={Link} to={ROUTES.HOME} className="navbar-brand-link me-lg-4">
            <img className="logo" src={logo} alt="RealFraction" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" aria-label="Toggle navigation" className="navbar-toggler-custom" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="navbar-nav-custom me-auto my-2 my-lg-0 gap-1 gap-lg-0" navbarScroll>
              <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-1">
                {NAV_ITEMS.map(({ to, label }) => (
                  <Nav.Link
                    key={to}
                    as={NavLink}
                    to={to}
                    end={to !== ROUTES.HOME}
                    className="nav-tab"
                  >
                    <span className="nav-tab-label">{label}</span>
                  </Nav.Link>
                ))}
                {HEADER_TAB_ITEMS.map(({ to, label }) => (
                  <Nav.Link
                    key={to}
                    as={NavLink}
                    to={to}
                    className="nav-tab nav-tab-info"
                  >
                    <span className="nav-tab-label">{label}</span>
                  </Nav.Link>
                ))}
              </div>
            </Nav>
          </Navbar.Collapse>
          <div className="d-flex align-items-center order navbar-actions">
            <Button
              variant="primary"
              className="btn-connect d-none d-lg-inline-flex"
              onClick={handleWalletClick}
              aria-label={isConnected ? "Wallet connected" : "Connect wallet"}
            >
              <i className="fa-solid fa-wallet me-2" aria-hidden />
              {isConnected ? formatAddress(address) : "Connect Wallet"}
            </Button>
          </div>
        </Container>
      </Navbar>

      {error && (
        <div className="alert alert-warning mb-0 rounded-0" role="alert">
          {error}
        </div>
      )}

      <Modal
        show={showWalletModal}
        onHide={() => setShowWalletModal(false)}
        centered
        className="connect-wallet-modal"
        aria-labelledby="wallet-modal-title"
      >
        <Modal.Header closeButton className="border-secondary">
          <Modal.Title id="wallet-modal-title" className="text-white">Wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-white-50">
          <p className="mb-2">Connected: <code>{address}</code></p>
          <Button variant="outline-danger" size="sm" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NavBar;
