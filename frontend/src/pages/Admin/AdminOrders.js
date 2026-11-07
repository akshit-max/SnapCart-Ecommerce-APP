import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import OrderCard from "../../components/OrderCard";
import Spinner from "../../components/Spinner";
import { getErrorMessage } from "../../utils/helpers";

// same list as ORDER_STATUS in the backend order model
const STATUS_LIST = ["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/v1/order/all-orders")
      .then(({ data }) => setOrders(data.orders))
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    if (status === "Cancelled" && !window.confirm("Cancel this order? Stock will be added back and online payments refunded.")) return;
    try {
      const { data } = await axios.put(`/api/v1/order/status/${orderId}`, { status });
      // keep the populated buyer, take the new status and payment (it may be refunded now)
      setOrders(
        orders.map((o) =>
          o._id === orderId ? { ...o, status: data.order.status, payment: data.order.payment } : o
        )
      );
      toast.success("Status updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const visibleOrders = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <DashboardLayout title="Orders" admin>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="page-title mb-0">Orders ({visibleOrders.length})</h4>
        <select className="form-select w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All orders</option>
          {STATUS_LIST.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading && <Spinner />}
      {!loading && visibleOrders.length === 0 && <div className="card-box empty-state">No orders here.</div>}

      {visibleOrders.map((order) => (
        <OrderCard order={order} showBuyer key={order._id}>
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted-soft">Update status:</span>
            <select
              className="form-select form-select-sm w-auto"
              value={order.status}
              disabled={order.status === "Cancelled"}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
            >
              {STATUS_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </OrderCard>
      ))}
    </DashboardLayout>
  );
};

export default AdminOrders;
