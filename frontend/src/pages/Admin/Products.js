import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiPlus, FiSearch, FiEdit2, FiExternalLink, FiAlertCircle } from "react-icons/fi";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import Spinner from "../../components/Spinner";
import { formatPrice, photoUrl, FALLBACK_IMAGE } from "../../utils/helpers";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/v1/product/get-product")
      .then(({ data }) => setProducts(Array.isArray(data?.products) ? data.products : []))
      .catch(() => toast.error("Could not load products"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = (products || []).filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Product Inventory - SnapCart" admin>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Product Inventory ({products?.length || 0})</h4>
          <p className="text-muted small mb-0">Manage all items, pricing, stock levels, and store visibility.</p>
        </div>
        <Link to="/dashboard/admin/create-product" className="btn btn-brand btn-sm">
          <FiPlus className="me-1" /> Add New Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="card-box p-3 mb-4">
        <div className="position-relative">
          <FiSearch
            className="position-absolute text-muted"
            style={{ left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}
          />
          <input
            type="text"
            className="form-control ps-5"
            placeholder="Search by product name or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-5">
          <Spinner />
        </div>
      ) : (
        <div className="card-box p-0 table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Inventory</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted small">
                    No products matched your search.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={photoUrl(p)}
                          alt={p.name}
                          width={48}
                          height={48}
                          className="rounded-3 border"
                          style={{ objectFit: "cover" }}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_IMAGE;
                          }}
                        />
                        <div>
                          <div className="fw-bold text-dark">{p.name}</div>
                          <span className="small text-muted font-monospace" style={{ fontSize: "11px" }}>
                            /{p.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border fw-medium px-2 py-1">
                        {p.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td>
                      <span className="fw-bold text-dark">{formatPrice(p.price)}</span>
                    </td>
                    <td>
                      {p.quantity <= 5 ? (
                        <span className="badge bg-danger-subtle text-danger fw-bold px-2 py-1 d-inline-flex align-items-center gap-1">
                          <FiAlertCircle size={12} /> {p.quantity} low
                        </span>
                      ) : (
                        <span className="badge bg-success-subtle text-success fw-bold px-2 py-1">
                          {p.quantity} in stock
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Link
                          to={`/product/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-custom"
                          title="View on Storefront"
                        >
                          <FiExternalLink />
                        </Link>
                        <Link
                          to={`/dashboard/admin/product/${p.slug}`}
                          className="btn btn-sm btn-brand"
                          title="Edit Product"
                        >
                          <FiEdit2 className="me-1" /> Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Products;
