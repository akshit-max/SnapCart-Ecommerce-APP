import { FiCalendar, FiPackage, FiCreditCard, FiUser, FiMapPin } from "react-icons/fi";
import { formatDate, formatPrice, photoUrl } from "../utils/helpers";

// Used on both the user's orders page and the admin orders page.
// children = actions shown in card footer (cancel button, status dropdown)
const OrderCard = ({ order, showBuyer = false, children }) => {
  return (
    <div className="card-box mb-4 p-4">
      {/* Order Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 pb-3 border-bottom mb-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-dark text-white fw-bold px-2 py-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
              #{order._id.slice(-8).toUpperCase()}
            </span>
            <span className={`status-badge ${order.status}`}>
              <FiPackage size={12} /> {order.status}
            </span>
          </div>
          <div className="small text-muted d-flex align-items-center gap-1">
            <FiCalendar size={13} /> Placed on {formatDate(order.createdAt)}
          </div>
          {showBuyer && (
            <div className="small mt-2 p-2 bg-light rounded-2 border">
              <div className="fw-semibold text-dark d-flex align-items-center gap-1">
                <FiUser size={13} className="text-primary" /> {order.buyer?.name} ({order.buyer?.email})
              </div>
              {order.address && (
                <div className="text-muted d-flex align-items-center gap-1 mt-1" style={{ fontSize: "12px" }}>
                  <FiMapPin size={12} className="text-muted" /> {order.address}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-md-end">
          <div className="d-flex align-items-center justify-content-md-end gap-2 mb-1">
            <span className="badge bg-light text-secondary border fw-medium px-2 py-1" style={{ fontSize: "11px" }}>
              <FiCreditCard className="me-1" />
              {order.payment?.method === "Razorpay" ? "Razorpay (Online)" : "Cash on Delivery"}
            </span>
            <span className={`status-badge ${order.payment?.status}`}>
              {order.payment?.status}
            </span>
          </div>
          <div className="fs-5 fw-extrabold text-primary">{formatPrice(order.total)}</div>
        </div>
      </div>

      {/* Items List */}
      <div className="mb-2">
        {order.items.map((item) => (
          <div className="order-item" key={item._id}>
            <img src={photoUrl(item.product)} alt={item.name} />
            <div className="flex-grow-1">
              <div className="fw-bold text-dark mb-1">{item.name}</div>
              <div className="small text-muted">
                Qty: <span className="fw-semibold text-dark">{item.qty}</span> × {formatPrice(item.price)}
              </div>
            </div>
            <div className="fw-bold text-dark">{formatPrice(item.qty * item.price)}</div>
          </div>
        ))}
      </div>

      {/* Actions (Cancel button or Admin Status Selector) */}
      {children && <div className="border-top pt-3 mt-3 d-flex justify-content-end">{children}</div>}
    </div>
  );
};

export default OrderCard;
