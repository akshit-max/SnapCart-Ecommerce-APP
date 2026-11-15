import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiShoppingBag, FiFilter, FiCheckCircle } from "react-icons/fi";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import OrderCard from "../../components/OrderCard";
import ConfirmModal from "../../components/ConfirmModal";
import Spinner from "../../components/Spinner";
import { getErrorMessage } from "../../utils/helpers";

const STATUS_LIST = ["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [pendingCancel, setPendingCancel] = useState(null); // { orderId, status }

  useEffect(() => {
    axios
      .get("/api/v1/order/all-orders")
      .then(({ data }) => setOrders(Array.isArray(data?.orders) ? data.orders : []))
      .catch((error) => {
        toast.error(getErrorMessage(error));
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const executeStatusChange = async (orderId, status) => {
    try {
      const { data } = await axios.put(`/api/v1/order/status/${orderId}`, { status });
      setOrders(
        orders.map((o) =>
          o._id === orderId ? { ...o, status: data.order.status, payment: data.order.payment } : o
        )
      );
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleStatusChange = (orderId, status) => {
    if (status === "Cancelled") {
      setPendingCancel({ orderId, status });
      return;
    }
    executeStatusChange(orderId, status);
  };

  const handleConfirmCancel = () => {
    if (pendingCancel) {
      executeStatusChange(pendingCancel.orderId, pendingCancel.status);
      setPendingCancel(null);
    }
  };

  const visibleOrders = filter === "All" ? (orders || []) : (orders || []).filter((o) => o.status === filter);

  const pendingCount = (orders || []).filter((o) => o.status === "Not Processed" || o.status === "Processing").length;
  const deliveredCount = (orders || []).filter((o) => o.status === "Delivered").length;

  return (
    <DashboardLayout title="Order Management - SnapCart" admin>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Customer Orders ({visibleOrders?.length || 0})</h4>
          <p className="text-muted small mb-0">Track customer fulfillments, update tracking states, and handle refunds.</p>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-warning-subtle text-warning fw-bold px-3 py-2 rounded-pill">
            {pendingCount} Pending Action
          </span>
          <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-pill">
            <FiCheckCircle className="me-1" /> {deliveredCount} Fulfilled
          </span>
        </div>
      </div>

      {/* Filter Tabs / Select */}
      <div className="card-box p-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2">
          <FiFilter className="text-muted" />
          <span className="fw-bold text-dark small">Filter Orders:</span>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {["All", ...STATUS_LIST].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`btn btn-sm ${
                filter === status ? "btn-brand" : "btn-outline-custom"
              }`}
            >
              {status}
              {status === "All"
                ? ` (${orders.length})`
                : ` (${orders.filter((o) => o.status === status).length})`}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="py-5">
          <Spinner />
        </div>
      )}

      {!loading && visibleOrders.length === 0 && (
        <div className="card-box empty-state">
          <FiShoppingBag size={42} className="text-muted mb-3" />
          <h6 className="fw-bold text-dark mb-1">No orders found in this filter</h6>
          <p className="text-muted small mb-0">No active customer orders currently match the selected criteria.</p>
        </div>
      )}

      {visibleOrders.map((order) => (
        <OrderCard order={order} showBuyer key={order._id}>
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted fw-semibold">Update fulfillment status:</span>
            <select
              className="form-select form-select-sm w-auto fw-semibold"
              value={order.status}
              disabled={order.status === "Cancelled"}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
            >
              {STATUS_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </OrderCard>
      ))}

      {/* In-App Confirmation Modal (Zero native browser popups!) */}
      <ConfirmModal
        isOpen={Boolean(pendingCancel)}
        title="Cancel Customer Order?"
        message="Cancelling this order will immediately restore all reserved units back to inventory. If the buyer paid online via Razorpay, the refund will be initiated to their original payment source."
        confirmText="Yes, Cancel Order"
        cancelText="Keep Active"
        confirmVariant="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => setPendingCancel(null)}
      />
    </DashboardLayout>
  );
};

export default AdminOrders;
