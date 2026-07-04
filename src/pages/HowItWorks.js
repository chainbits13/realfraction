import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import AnimationTitles from "../components/functions/AnimationTitles";

const steps = [
  { num: "1", title: "Connect wallet", text: "Link your wallet to buy, rent, or bid on properties." },
  { num: "2", title: "Browse marketplace", text: "Discover properties for sale, rent, or auction." },
  { num: "3", title: "Own or earn", text: "Purchase, rent, or earn from fractional ownership." },
];

function HowItWorks() {
  return (
    <div className="how-it-works py-5" id="how-it-works">
      <Container>
        <AnimationTitles
          className="title mx-auto text-center"
          title="How it works"
        />
        <p className="gray-50 text-center mb-5 mx-auto" style={{ maxWidth: "560px" }}>
          Programmable real estate: buy, rent, or bid. Fractional ownership and transparent transactions.
        </p>
        <motion.div
          className="d-flex flex-column flex-md-row justify-content-center gap-4 gap-md-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {steps.map((step) => (
            <div
              key={step.num}
              className="text-center px-3"
              style={{ flex: "1", minWidth: "180px" }}
            >
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "48px",
                  height: "48px",
                  background: "rgba(53, 109, 246, 0.2)",
                  color: "#356df6",
                  fontWeight: "bold",
                }}
              >
                {step.num}
              </div>
              <h6 className="text-white mb-2">{step.title}</h6>
              <p className="gray-90 small mb-0">{step.text}</p>
            </div>
          ))}
        </motion.div>
      </Container>
    </div>
  );
}

export default HowItWorks;
