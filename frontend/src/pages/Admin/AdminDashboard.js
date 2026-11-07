import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiDollarSign, FiShoppingBag, FiBox, FiUsers, FiAlertTriangle, FiArrowRight } from "react-icons/fi";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../context/auth";
import { formatPrice } from "../../utils/helpers";

const AdminDashboard = () => {
  const [auth] = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("/api/v1/order/stats")
      .then(({ data }) => setData(data))
      .catch((error) => console.log(error));
  }, []);

  const cards = data
    ? [
        { label: "Total Revenue", value: formatPrice(data.stats.revenue), icon: <FiDollarSign />, color: "text-success", bg: "bg-success-subtle" },
        { label: "Total Orders", value: data.stats.orders, icon: <FiShoppingBag />, color: "text-primary", bg: "bg-primary-subtle" },
        { label: "Active Products", value: data.stats.products, icon: <FiBox />, color: "text-warning", bg: "bg-warning-subtle" },
        { label: "Registered Users", value: data.stats.users, icon: <FiUsers />, color: "text-info", bg: "bg-info-subtle" },
      ]
    : [];

  return (
    <DashboardLayout title="Admin Command Center - SnapCart" admin>
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Welcome back, {auth?.user?.name}</h4>
          <p className="text-muted small mb-0">Store performance summary, orders, and real-time inventory.</p>
        </div>
        <Link to="/dashboard/admin/create-product" className="btn btn-brand btn-sm">
          + Add New Product
        </Link>
      </div>

      {!data ? (
        <div className="py-5">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            {cards.map((card) => (
              <div className="col-sm-6 col-xl-3" key={card.label}>
                <div className="card-box p-3 h-100">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="small text-muted fw-bold">{card.label}</span>
                    <div className={`p-2 rounded-3 ${card.bg} ${card.color} fs-5`}>
                      {card.icon}
                    </div>
                  </div>
                  <div className="fs-3 fw-extrabold text-dark">{card.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card-box p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <FiAlertTriangle className="text-warning" /> Low Stock Alerts (5 or fewer units)
              </h6>
              <Link to="/dashboard/admin/products" className="small fw-semibold text-primary text-decoration-none">
                Manage Stock <FiArrowRight />
              </Link>
            </div>

            {data.lowStock.length === 0 ? (
              <div className="p-3 bg-light rounded-3 text-center text-muted small">
                ✓ All products in your inventory have healthy stock levels.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th>Product Name</th>
                      <th>Current Units</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.lowStock.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <Link to={`/dashboard/admin/product/${p.slug}`} className="fw-semibold text-dark text-decoration-none">
                            {p.name}
                          </Link>
                        </td>
                        <td>
                          <span className="badge bg-danger-subtle text-danger fw-bold px-2 py-1">
                            {p.quantity} units left
                          </span>
                        </td>
                        <td>
                          <Link to={`/dashboard/admin/product/${p.slug}`} className="btn btn-outline-custom btn-sm py-1 px-2">
                            Restock
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
