import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { FiSearch, FiGrid } from "react-icons/fi";
import Layout from "../components/Layout/Layout";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

const Search = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword) return;
    setLoading(true);
    axios
      .get(`/api/v1/product/search/${encodeURIComponent(keyword)}`)
      .then(({ data }) => setResults(data.products))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [keyword]);

  return (
    <Layout title={`Search: "${keyword}" - SnapCart`}>
      <div className="container py-3">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small fw-semibold">
            <li className="breadcrumb-item">
              <Link to="/" className="text-muted text-decoration-none">Home</Link>
            </li>
            <li className="breadcrumb-item active text-dark" aria-current="page">
              Search Results
            </li>
          </ol>
        </nav>

        <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
          <div>
            <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
              <FiSearch className="text-primary" /> Search Results for "{keyword}"
            </h4>
            <p className="text-muted small mb-0">
              {loading ? "Searching catalog..." : `Found ${results.length} matching product(s)`}
            </p>
          </div>
          <Link to="/" className="btn btn-outline-custom btn-sm">
            <FiGrid className="me-1" /> All Products
          </Link>
        </div>

        {loading ? (
          <div className="py-5">
            <Spinner />
          </div>
        ) : results.length === 0 ? (
          <div className="card-box text-center py-5">
            <div className="fs-1 mb-2">🔍</div>
            <h5 className="fw-bold text-dark">No Products Matched Your Search</h5>
            <p className="text-muted small">
              Try searching with a broader keyword (e.g., "shoes", "jacket", "headphones").
            </p>
            <Link to="/" className="btn btn-brand btn-sm mt-2">Browse All Products</Link>
          </div>
        ) : (
          <div className="row g-4">
            {results.map((p) => (
              <div className="col-sm-6 col-lg-4 col-xl-3" key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
