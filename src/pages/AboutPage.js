import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimationTitles from "../components/functions/AnimationTitles";
import ROUTES from "../config/routes";

export default function AboutPage() {
  return (
    <Container className="py-5">
      <motion.div
        className="d-flex justify-content-between flex-wrap flex-md-nowrap gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ maxWidth: "560px" }}>
          <AnimationTitles title="What is RealFraction?" className="mb-3" />
          <p className="gray-50 mb-4">
            As new technologies like cryptocurrency develop, the real estate sector is changing drastically.
            It is important to understand both how these technologies and the traditional real estate market work.
            Governments are unable to comprehend the rapid advancement of technology and modify their legal
            frameworks to accommodate it fast enough.
          </p>
          <p className="gray-50 mb-4">
            RealFraction brings programmable ownership, NFT-based property representation, and fractional
            investment to real estate—reducing paperwork and enabling transparent, on-chain transactions.
          </p>
          <Button variant="primary" as={Link} to={ROUTES.MARKETPLACE} className="btn-cta rounded-pill px-4">
            Explore Marketplace
          </Button>
        </div>
        <div className="d-flex flex-column gap-2">
          <div className="d-flex gap-2">
            <img
              src={require("../images/bohdan-d-fh6o-XkVQG8-unsplash.webp")}
              className="rounded"
              alt=""
              style={{ width: "160px", height: "120px", objectFit: "cover" }}
            />
            <img
              src={require("../images/john-o-nolan-6f_ANCcbj3o-unsplash.webp")}
              className="rounded"
              alt=""
              style={{ width: "160px", height: "120px", objectFit: "cover" }}
            />
          </div>
          <div className="d-flex gap-2">
            <img
              src={require("../images/julia-solonina-ci19YINguoc-unsplash.webp")}
              className="rounded"
              alt=""
              style={{ width: "160px", height: "120px", objectFit: "cover" }}
            />
            <img
              src={require("../images/theater-amazonas-manaus.webp")}
              className="rounded"
              alt=""
              style={{ width: "160px", height: "120px", objectFit: "cover" }}
            />
          </div>
        </div>
      </motion.div>
      <p className="text-center mt-5">
        <Link to={ROUTES.HOME} className="btn btn-outline-secondary rounded-pill px-4">
          Back to dashboard
        </Link>
      </p>
    </Container>
  );
}
