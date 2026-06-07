import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ROUTES from "../config/routes";

function Footer() {
  return (
    <footer>
      <Container>
        <div className="d-flex justify-content-between flex-column flex-md-row flex-wrap pt-5 pb-4">
          <motion.div
            initial={{ x: -200 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={require("../images/logo/logo.png")}
              alt="logo"
              className="mb-3"
            />
            <p className="gray-100">
              Please contact us if you have any specific <br /> idea or request.
            </p>
            <p className="gray-100 small mt-2">
              RFT token — stake and earn. Fractional ownership on-chain.
            </p>
          </motion.div>
          <span className="d-block d-md-none"></span>
          <motion.div
            initial={{ x: 200 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.8 }}
            className="d-flex"
          >
            <div className="me-5">
              <h6 className="gray-100 text-uppercase mb-2 fw-normal">
                Company
              </h6>
              <ul className="p-0 list-unstyled">
                <li>
                  <Link to={ROUTES.HOW_IT_WORKS} className="gray-100 text-decoration-none">How it works</Link>
                </li>
                <li>
                  <Link to={ROUTES.MARKETPLACE} className="gray-100 text-decoration-none">Marketplace</Link>
                </li>
                <li>
                  <Link to={ROUTES.ABOUT} className="gray-100 text-decoration-none">About Us</Link>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="gray-100 text-uppercase mb-2 fw-normal">
                Socials
              </h6>
              <ul className="p-0">
                <li>Twitter</li>
                <li>Instagram</li>
                <li>Facebook</li>
              </ul>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="d-flex justify-content-between flex-column flex-md-row flex-wrap gray-100 pt-3"
        >
          <p>© 2025 RealFraction. All rights reserved</p>
        </motion.div>
      </Container>
    </footer>
  );
}

export default Footer;
