import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import Layout from "./../components/Layout/Layout";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import { Prices } from "../components/Prices";
import useCategory from "../hooks/useCategory";

const HomePage = () => {
  const categories = useCategory();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // filters
  const [checked, setChecked] = useState([]);
  const [priceId, setPriceId] = useState(null);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    // ignore old responses if filters change before the request finishes
    let ignore = false;

    const getProducts = async () => {
      setLoading(true);
      try {
        const params = { page, sort };
        if (checked.length) params.categories = checked.join(",");
        const range = Prices.find((p) => p._id === priceId)?.array;
        if (range) {
          params.min = range[0];
          params.max = range[1];
        }

        const { data } = await axios.get("/api/v1/product/product-list", { params });
        if (ignore) return;
        // page 1 replaces the list, next pages are added below ("load more")
        setProducts((prev) => (page === 1 ? data.products : [...prev, ...data.products]));
        setTotal(data.total);
      } catch (error) {
        toast.error("Could not load products");
      }
      setLoading(false);
    };
    getProducts();
    return () => {
      ignore = true;
    };
  }, [page, checked, priceId, sort]);

  // any filter change starts again from page 1
  const handleFilter = (value, id) => {
    setChecked(value ? [...checked, id] : checked.filter((c) => c !== id));
    setPage(1);
  };

  const handlePrice = (id) => {
    setPriceId(id);
    setPage(1);
  };

  const handleSort = (value) => {
    setSort(value);
    setPage(1);
  };

  const resetFilters = () => {
    setChecked([]);
    setPriceId(null);
    setSort("newest");
    setPage(1);
  };

  return (
    <Layout title="All Products">
      <div className="container mt-3">
        <img src="/ba.jpeg" alt="SnapCart sale banner" className="hero-banner mb-4 shadow-sm" />

        <div className="row g-4">
          {/* filters */}
          <div className="col-md-3">
            <div className="card-box filters-box">
              <h6 className="fw-semibold mb-3">Filters</h6>

              <p className="filter-label mb-2">CATEGORY</p>
              <div className="d-flex flex-column gap-1 mb-3">
                {categories.map((c) => (
                  <Checkbox
                    key={c._id}
                    checked={checked.includes(c._id)}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                  >
                    {c.name}
                  </Checkbox>
                ))}
              </div>

              <p className="filter-label mb-2">PRICE</p>
              <Radio.Group
                value={priceId}
                onChange={(e) => handlePrice(e.target.value)}
                className="d-flex flex-column gap-1"
              >
                {Prices.map((p) => (
                  <Radio key={p._id} value={p._id}>
                    {p.name}
                  </Radio>
                ))}
              </Radio.Group>

              <button className="btn btn-outline-dark w-100 mt-3" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          </div>

          {/* products */}
          <div className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="page-title mb-0">
                All Products <span className="text-muted-soft fs-6">({total})</span>
              </h5>
              <select
                className="form-select w-auto"
                value={sort}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {!loading && products.length === 0 && (
              <div className="empty-state">No products match these filters.</div>
            )}

            <div className="row g-4">
              {products.map((p) => (
                <div className="col-sm-6 col-lg-4" key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {loading && <Spinner />}

            {!loading && products.length < total && (
              <div className="text-center mt-4">
                <button className="btn btn-dark px-4" onClick={() => setPage(page + 1)}>
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
