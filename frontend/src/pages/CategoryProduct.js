import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FiGrid } from "react-icons/fi";
import Layout from "../components/Layout/Layout";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

const CategoryProduct = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/v1/product/product-category/${slug}`)
      .then(({ data }) => {
        setProducts(data.products);
        setCategory(data.category);
      })
      .catch(() => {
        setProducts([]);
        setCategory(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <Layout title={`${category?.name || "Category"} - SnapCart`}>
      <div className="container py-3">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small fw-semibold">
            <li className="breadcrumb-item">
              <Link to="/" className="text-muted text-decoration-none">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/categories" className="text-muted text-decoration-none">Categories</Link>
            </li>
            <li className="breadcrumb-item active text-dark" aria-current="page">
              {category?.name || slug}
            </li>
          </ol>
        </nav>

        {loading ? (
          <div className="py-5">
            <Spinner />
          </div>
        ) : !category ? (
          <div className="card-box text-center py-5">
            <h4 className="fw-bold">Category Not Found</h4>
            <p className="text-muted small">We couldn't find the requested category.</p>
            <Link to="/categories" className="btn btn-brand btn-sm">
              View All Categories
            </Link>
          </div>
        ) : (
          <>
            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
              <div>
                <h3 className="fw-bold text-dark mb-1">{category.name}</h3>
                <p className="text-muted small mb-0">Showing {products.length} products in this collection</p>
              </div>
              <Link to="/" className="btn btn-outline-custom btn-sm">
                <FiGrid className="me-1" /> All Products
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="card-box text-center py-5">
                <p className="text-muted">No products found in this category yet.</p>
                <Link to="/" className="btn btn-brand btn-sm">Continue Shopping</Link>
              </div>
            ) : (
              <div className="row g-4">
                {products.map((p) => (
                  <div className="col-sm-6 col-lg-4 col-xl-3" key={p._id}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
