import { Link } from "react-router-dom";
import { FiShield, FiTruck, FiAward, FiArrowRight } from "react-icons/fi";
import Layout from "../components/Layout/Layout";

const AboutPage = () => {
  return (
    <Layout title="About Us - SnapCart">
      <div className="container py-4">
        {/* Hero Section */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill mb-2">
            OUR STORY & MISSION
          </span>
          <h2 className="fw-bold text-dark display-6">Engineered for Quality, Built for Trust</h2>
          <p className="text-muted fs-6 mx-auto mt-2" style={{ maxWidth: "600px" }}>
            SnapCart is a next-generation e-commerce platform curating premier apparel, cutting-edge electronics, footwear, and home essentials.
          </p>
        </div>

        {/* Story Banner */}
        <div className="card-box p-4 p-lg-5 mb-5 overflow-hidden position-relative">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h3 className="fw-bold text-dark mb-3">Shopping Without Friction</h3>
              <p className="text-secondary" style={{ lineHeight: "1.8" }}>
                We founded SnapCart with a single obsession: eliminating the compromises of online shopping. No misleading discounts, no out-of-stock cancellations after payment, and zero hidden shipping surcharges.
              </p>
              <p className="text-secondary" style={{ lineHeight: "1.8" }}>
                Every single item in our catalog is backed by real-time atomic inventory reservation, verified Razorpay payment gateways, and direct doorstep returns.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/" className="btn btn-brand px-4 py-2">
                  Explore Catalog <FiArrowRight className="ms-1" />
                </Link>
                <Link to="/contact" className="btn btn-outline-custom px-4 py-2">
                  Get In Touch
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="rounded-4 overflow-hidden shadow-sm" style={{ height: "340px" }}>
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                  alt="SnapCart Store Concept"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="row g-3 mb-5 text-center">
          <div className="col-6 col-md-3">
            <div className="card-box p-4">
              <h3 className="fw-extrabold text-primary mb-1">50K+</h3>
              <p className="text-muted small mb-0 fw-semibold">Satisfied Shoppers</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card-box p-4">
              <h3 className="fw-extrabold text-primary mb-1">99.8%</h3>
              <p className="text-muted small mb-0 fw-semibold">On-Time Dispatch</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card-box p-4">
              <h3 className="fw-extrabold text-primary mb-1">100%</h3>
              <p className="text-muted small mb-0 fw-semibold">Authentic Products</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card-box p-4">
              <h3 className="fw-extrabold text-primary mb-1">4.9 ★</h3>
              <p className="text-muted small mb-0 fw-semibold">Average Store Rating</p>
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card-box h-100 p-4">
              <div className="fs-1 text-primary mb-3">
                <FiShield />
              </div>
              <h5 className="fw-bold text-dark">Strict Quality Standards</h5>
              <p className="text-muted small">
                Every product is inspected by our sourcing team before listing, ensuring top-tier fabrics, genuine electronics, and durable craftsmanship.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card-box h-100 p-4">
              <div className="fs-1 text-primary mb-3">
                <FiTruck />
              </div>
              <h5 className="fw-bold text-dark">Swift Express Fulfillment</h5>
              <p className="text-muted small">
                We partner with leading domestic logistics networks to dispatch orders within 24 hours with live SMS and email tracking updates.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card-box h-100 p-4">
              <div className="fs-1 text-primary mb-3">
                <FiAward />
              </div>
              <h5 className="fw-bold text-dark">Customer-First Returns</h5>
              <p className="text-muted small">
                Changed your mind? Return any eligible unworn or unopened product within 7 days with zero cancellation fees and instant refunds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
