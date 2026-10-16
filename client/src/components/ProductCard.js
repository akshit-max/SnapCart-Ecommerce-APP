import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { formatPrice, photoUrl } from "../utils/helpers";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const outOfStock = product.quantity < 1;
  const openDetails = () => navigate(`/product/${product.slug}`);

  return (
    <div className="product-card">
      <div className="product-card-img" onClick={openDetails}>
        <img src={photoUrl(product._id)} alt={product.name} loading="lazy" />
        {outOfStock && <span className="stock-tag">Out of stock</span>}
      </div>

      <div className="product-card-body">
        <div className="d-flex justify-content-between gap-2">
          <h6 className="product-name">{product.name}</h6>
          <span className="product-price">{formatPrice(product.price)}</span>
        </div>
        <p className="product-desc">{product.description?.substring(0, 60)}...</p>

        <div className="d-flex gap-2 mt-auto">
          <button className="btn btn-outline-dark btn-sm w-50" onClick={openDetails}>
            Details
          </button>
          <button
            className="btn btn-brand btn-sm w-50"
            disabled={outOfStock}
            onClick={() => addToCart(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
