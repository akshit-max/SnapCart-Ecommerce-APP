import Layout from "../components/Layout/Layout";
import { FiShield, FiLock, FiDatabase, FiFileText } from "react-icons/fi";

const sections = [
  {
    icon: <FiDatabase className="text-primary fs-4" />,
    title: "1. Information We Collect",
    text: "When you create an account, browse our store, or place an order, we collect essential profile data including your name, email address, delivery address, and contact number. We never access, store, or process raw credit/debit card numbers or UPI PINs on our servers — all financial transactions are processed directly through Razorpay's PCI-DSS compliant vault.",
  },
  {
    icon: <FiFileText className="text-primary fs-4" />,
    title: "2. How Your Information is Used",
    text: "Your data is strictly utilized to process transactions, dispatch packages via our domestic logistics partners, provide automated shipping updates, and assist you with support inquiries. We have a strict zero-compromise policy: we never sell, lease, or monetize your personal information to third-party advertisers.",
  },
  {
    icon: <FiLock className="text-primary fs-4" />,
    title: "3. Enterprise Security & Encryption",
    text: "All passwords and sensitive security recovery answers are salted and hashed using bcrypt (10 rounds) before persistence. All communication between your browser and our API is encrypted via 256-bit TLS/SSL encryption.",
  },
  {
    icon: <FiShield className="text-primary fs-4" />,
    title: "4. Session & Local Storage",
    text: "We use browser local storage solely to retain your active authentication token and maintain persistent shopping cart items across sessions. You can purge this data at any time by logging out or clearing your browser cache.",
  },
];

const Policy = () => {
  return (
    <Layout title="Privacy & Security Policy - SnapCart">
      <div className="container py-4" style={{ maxWidth: "860px" }}>
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill mb-2">
            SECURITY & PRIVACY
          </span>
          <h2 className="fw-bold text-dark">Privacy & Consumer Protection</h2>
          <p className="text-muted small mx-auto">
            Last updated November 2026. Learn how we safeguard your data and payment privacy.
          </p>
        </div>

        <div className="card-box p-4 p-lg-5 mb-4">
          <div className="d-flex flex-column gap-4">
            {sections.map((section) => (
              <div key={section.title} className="d-flex align-items-start gap-3 border-bottom pb-4">
                <div className="trust-icon-wrap" style={{ width: "44px", height: "44px" }}>
                  {section.icon}
                </div>
                <div>
                  <h5 className="fw-bold text-dark mb-2">{section.title}</h5>
                  <p className="text-secondary small mb-0" style={{ lineHeight: "1.7" }}>
                    {section.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-light rounded-3 mt-4 text-center">
            <p className="small text-muted mb-0">
              Have specific compliance or data inquiries? Contact our Data Privacy Officer at{" "}
              <b className="text-dark">privacy@snapcart.com</b>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
