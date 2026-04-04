import React from 'react';
import Layout from '../components/Layout/Layout';
import {
  FaLock,
  FaUserShield,
  FaChartBar,
  FaCookieBite,
  FaTools,
  FaEnvelope,
  FaPhoneAlt
} from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <Layout title="Privacy Policy - SnapCart">

      {/* STYLE */}
      <style>{`
        .policy-wrapper {
          background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
          padding: 60px 20px;
        }

        .policy-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 35px;
          box-shadow: 0 15px 40px rgba(0, 102, 255, 0.08);
          border: 1px solid #e6efff;
        }

        .policy-title {
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-text {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
        }

        .contact-box {
          background: #f1f5ff;
          border-radius: 12px;
          padding: 15px;
          margin-top: 10px;
        }

        .icon {
          color: #2563eb;
        }
      `}</style>

      <div className="policy-wrapper">
        <div className="container d-flex justify-content-center">
          <div className="col-md-10 col-lg-8 policy-card">

            <h1 className="text-center policy-title">
              🔒 Privacy Policy
            </h1>

            {/* INTRO */}
            <section className="mb-4">
              <div className="section-title">
                <FaUserShield className="icon" /> Introduction
              </div>
              <p className="section-text">
                At <strong>SnapCart</strong>, your privacy is our priority. This Privacy Policy explains how we collect, use, and protect your personal data when you interact with our services.
              </p>
            </section>

            {/* INFO */}
            <section className="mb-4">
              <div className="section-title">
                <FaUserShield className="icon" /> Information We Collect
              </div>
              <p className="section-text">
                We may collect personal details such as your name, email, phone number, and payment information. Additionally, we gather non-personal data like your IP address and browser behavior to improve our services.
              </p>
            </section>

            {/* USE */}
            <section className="mb-4">
              <div className="section-title">
                <FaChartBar className="icon" /> How We Use Your Information
              </div>
              <p className="section-text">
                Your data helps us complete transactions, support your account, provide personalized experiences, and send updates or offers. We do not sell your data.
              </p>
            </section>

            {/* SECURITY */}
            <section className="mb-4">
              <div className="section-title">
                <FaLock className="icon" /> Data Security
              </div>
              <p className="section-text">
                We implement strong security measures like encryption and HTTPS. While we strive for top security, no system is 100% immune from breaches.
              </p>
            </section>

            {/* COOKIES */}
            <section className="mb-4">
              <div className="section-title">
                <FaCookieBite className="icon" /> Cookies & Tracking
              </div>
              <p className="section-text">
                Cookies help us offer a smooth experience by remembering preferences and analyzing traffic. You can modify cookie settings in your browser at any time.
              </p>
            </section>

            {/* THIRD PARTY */}
            <section className="mb-4">
              <div className="section-title">
                <FaTools className="icon" /> Third-Party Services
              </div>
              <p className="section-text">
                Trusted third-party services like payment gateways or analytics tools may process data on our behalf—but only for essential functions and always securely.
              </p>
            </section>

            {/* UPDATES */}
            <section className="mb-4">
              <div className="section-title">
                <FaChartBar className="icon" /> Policy Updates
              </div>
              <p className="section-text">
                This policy may change occasionally. Updates will be reflected here along with the revision date. Stay informed by reviewing this page periodically.
              </p>
            </section>

            {/* CONTACT */}
            <section className="mb-4">
              <div className="section-title">
                <FaEnvelope className="icon" /> Contact Us
              </div>

              <div className="contact-box">
                <p className="section-text mb-1">
                  <FaEnvelope className="me-2 icon" />
                  <strong>Email:</strong> support@snapcart.com
                </p>

                <p className="section-text mb-0">
                  <FaPhoneAlt className="me-2 icon" />
                  <strong>Phone:</strong> +91 9876543210
                </p>
              </div>
            </section>

            <div className="text-end text-muted mt-3">
              <small>Last Updated: July 21, 2025</small>
            </div>

          </div>
        </div>
      </div>

    </Layout>
  );
};

export default PrivacyPolicy;