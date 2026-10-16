import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";

const PageNotFound = () => {
  return (
    <Layout title="Page Not Found">
      <div className="auth-wrapper">
        <div className="card-box auth-card">
          <div className="not-found-code">404</div>
          <h5 className="fw-semibold">Page not found</h5>
          <p className="text-muted-soft">The page you are looking for doesn't exist or was moved.</p>
          <Link to="/" className="btn btn-brand px-4">
            Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default PageNotFound;
