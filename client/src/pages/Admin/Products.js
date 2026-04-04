import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title={"All Products"}>
      <style>{`
        .products-wrapper {
          padding: 30px;
        }

        .products-title {
          font-weight: 600;
          color: #1e293b;
        }

        .product-card {
          border-radius: 16px;
          border: 1px solid #e6efff;
          background: #ffffff;
          overflow: hidden;
          transition: all 0.25s ease;
          height: 100%;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.15);
        }

        .product-img {
          height: 260px;
          object-fit: cover;
          width: 100%;
          object-position:top;
        }

        .product-body {
          padding: 15px;
        }

        .product-name {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 5px;
        }

        .product-desc {
          font-size: 13px;
          color: #64748b;
        }

        .product-link {
          text-decoration: none;
        }
      `}</style>

      <div className="container-fluid products-wrapper">
        <div className="row">
          {/* SIDEBAR */}
          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* MAIN */}
          <div className="col-md-9">
            <h4 className="products-title mb-4">All Products</h4>

            <div className="row">
              {products?.map((p) => (
                <div className="col-md-4 col-sm-6 mb-4" key={p._id}>
                  <Link
                    to={`/dashboard/admin/product/${p.slug}`}
                    className="product-link"
                  >
                    <div className="product-card">
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                        className="product-img"
                      />

                      <div className="product-body">
                        <div className="product-name">{p.name}</div>

                        <div className="product-desc">
                          {p.description.substring(0, 60)}...
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
