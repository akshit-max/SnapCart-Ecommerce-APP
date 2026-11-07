import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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
        { label: "Revenue", value: formatPrice(data.stats.revenue) },
        { label: "Orders", value: data.stats.orders },
        { label: "Products", value: data.stats.products },
        { label: "Users", value: data.stats.users },
      ]
    : [];

  return (
    <DashboardLayout title="Admin Dashboard" admin>
      <h4 className="page-title">Welcome, {auth?.user?.name}</h4>
      <p className="text-muted-soft">Here's how the store is doing.</p>

      {!data ? (
        <Spinner />
      ) : (
        <>
          <div className="row g-3 mb-4">
            {cards.map((card) => (
              <div className="col-6 col-lg-3" key={card.label}>
                <div className="card-box stat-card">
                  <div className="small text-muted-soft">{card.label}</div>
                  <div className="stat-value">{card.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card-box">
            <h6 className="fw-semibold mb-3">Low stock (5 or less)</h6>
            {data.lowStock.length === 0 ? (
              <p className="text-muted-soft mb-0">All products are well stocked.</p>
            ) : (
              data.lowStock.map((p) => (
                <div key={p._id} className="d-flex justify-content-between border-top py-2">
                  <Link to={`/dashboard/admin/product/${p.slug}`}>{p.name}</Link>
                  <span className="text-danger fw-semibold">{p.quantity} left</span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
