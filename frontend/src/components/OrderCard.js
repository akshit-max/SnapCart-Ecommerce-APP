import { formatDate, formatPrice, photoUrl } from "../utils/helpers";

// used on both the user's orders page and the admin orders page.
// children = actions shown on the right (cancel button, status dropdown)
const OrderCard = ({ order, showBuyer = false, children }) => {
  return (
    <div className="card-box mb-4">
      <div className="d-flex flex-wrap justify-content-between gap-3 mb-2">
        <div>
          <div className="fw-semibold">Order #{order._id.slice(-6).toUpperCase()}</div>
          <div className="small text-muted-soft">Placed on {formatDate(order.createdAt)}</div>
          {showBuyer && (
            <div className="small mt-1">
              {order.buyer?.name} ({order.buyer?.email})
              {order.address && <div className="text-muted-soft">{order.address}</div>}
            </div>
          )}
        </div>

        <div className="text-md-end">
          <span className={`status-badge ${order.status}`}>{order.status}</span>
          <div className="small mt-2">
            {order.payment?.method === "Razorpay" ? "Online (Razorpay)" : "Cash on Delivery"}
            {" · "}
            <span className={`status-badge ${order.payment?.status}`}>{order.payment?.status}</span>
          </div>
          <div className="fw-semibold mt-1">{formatPrice(order.total)}</div>
        </div>
      </div>

      {order.items.map((item) => (
        <div className="order-item" key={item._id}>
          <img src={photoUrl(item.product)} alt={item.name} />
          <div className="flex-grow-1">
            <div className="fw-medium">{item.name}</div>
            <div className="small text-muted-soft">
              {item.qty} x {formatPrice(item.price)}
            </div>
          </div>
          <div className="fw-semibold">{formatPrice(item.qty * item.price)}</div>
        </div>
      ))}

      {children && <div className="border-top pt-3 mt-2">{children}</div>}
    </div>
  );
};

export default OrderCard;
