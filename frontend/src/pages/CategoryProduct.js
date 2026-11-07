import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
    <Layout title={category?.name || "Category"}>
      <div className="container mt-3">
        {loading ? (
          <Spinner />
        ) : !category ? (
          <div className="empty-state">Category not found</div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="page-title mb-0">{category.name}</h3>
              <p className="text-muted-soft">{products.length} product(s)</p>
            </div>

            {products.length === 0 && (
              <div className="empty-state">No products in this category yet.</div>
            )}

            <div className="row g-4">
              {products.map((p) => (
                <div className="col-sm-6 col-lg-3" key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
