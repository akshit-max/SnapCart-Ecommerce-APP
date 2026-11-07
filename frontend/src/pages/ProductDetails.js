import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FiShoppingCart, 
  FiZap, 
  FiTruck, 
  FiShield, 
  FiRotateCcw, 
  FiCheckCircle, 
  FiStar,
  FiChevronRight,
  FiHeart,
  FiClock,
  FiShare2,
  FiPlus,
  FiMinus
} from "react-icons/fi";
import Layout from "../components/Layout/Layout";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import { useCart } from "../context/cart";
import { formatPrice, photoUrl } from "../utils/helpers";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/v1/product/get-product/${slug}`);
        setProduct(data.product);

        const related = await axios.get(
          `/api/v1/product/related-product/${data.product._id}/${data.product.category._id}`
        );
        setRelatedProducts(related.data.products);
      } catch (error) {
        setProduct(null);
      }
      setLoading(false);
    };
    getProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="py-5 text-center">
          <Spinner />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout title="Product not found">
        <div className="container empty-state py-5">
          <h4 className="fw-bold">Product not found</h4>
          <p className="text-muted">The product you are looking for may have been moved or removed from our catalog.</p>
          <Link to="/" className="btn btn-brand mt-2 px-4">
            Back to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  const inStock = product.quantity > 0;
  const rating = (4.5 + (product.price % 5) * 0.1).toFixed(1);
  const reviewsCount = 28 + (product.price % 95);
  const mrp = Math.round(product.price * 1.25);
  const discountPercent = Math.round(((mrp - product.price) / mrp) * 100);

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addToCart(product, quantity, false);
    navigate("/cart");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!", {
      icon: "🔗",
    });
  };

  const handleWishlist = () => {
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    if (nextState) {
      toast.success("Saved to your wishlist", { icon: "❤️" });
    } else {
      toast("Removed from your wishlist", { icon: "💔" });
    }
  };

  return (
    <Layout title={`${product.name} - SnapCart Luxury Edition`}>
      <div className="container py-3">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small fw-semibold">
            <li className="breadcrumb-item">
              <Link to="/" className="text-muted text-decoration-none">Home</Link>
            </li>
            {product.category && (
              <li className="breadcrumb-item">
                <Link to={`/category/${product.category.slug}`} className="text-muted text-decoration-none">
                  {product.category.name}
                </Link>
              </li>
            )}
            <li className="breadcrumb-item active text-dark text-truncate" style={{ maxWidth: 320 }} aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Main Product Showcase Card */}
        <div className="card-box p-4 p-lg-5 mb-5 shadow-sm">
          <div className="row g-4 g-lg-5 align-items-center">
            {/* Image Column */}
            <div className="col-lg-6">
              <div className="details-img-container position-relative">
                <img
                  src={photoUrl(product._id)}
                  className="details-img"
                  alt={product.name}
                />
                <span className={`badge-tag-stock ${inStock ? "in-stock" : "out-stock"}`}>
                  {inStock ? `● In Stock (${product.quantity} units)` : "Sold Out"}
                </span>

                {/* Quick Share & Wishlist Floating Action Bar */}
                <div className="position-absolute bottom-0 end-0 p-3 d-flex gap-2">
                  <button
                    className="btn btn-light rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center"
                    onClick={handleWishlist}
                    title="Save to Wishlist"
                    style={{ width: 42, height: 42 }}
                  >
                    <FiHeart size={18} fill={isWishlisted ? "#ef4444" : "none"} color={isWishlisted ? "#ef4444" : "#475569"} />
                  </button>
                  <button
                    className="btn btn-light rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center"
                    onClick={handleShare}
                    title="Share Link"
                    style={{ width: 42, height: 42 }}
                  >
                    <FiShare2 size={18} color="#475569" />
                  </button>
                </div>
              </div>
            </div>

            {/* Details Column */}
            <div className="col-lg-6">
              <div className="d-flex align-items-center gap-2 mb-2">
                {product.category && (
                  <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1.5 rounded-pill" style={{ fontSize: "12px" }}>
                    {product.category.name}
                  </span>
                )}
                <span className="badge bg-success-subtle text-success fw-bold px-2.5 py-1 rounded-pill" style={{ fontSize: "11px" }}>
                  <FiCheckCircle className="me-1" /> 100% Genuine
                </span>
              </div>

              <h2 className="fw-extrabold text-dark mt-2 mb-2" style={{ letterSpacing: "-0.5px" }}>
                {product.name}
              </h2>

              {/* Rating and Social Proof */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center gap-1 text-warning fw-bold">
                  <FiStar fill="#f59e0b" size={16} />
                  <span>{rating}</span>
                </div>
                <span className="text-muted small">| Based on {reviewsCount} customer reviews</span>
                <span className="text-muted small d-none d-sm-inline">| SKU: SC-{product._id.slice(-6).toUpperCase()}</span>
              </div>

              {/* Price Banner */}
              <div className="d-flex align-items-baseline gap-3 my-3 p-3 bg-light rounded-3 border">
                <h2 className="fw-extrabold text-primary mb-0">{formatPrice(product.price)}</h2>
                <span className="fs-5 text-muted text-decoration-line-through">{formatPrice(mrp)}</span>
                <span className="badge bg-success text-white fw-bold px-2 py-1">
                  Save {discountPercent}%
                </span>
              </div>

              {/* Description Story */}
              <p className="text-secondary mb-4" style={{ lineHeight: "1.7", fontSize: "14.5px" }}>
                {product.description}
              </p>

              {/* Quantity Stepper & Stock Check */}
              {inStock && (
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="small fw-bold text-dark">Quantity:</span>
                  <div className="qty-control">
                    <button
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={13} />
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => setQuantity((prev) => Math.min(product.quantity, prev + 1))}
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={13} />
                    </button>
                  </div>
                  <span className="small text-muted d-flex align-items-center gap-1">
                    <FiClock size={13} className="text-primary" /> Order now for dispatch within 24h
                  </span>
                </div>
              )}

              {/* CTA Action Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
                <button
                  className="btn btn-brand px-4 py-3 flex-grow-1 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2"
                  disabled={!inStock}
                  onClick={handleAddToCart}
                >
                  <FiShoppingCart size={19} /> Add to Cart
                </button>
                <button
                  className="btn btn-dark px-4 py-3 flex-grow-1 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2"
                  disabled={!inStock}
                  onClick={handleBuyNow}
                >
                  <FiZap size={19} /> Buy Now
                </button>
              </div>

              {/* Value Propositions Strip */}
              <div className="feature-pill-strip">
                <div className="feature-pill">
                  <FiTruck className="text-primary fs-5" />
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: "12.5px" }}>Free Express Delivery</div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>On all orders above ₹999</div>
                  </div>
                </div>
                <div className="feature-pill">
                  <FiShield className="text-primary fs-5" />
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: "12.5px" }}>Authenticity Certified</div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>Direct from brand partners</div>
                  </div>
                </div>
                <div className="feature-pill">
                  <FiRotateCcw className="text-primary fs-5" />
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: "12.5px" }}>7-Day Returns</div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>Hassle-free doorstep pickup</div>
                  </div>
                </div>
                <div className="feature-pill">
                  <FiCheckCircle className="text-primary fs-5" />
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: "12.5px" }}>Flexible Payment</div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>UPI, Cards & COD accepted</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Information Tabs */}
          <div className="mt-5 pt-4 border-top">
            <div className="d-flex gap-3 border-bottom mb-3">
              <button
                className={`btn btn-link text-decoration-none pb-2 fw-bold ${
                  activeTab === "specs" ? "text-primary border-bottom border-primary border-2" : "text-muted"
                }`}
                onClick={() => setActiveTab("specs")}
              >
                Specifications & Highlights
              </button>
              <button
                className={`btn btn-link text-decoration-none pb-2 fw-bold ${
                  activeTab === "shipping" ? "text-primary border-bottom border-primary border-2" : "text-muted"
                }`}
                onClick={() => setActiveTab("shipping")}
              >
                Shipping & Delivery SLA
              </button>
              <button
                className={`btn btn-link text-decoration-none pb-2 fw-bold ${
                  activeTab === "returns" ? "text-primary border-bottom border-primary border-2" : "text-muted"
                }`}
                onClick={() => setActiveTab("returns")}
              >
                Warranty & Returns
              </button>
            </div>

            <div className="p-3 bg-light rounded-3">
              {activeTab === "specs" && (
                <div className="small text-secondary" style={{ lineHeight: "1.8" }}>
                  <p className="mb-2"><strong>Product Title:</strong> {product.name}</p>
                  <p className="mb-2"><strong>Category:</strong> {product.category?.name || "General Catalog"}</p>
                  <p className="mb-2"><strong>Availability:</strong> {inStock ? `${product.quantity} units available in warehouse` : "Out of stock"}</p>
                  <p className="mb-0"><strong>Care / Handling:</strong> Handle with premium care. Includes genuine certificate of quality inspection.</p>
                </div>
              )}
              {activeTab === "shipping" && (
                <div className="small text-secondary" style={{ lineHeight: "1.8" }}>
                  <p className="mb-2"><strong>Dispatch SLA:</strong> All verified orders placed before 3:00 PM IST dispatch within the same business day.</p>
                  <p className="mb-2"><strong>Metro Deliveries:</strong> 24–48 hours transit time.</p>
                  <p className="mb-0"><strong>Rest of India:</strong> 3–5 business days via premium air express couriers (Bluedart, Delhivery).</p>
                </div>
              )}
              {activeTab === "returns" && (
                <div className="small text-secondary" style={{ lineHeight: "1.8" }}>
                  <p className="mb-2"><strong>Return Window:</strong> 7 days from the delivery date for any unworn, unwashed items with original tags intact.</p>
                  <p className="mb-2"><strong>Refund Processing:</strong> Online payments refunded to source within 24–48 hours upon pickup verification.</p>
                  <p className="mb-0"><strong>Cash on Delivery:</strong> Instant bank transfer / UPI payout upon reverse pickup.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products Recommendation Shelf */}
        <div className="mt-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h4 className="fw-bold text-dark mb-1">Curated Recommendations</h4>
              <p className="text-muted small mb-0">Products frequently viewed alongside this piece.</p>
            </div>
            <Link to="/" className="text-decoration-none fw-semibold small text-primary">
              View All <FiChevronRight />
            </Link>
          </div>

          {relatedProducts.length === 0 ? (
            <p className="text-muted small">Explore other curated items in our main catalog.</p>
          ) : (
            <div className="row g-4">
              {relatedProducts.slice(0, 4).map((p) => (
                <div className="col-sm-6 col-lg-3" key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
