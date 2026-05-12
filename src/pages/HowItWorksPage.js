import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimationTitles from "../components/functions/AnimationTitles";
import ROUTES from "../config/routes";

const STEPS = [
  { num: "1", title: "Connect wallet", text: "Link your wallet to buy, rent, or bid on properties." },
  { num: "2", title: "Browse marketplace", text: "Discover properties for sale, rent, or auction." },
  { num: "3", title: "Own or earn", text: "Purchase, rent, or earn from fractional ownership." },
];

export default function HowItWorksPage() {
  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AnimationTitles title="How it works" className="text-center mb-2" />
        <p className="gray-50 text-center mb-5 mx-auto" style={{ maxWidth: "560px" }}>
          Programmable real estate: buy, rent, or bid. Fractional ownership and transparent transactions.
        </p>
        <div className="d-flex flex-column flex-md-row justify-content-center gap-4 gap-md-5 mb-5">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="card-glass text-center px-4 py-4 rounded-3"
              style={{ flex: "1", minWidth: "180px" }}
            >
              <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 bg-primary bg-opacity-20 text-primary fw-bold" style={{ width: "56px", height: "56px", fontSize: "1.25rem" }}>
                {step.num}
              </div>
              <h5 className="text-white mb-2">{step.title}</h5>
              <p className="gray-90 small mb-0">{step.text}</p>
            </div>
          ))}
        </div>
        <p className="text-center">
          <Link to={ROUTES.HOME} className="btn btn-outline-primary rounded-pill px-4">
            Back to dashboard
          </Link>
        </p>
      </motion.div>
    </Container>
  );
}
