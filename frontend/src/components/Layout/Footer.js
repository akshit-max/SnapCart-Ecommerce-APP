import { Link } from "react-router-dom";
import { FiShoppingBag, FiTruck, FiShield, FiRotateCcw, FiHeadphones } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="footer-modern">
      <div className="container">
        <div className="row g-4 justify-content-between">
          {/* Brand & Mission */}
          <div className="col-lg-4 col-md-6 footer-brand">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "18px",
                }}
              >
                <FiShoppingBag />
              </div>
              <h5 className="mb-0 fw-bold text-white">SnapCart</h5>
            </div>
            <p className="small text-secondary" style={{ lineHeight: "1.7", maxWidth: "340px" }}>
              SnapCart is your premier destination for curated fashion, premium electronics, footwear, and home essentials. Built with modern engineering and high-availability cloud architecture.
            </p>
          </div>

          {/* Quick Shop Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="footer-col-title">Shop Categories</h6>
            <ul className="footer-links">
              <li><Link to="/category/electronics">Electronics & Tech</Link></li>
              <li><Link to="/category/footwear">Sneakers & Shoes</Link></li>
              <li><Link to="/category/mens-collection">Men's Apparel</Link></li>
              <li><Link to="/category/women-collection">Women's Fashion</Link></li>
              <li><Link to="/category/accessories">Watches & Bags</Link></li>
              <li><Link to="/category/home-living">Home & Living</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="footer-col-title">Customer Care</h6>
            <ul className="footer-links">
              <li><Link to="/contact">Contact Support</Link></li>
              <li><Link to="/policy">Privacy Policy</Link></li>
              <li><Link to="/about">About SnapCart</Link></li>
              <li><Link to="/cart">Shopping Bag</Link></li>
            </ul>
          </div>

          {/* Value Props & Newsletter */}
          <div className="col-lg-3 col-md-6">
            <h6 className="footer-col-title">Our Promise</h6>
            <div className="d-flex flex-column gap-3 small">
              <div className="d-flex align-items-center gap-2">
                <FiTruck className="text-primary fs-5" />
                <span>Free Express Shipping on orders over ₹999</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FiShield className="text-primary fs-5" />
                <span>100% Genuine, Authenticity Guaranteed</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FiRotateCcw className="text-primary fs-5" />
                <span>7-Day Doorstep Replacement Policy</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FiHeadphones className="text-primary fs-5" />
                <span>24/7 Dedicated Support Hotline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} SnapCart Inc. All rights reserved.</span>
          <div className="payment-badges-row">
            <span>Accepted Payments:</span>
            <span className="payment-chip">UPI / GPay</span>
            <span className="payment-chip">Razorpay</span>
            <span className="payment-chip">Credit & Debit Cards</span>
            <span className="payment-chip">NetBanking</span>
            <span className="payment-chip">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
