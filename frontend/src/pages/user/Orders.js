import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiPackage, FiShoppingBag, FiXCircle } from "react-icons/fi";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import OrderCard from "../../components/OrderCard";
import ConfirmModal from "../../components/ConfirmModal";
import Spinner from "../../components/Spinner";
import { getErrorMessage } from "../../utils/helpers";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/order/my-orders");
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    try {
      await axios.put(`/api/v1/order/cancel/${orderToCancel}`);
      toast.success("Order cancelled and refund processed", { icon: "✅" });
      setOrderToCancel(null);
      getOrders();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <DashboardLayout title="My Orders & Tracking - SnapCart">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h4 className="fw-bold text-dark mb-1">My Orders & Purchases ({orders?.length || 0})</h4>
          <p className="text-muted small mb-0">Track real-time shipment status, view invoices, and manage returns.</p>
        </div>
        <Link to="/" className="btn btn-outline-custom btn-sm">
          <FiShoppingBag className="me-1" /> Continue Shopping
        </Link>
      </div>

      {loading && (
        <div className="py-5">
          <Spinner />
        </div>
      )}

      {!loading && (orders?.length || 0) === 0 && (
        <div className="card-box empty-state p-5">
          <div className="auth-icon-wrap mb-3" style={{ background: "#f1f5f9", color: "#64748b" }}>
            <FiPackage />
          </div>
          <h5 className="fw-bold text-dark mb-2">You haven't placed any orders yet</h5>
          <p className="text-muted small mb-4" style={{ maxWidth: 400, margin: "0 auto" }}>
            Explore our curated departments of luxury fashion, electronics, sneakers, and home essentials.
          </p>
          <Link to="/" className="btn btn-brand px-4">
            <FiShoppingBag className="me-1" /> Start Shopping
          </Link>
        </div>
      )}

      {orders.map((order) => (
        <OrderCard order={order} key={order._id}>
          {order.status === "Not Processed" && (
            <button className="btn btn-sm btn-outline-danger" onClick={() => setOrderToCancel(order._id)}>
              <FiXCircle className="me-1" /> Cancel Order & Refund
            </button>
          )}
        </OrderCard>
      ))}

      {/* In-App Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(orderToCancel)}
        title="Cancel This Order?"
        message="Are you sure you want to cancel this order? If you paid online via Razorpay, the amount will be immediately refunded to your source account."
        confirmText="Confirm Cancellation"
        cancelText="Keep My Order"
        confirmVariant="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => setOrderToCancel(null)}
      />
    </DashboardLayout>
  );
};

export default Orders;
