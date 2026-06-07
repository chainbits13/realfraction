import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import AnimationTitles from "../components/functions/AnimationTitles";
import ROUTES from "../config/routes";
import "swiper/css";

const ROW1 = [
  { logo: require("../images/developers/logo-01.png"), name: "UA real house" },
  { logo: require("../images/developers/logo-02.png"), name: "RealFraction US" },
  { logo: require("../images/developers/logo-03.png"), name: "Happy Neighbor" },
  { logo: require("../images/developers/logo-04.png"), name: "American Home Agents" },
  { logo: require("../images/developers/logo-05.png"), name: "Ukr Home Agents" },
  { logo: require("../images/developers/logo-06.png"), name: "UA real estate agency" },
];

const ROW2 = [
  { logo: require("../images/developers/logo-07.png"), name: "Red Oak Realty" },
  { logo: require("../images/developers/logo-08.png"), name: "Dream House" },
  { logo: require("../images/developers/logo-09.png"), name: "Leading Real Estate Companies" },
  { logo: require("../images/developers/logo-10.png"), name: "Home Partners of World" },
  { logo: require("../images/developers/logo-11.png"), name: "Red Oak Realty" },
  { logo: require("../images/developers/logo-12.png"), name: "UA real estate agency" },
  { logo: require("../images/developers/logo-13.png"), name: "American Home Agents" },
];

function DeveloperRow({ items }) {
  return (
    <Swiper
      className="my-3"
      grabCursor
      loop
      spaceBetween={24}
      breakpoints={{
        0: { slidesPerView: 2 },
        596: { slidesPerView: 3 },
        998: { slidesPerView: 4 },
        1198: { slidesPerView: 5 },
      }}
    >
      {items.map((item) => (
        <SwiperSlide key={item.name}>
          <div className="card-glass d-flex justify-content-between align-items-center py-3 px-3 rounded-3">
            <img className="pe-3" src={item.logo} alt="" style={{ maxHeight: 40 }} />
            <h6 className="text-white m-0 small">{item.name}</h6>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default function DevelopersPage() {
  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AnimationTitles title="Our partners & developers" className="text-center mb-2" />
        <p className="gray-50 text-center mb-4">
          The value of real estate can be affected by its utility, project, and demand.
        </p>
        <DeveloperRow items={ROW1} />
        <DeveloperRow items={ROW2} />
        <p className="text-center mt-4">
          <Link to={ROUTES.HOME} className="btn btn-outline-secondary rounded-pill px-4">
            Back to dashboard
          </Link>
        </p>
      </motion.div>
    </Container>
  );
}
