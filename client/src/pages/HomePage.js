import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getAllCategory = async () => {
    const { data } = await axios.get("/api/v1/category/get-category");
    if (data?.success) setCategories(data.category);
  };

  const getTotal = async () => {
    const { data } = await axios.get("/api/v1/product/product-count");
    setTotal(data.total);
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  const getAllProducts = async () => {
    setLoading(true);
    const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
    setProducts(data.products);
    setLoading(false);
  };

  const filterProduct = async () => {
    const { data } = await axios.post("/api/v1/product/product-filters", {
      checked,
      radio,
    });
    setProducts(data.products);
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  const loadMore = async () => {
    setLoading(true);
    const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
    setProducts([...products, ...data.products]);
    setLoading(false);
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const handleFilter = (value, id) => {
    let all = [...checked];
    value ? all.push(id) : (all = all.filter((c) => c !== id));
    setChecked(all);
  };

  return (
    <Layout title="All Products">
      {/* GLOBAL STYLE */}
      <style>{`
        .card:hover img {
          transform: scale(1.05);
        }
        .card:hover {
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
        }
        .filters-sticky {
          position: sticky;
          top: 80px;
        }
        .filter-item:hover {
          background: #f8fafc;
        }
      `}</style>

      <div className="container-fluid px-4 mt-4">
        {/* Banner */}
        <div className="mb-4 rounded-4 overflow-hidden shadow-sm ">
          <img
            src="ba.jpeg"
            alt="banner"
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              borderRadius: "16px",
              objectPosition: "center",
            }}
          />
        </div>

        <div className="row">
          {/* FILTERS */}
          <div className="col-md-3 mb-4">
            <div className="filters-sticky">
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "14px",
                  padding: "20px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                  border: "1px solid #f1f5f9",
                }}
              >
                <h5 className="fw-semibold mb-3">Filters</h5>

                {/* CATEGORY */}
                <p className="text-muted small fw-semibold">CATEGORY</p>
                <div className="d-flex flex-column gap-2 mb-3">
                  {categories?.map((c) => (
                    <label key={c._id} className="filter-item p-1 rounded">
                      <Checkbox
                        onChange={(e) => handleFilter(e.target.checked, c._id)}
                      >
                        {c.name}
                      </Checkbox>
                    </label>
                  ))}
                </div>

                {/* PRICE */}
                <p className="text-muted small fw-semibold mt-3">PRICE</p>
                <Radio.Group
                  onChange={(e) => setRadio(e.target.value)}
                  className="d-flex flex-column gap-2"
                >
                  {Prices?.map((p) => (
                    <Radio key={p._id} value={p.array}>
                      {p.name}
                    </Radio>
                  ))}
                </Radio.Group>

                {/* RESET */}
                <button
                  className="btn btn-dark w-100 mt-3"
                  onClick={() => window.location.reload()}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="col-md-9">
            {/* TOP BAR */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-semibold">All Products ({products.length})</h5>

              <select className="form-select w-auto">
                <option>Sort by</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>

            {/* PRODUCT GRID */}
            <div className="row g-4">
              {products?.map((p) => (
                <div className="col-sm-6 col-md-4" key={p._id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                    {/* IMAGE */}
                    <div
                      style={{
                        height: "300px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "top",
                        }}
                      />
                    </div>

                    {/* BODY */}
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between mb-2">
                        <h6 className="fw-semibold mb-0">{p.name}</h6>
                        <span className="text-primary fw-bold">${p.price}</span>
                      </div>

                      <p className="text-muted small mb-3">
                        {p.description.substring(0, 60)}...
                      </p>

                      <div className="d-flex gap-2 mt-auto">
                        <button
                          className="btn btn-outline-dark btn-sm w-50"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          Details
                        </button>

                        <button
                          className="btn btn-dark btn-sm w-50"
                          onClick={() => {
                            setCart([...cart, p]);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify([...cart, p]),
                            );
                            toast.success("Added to cart");
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* LOAD MORE */}
            <div className="text-center mt-4">
              {products && products.length < total && (
                <button
                  className="btn btn-dark px-4"
                  onClick={() => setPage(page + 1)}
                >
                  {loading ? (
                    "Loading..."
                  ) : (
                    <>
                      Load More <AiOutlineReload />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
