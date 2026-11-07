import { Link } from "react-router-dom";
import { FiCompass, FiHome, FiShoppingBag } from "react-icons/fi";
import Layout from "../components/Layout/Layout";

const PageNotFound = () => {
  return (
    <Layout title="Page Not Found - SnapCart">
      <div className="auth-wrapper">
        <div className="auth-card" style={{ maxWidth: 460 }}>
          <div className="auth-icon-wrap" style={{ background: "#fef2f2", color: "#ef4444" }}>
            <FiCompass />
          </div>
          <div className="not-found-code">404</div>
          <h4 className="fw-extrabold text-dark mb-2">Page Not Found</h4>
          <p className="text-muted small mb-4">
            The page or catalog collection you are looking for doesn't exist, was removed, or had its address updated.
          </p>
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
            <Link to="/" className="btn btn-brand px-4">
              <FiHome className="me-1" /> Back to Home
            </Link>
            <Link to="/categories" className="btn btn-outline-custom px-4">
              <FiShoppingBag className="me-1" /> Browse Categories
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PageNotFound;
