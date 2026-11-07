import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import { useCart } from "../context/cart";
import { formatPrice, photoUrl } from "../utils/helpers";

const ProductDetails = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout title="Product not found">
        <div className="empty-state">
          <h4>Product not found</h4>
          <Link to="/">Back to shop</Link>
        </div>
      </Layout>
    );
  }

  const inStock = product.quantity > 0;

  return (
    <Layout title={product.name}>
      <div className="container mt-3">
        <div className="card-box">
          <div className="row g-4 align-items-center">
            <div className="col-md-6">
              <img src={photoUrl(product._id)} className="details-img" alt={product.name} />
            </div>

            <div className="col-md-6">
              <Link to={`/category/${product.category?.slug}`} className="text-decoration-none small">
                {product.category?.name}
              </Link>
              <h2 className="page-title mt-1">{product.name}</h2>
              <h4 className="product-price my-3">{formatPrice(product.price)}</h4>
              <p className="text-muted-soft">{product.description}</p>

              <p className={inStock ? "text-success" : "text-danger"}>
                {inStock ? `In stock (${product.quantity} left)` : "Out of stock"}
              </p>
              {product.shipping && <p className="small text-muted-soft">Free shipping available</p>}

              <button
                className="btn btn-brand px-4 py-2"
                disabled={!inStock}
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        <h4 className="page-title mt-5 mb-3">Similar Products</h4>
        {relatedProducts.length === 0 ? (
          <p className="text-muted-soft">No similar products found</p>
        ) : (
          <div className="row g-4">
            {relatedProducts.map((p) => (
              <div className="col-sm-6 col-lg-3" key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
