import React from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatedCounter } from "../components/dashboard/AnimatedCounter";
import AnimationTitles from "../components/functions/AnimationTitles";
import ROUTES from "../config/routes";
import Loading from "./Header";
import Partners from "./Partners";
import Properties from "./Properties";
import Join from "./Join";
import Subscribe from "./Subscribe";
import Footer from "./Footer";
import "swiper/css";

const QUICK_ACTIONS = [
  { to: ROUTES.MARKETPLACE, label: "Buy or Bid", icon: "fa-gavel", desc: "Browse listings & auctions" },
  { to: ROUTES.RENTALS, label: "Rent", icon: "fa-key", desc: "Rental agreements on-chain" },
  { to: ROUTES.STAKING, label: "Stake RFT", icon: "fa-coins", desc: "Earn rewards" },
  { to: ROUTES.FRACTIONAL, label: "Fractional", icon: "fa-chart-pie", desc: "Tokenize property" },
];

const STATS = [
  { value: 12000, suffix: "+", label: "Properties" },
  { value: 10000, suffix: "+", label: "Auctions" },
  { value: 12000, suffix: "+", label: "Developers" },
];

function DashboardPage() {
  return (
    <>
      <Loading />

      {/* Stats strip with animated counters */}
      <section className="py-5 border-bottom border-secondary border-opacity-25">
        <Container>
          <motion.div
            className="row g-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {STATS.map(({ value, suffix, label }) => (
              <Col key={label} xs={4} md={4}>
                <div className="card-glass p-4 rounded-3 h-100">
                  <h3 className="mb-0 text-primary fw-bold">
                    <AnimatedCounter target={value} suffix={suffix} />
                  </h3>
                  <span className="gray-50 small">{label}</span>
                </div>
              </Col>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Quick actions */}
      <section className="py-5">
        <Container>
          <AnimationTitles title="Get started" className="text-center mb-4 text-white" />
          <p className="gray-50 text-center mb-4 mx-auto" style={{ maxWidth: "560px" }}>
            Connect your wallet and choose an action below.
          </p>
          <Row xs={1} sm={2} lg={4} className="g-3">
            {QUICK_ACTIONS.map(({ to, label, icon, desc }, i) => (
              <Col key={to}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card
                    as={Link}
                    to={to}
                    className="h-100 text-decoration-none border border-secondary border-opacity-25 bg-black-100 hover-lift rounded-3 overflow-hidden"
                  >
                    <Card.Body className="text-center py-4 px-3">
                      <div className="mb-2 rounded-3 d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 p-3">
                        <i className={`fa-solid ${icon} fa-xl text-primary`} aria-hidden />
                      </div>
                      <Card.Title className="text-white h6 mb-1">{label}</Card.Title>
                      <Card.Text className="gray-50 small mb-0">{desc}</Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Button as={Link} to={ROUTES.HOW_IT_WORKS} variant="outline-primary" className="rounded-pill px-4">
              How it works
            </Button>
          </div>
        </Container>
      </section>

      <Partners />
      <Properties />
      <Join />
      <Subscribe />
      <Footer />
    </>
  );
}

export default DashboardPage;
