import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiEye, FiStar, FiHeart, FiTruck } from "react-icons/fi";
import { useCart } from "../context/cart";
import { formatPrice, photoUrl, FALLBACK_IMAGE } from "../utils/helpers";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const outOfStock = product.quantity < 1;
  const openDetails = () => navigate(`/product/${product.slug}`);

  // Deterministic realistic rating & MRP calculation for authentic storefront feel
  const rating = (4.3 + (product.price % 7) * 0.1).toFixed(1);
  const reviewsCount = 18 + (product.price % 83);
  const mrp = Math.round(product.price * 1.25);
  const discountPercent = Math.round(((mrp - product.price) / mrp) * 100);
  const isFreeDelivery = product.price >= 999 || Boolean(product.shipping);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    if (nextState) {
      toast.success(`Saved to your wishlist`, {
        icon: "❤️",
      });
    } else {
      toast("Removed from your wishlist", {
        icon: "💔",
      });
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product);
  };

  return (
    <div className="product-card" onClick={openDetails}>
      <div className="product-card-img">
        <img
          src={photoUrl(product)}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        {/* Floating Wishlist Button */}
        <button
          className={`card-wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title={isWishlisted ? "In Wishlist" : "Save to Wishlist"}
        >
          <FiHeart size={16} fill={isWishlisted ? "#ef4444" : "none"} color={isWishlisted ? "#ef4444" : "#475569"} />
        </button>

        {/* Floating Stock Badge */}
        <span className={`badge-tag-stock ${outOfStock ? "out-stock" : "in-stock"}`}>
          {outOfStock ? "Sold Out" : "In Stock"}
        </span>

        {/* Category tag */}
        {product.category?.name && (
          <span className="badge-tag-category">{product.category.name}</span>
        )}
      </div>

      <div className="product-card-body">
        {/* Rating & Badge Row */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="product-rating-row mb-0">
            <div className="d-flex align-items-center gap-1 text-warning">
              <FiStar fill="#f59e0b" size={13} />
              <span>{rating}</span>
            </div>
            <span className="text-muted" style={{ fontSize: "11px" }}>
              ({reviewsCount})
            </span>
          </div>

          {isFreeDelivery && (
            <span className="text-success fw-bold d-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
              <FiTruck size={12} /> Free Shipping
            </span>
          )}
        </div>

        {/* Product Name */}
        <h6 className="product-name" title={product.name}>
          {product.name}
        </h6>

        {/* Description snippet */}
        <p className="product-desc">{product.description}</p>

        {/* Price & Discount */}
        <div className="price-container">
          <span className="product-price">{formatPrice(product.price)}</span>
          <span className="product-price-mrp">{formatPrice(mrp)}</span>
          <span className="discount-badge">{discountPercent}% OFF</span>
        </div>

        {/* Actions Row */}
        <div className="card-actions-row mt-auto">
          <button
            className="btn btn-outline-custom btn-sm w-50 d-flex align-items-center justify-content-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              openDetails();
            }}
          >
            <FiEye size={14} /> Details
          </button>
          <button
            className="btn btn-brand btn-sm w-50 d-flex align-items-center justify-content-center gap-1"
            disabled={outOfStock}
            onClick={handleAddToCart}
          >
            <FiShoppingCart size={14} /> {outOfStock ? "Sold Out" : "Add to Bag"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
