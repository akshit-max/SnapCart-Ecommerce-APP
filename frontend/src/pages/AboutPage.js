import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";

const AboutPage = () => {
  return (
    <Layout title="About Us">
      <div className="container content-page">
        <div className="card-box">
          <h2 className="page-title">
            About <span className="text-primary">SnapCart</span>
          </h2>
          <p className="text-muted-soft mb-4">Fashion for the whole family, delivered to your door.</p>

          <p>
            SnapCart is an online clothing store with collections for men, women and kids. We started
            with a simple idea: shopping online should be quick, safe and easy to trust.
          </p>
          <p>
            Every product shows real stock, prices are always confirmed by our server at checkout, and
            you can pay online with Razorpay or choose cash on delivery. You can track every order
            from your dashboard and cancel it any time before we start packing.
          </p>
          <p className="mb-4">
            Have a question or feedback? We would love to hear from you.
          </p>

          <Link to="/contact" className="btn btn-brand px-4">
            Contact Us
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
