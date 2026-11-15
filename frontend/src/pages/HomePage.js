import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import { 
  FiTruck, 
  FiShield, 
  FiZap, 
  FiRotateCcw, 
  FiRefreshCw, 
  FiSliders,
  FiX
} from "react-icons/fi";
import Layout from "../components/Layout/Layout";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import HeroBanner from "../components/HeroBanner";
import PromoBanners from "../components/PromoBanners";
import CategoryVisualRow from "../components/CategoryVisualRow";
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
    let ignore = false;

    const getProducts = async () => {
      setLoading(true);
      try {
        const params = { page, sort };
        if (checked.length) params.categories = checked.join(",");
        const range = Prices.find((p) => p._id === priceId)?.array;
        if (range) {
          params.min = range[0];
          if (range[1] !== undefined) params.max = range[1];
        }

        const { data } = await axios.get("/api/v1/product/product-list", { params });
        if (ignore) return;
        const newProducts = Array.isArray(data?.products) ? data.products : [];
        setProducts((prev) => (page === 1 ? newProducts : [...(prev || []), ...newProducts]));
        setTotal(Number(data?.total) || 0);
      } catch (error) {
        if (ignore) return;
        toast.error("Could not load products");
        if (page === 1) setProducts([]);
      }
      setLoading(false);
    };

    getProducts();
    return () => {
      ignore = true;
    };
  }, [page, checked, priceId, sort]);

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

  // Helper when clicking a visual department circle
  const handleSelectVisualCategory = (slug) => {
    const target = categories.find((c) => c.slug === slug);
    if (target) {
      setChecked([target._id]);
      setPage(1);
      const el = document.getElementById("catalog-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Find active category names for chip tags
  const activeCategoryNames = (Array.isArray(categories) ? categories : [])
    .filter((c) => checked.includes(c._id))
    .map((c) => ({ id: c._id, name: c.name }));

  const activePriceName = Prices.find((p) => p._id === priceId)?.name;

  return (
    <Layout title="SnapCart - Luxury Fashion, Tech & Lifestyle">
      <div className="container py-2">
        {/* 1. HERO CAROUSEL */}
        <HeroBanner />

        {/* 2. TRUST PILLARS BAR */}
        <div className="trust-bar">
          <div className="trust-item">
            <div className="trust-icon-wrap">
              <FiTruck />
            </div>
            <div className="trust-text">
              <h6>Free Express Shipping</h6>
              <p>On all prepaid & COD orders over ₹999</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-wrap">
              <FiShield />
            </div>
            <div className="trust-text">
              <h6>100% Secure Checkout</h6>
              <p>Razorpay 256-Bit SSL & Instant UPI</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-wrap">
              <FiZap />
            </div>
            <div className="trust-text">
              <h6>Same-Day Dispatch</h6>
              <p>Fast warehouse processing within 24h</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-wrap">
              <FiRotateCcw />
            </div>
            <div className="trust-text">
              <h6>7-Day Easy Returns</h6>
              <p>Doorstep pickup with zero questions</p>
            </div>
          </div>
        </div>

        {/* 3. VISUAL DEPARTMENTS ROW */}
        <CategoryVisualRow onSelectCategory={handleSelectVisualCategory} />

        {/* 4. CURATED PROMOTIONAL BANNERS */}
        <PromoBanners />

        {/* 5. MAIN PRODUCT CATALOG */}
        <div className="row g-4" id="catalog-section">
          {/* Left Sidebar Filters */}
          <div className="col-lg-3">
            <div className="card-box filters-box">
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <FiSliders className="text-primary" /> Filter Products
                </h6>
                {(checked.length > 0 || priceId !== null) && (
                  <button
                    className="btn btn-link btn-sm text-decoration-none p-0 text-danger fw-bold"
                    onClick={resetFilters}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <p className="filter-heading mb-2">Departments</p>
              <div className="d-flex flex-column gap-2 mb-4">
                {categories.map((c) => (
                  <Checkbox
                    key={c._id}
                    checked={checked.includes(c._id)}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                    className="fw-medium text-secondary"
                  >
                    {c.name}
                  </Checkbox>
                ))}
              </div>

              {/* Price Brackets */}
              <p className="filter-heading mb-2">Price Range</p>
              <Radio.Group
                value={priceId}
                onChange={(e) => handlePrice(e.target.value)}
                className="d-flex flex-column gap-2 mb-4"
              >
                {Prices.map((p) => (
                  <Radio key={p._id} value={p._id} className="fw-medium text-secondary">
                    {p.name}
                  </Radio>
                ))}
              </Radio.Group>

              <button
                className="btn btn-outline-custom w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={resetFilters}
              >
                <FiRefreshCw size={14} /> Reset Filters
              </button>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="col-lg-9">
            {/* Header / Active Chips / Sort */}
            <div className="bg-white p-3 rounded-3 border mb-3">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <h5 className="fw-bold text-dark mb-0">
                    Curated Collection{" "}
                    <span className="text-muted fw-normal fs-6">({total} items)</span>
                  </h5>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted fw-semibold d-none d-sm-inline">Sort by:</span>
                  <select
                    className="form-select form-select-sm w-auto fw-semibold"
                    value={sort}
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="newest">⚡ Newest Arrivals</option>
                    <option value="price-asc">💵 Price: Low to High</option>
                    <option value="price-desc">💎 Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Chips */}
              {(activeCategoryNames.length > 0 || activePriceName) && (
                <div className="d-flex flex-wrap align-items-center gap-2 mt-3 pt-2 border-top">
                  <span className="small text-muted fw-semibold">Active:</span>
                  {activeCategoryNames.map((c) => (
                    <span key={c.id} className="filter-chip">
                      {c.name}{" "}
                      <FiX
                        className="chip-remove"
                        onClick={() => handleFilter(false, c.id)}
                      />
                    </span>
                  ))}
                  {activePriceName && (
                    <span className="filter-chip">
                      {activePriceName}{" "}
                      <FiX
                        className="chip-remove"
                        onClick={() => setPriceId(null)}
                      />
                    </span>
                  )}
                  <button
                    className="btn btn-link btn-sm text-muted p-0 text-decoration-none small ms-1"
                    onClick={resetFilters}
                  >
                    Reset all
                  </button>
                </div>
              )}
            </div>

            {/* Empty State */}
            {!loading && (products?.length || 0) === 0 && (
              <div className="card-box text-center py-5">
                <div className="fs-1 mb-2">🔍</div>
                <h5 className="fw-bold text-dark">No Products Matched Your Selection</h5>
                <p className="text-muted small">
                  Try broadening your category filters or adjusting the price range.
                </p>
                <button className="btn btn-brand btn-sm mt-2" onClick={resetFilters}>
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Product Cards Grid */}
            <div className="row g-4">
              {(products || []).map((p) => (
                <div className="col-sm-6 col-xl-4" key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {loading && <Spinner />}

            {/* Load More Pagination */}
            {!loading && (products?.length || 0) < total && (
              <div className="text-center mt-5">
                <button
                  className="btn btn-outline-custom px-4 py-2 shadow-sm fw-bold"
                  onClick={() => setPage(page + 1)}
                >
                  Load More Products ({products?.length || 0} of {total})
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
