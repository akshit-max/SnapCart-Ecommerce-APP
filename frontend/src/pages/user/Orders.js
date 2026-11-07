import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import OrderCard from "../../components/OrderCard";
import Spinner from "../../components/Spinner";
import { getErrorMessage } from "../../utils/helpers";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/order/my-orders");
      setOrders(data.orders);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
    setLoading(false);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order? If you paid online, the amount will be refunded.")) return;
    try {
      await axios.put(`/api/v1/order/cancel/${id}`);
      toast.success("Order cancelled");
      getOrders();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <DashboardLayout title="My Orders">
      <h4 className="page-title mb-4">My Orders</h4>

      {loading && <Spinner />}

      {!loading && orders.length === 0 && (
        <div className="card-box empty-state">
          You haven't ordered anything yet. <Link to="/">Start shopping</Link>
        </div>
      )}

      {orders.map((order) => (
        <OrderCard order={order} key={order._id}>
          {order.status === "Not Processed" && (
            <button className="btn btn-sm btn-outline-danger" onClick={() => cancelOrder(order._id)}>
              Cancel Order
            </button>
          )}
        </OrderCard>
      ))}
    </DashboardLayout>
  );
};

export default Orders;
