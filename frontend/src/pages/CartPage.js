import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  FiTrash2, 
  FiShoppingBag, 
  FiShield, 
  FiMapPin, 
  FiCreditCard, 
  FiTruck, 
  FiArrowRight,
  FiLock,
  FiCheck,
  FiTag,
  FiPlus,
  FiMinus
} from "react-icons/fi";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { formatPrice, getErrorMessage, loadRazorpay, photoUrl } from "../utils/helpers";

const PAYMENT_OPTIONS = [
  { 
    value: "Razorpay", 
    label: "Pay Online with Razorpay", 
    sub: "Instant UPI (GPay/PhonePe), Credit & Debit Cards, NetBanking",
    icon: <FiCreditCard className="text-primary fs-5" />
  },
  { 
    value: "COD", 
    label: "Cash on Delivery (COD)", 
    sub: "Pay at your doorstep via cash or mobile UPI upon delivery",
    icon: <FiTruck className="text-success fs-5" />
  },
];

const CartPage = () => {
  const [auth] = useAuth();
  const { cart, cartCount, cartTotal, updateQty, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percent
  const [appliedCode, setAppliedCode] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode === "SNAPCART20") {
      setAppliedDiscount(20);
      setAppliedCode("SNAPCART20");
      toast.success("Promo code SNAPCART20 applied! 20% discount saved.", {
        icon: "🎉",
      });
    } else if (cleanCode === "WELCOME10") {
      setAppliedDiscount(10);
      setAppliedCode("WELCOME10");
      toast.success("Promo code WELCOME10 applied! 10% discount saved.", {
        icon: "✨",
      });
    } else {
      toast.error("Invalid promo code. Try using SNAPCART20");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(0);
    setAppliedCode("");
    setCouponCode("");
    toast("Promo code removed", { icon: "ℹ️" });
  };

  // Calculations
  const discountAmount = appliedDiscount > 0 ? (cartTotal * appliedDiscount) / 100 : 0;
  const isFreeDelivery = cartTotal >= 999;
  const deliveryFee = isFreeDelivery || cartTotal === 0 ? 0 : 99;
  const finalPayable = Math.max(0, cartTotal - discountAmount + deliveryFee);

  const payOnline = async (items) => {
    if (!(await loadRazorpay())) throw new Error("Could not load Razorpay gateway, check your connection.");

    const { data } = await axios.post("/api/v1/order/razorpay/create", { cart: items });

    return new Promise((resolve, reject) => {
      const razorpay = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "SnapCart Luxury Store",
        description: "Order checkout payment",
        order_id: data.razorpayOrderId,
        prefill: { name: auth.user.name, email: auth.user.email, contact: auth.user.phone },
        theme: { color: "#4f46e5" },
        handler: async (response) => {
          try {
            await axios.post("/api/v1/order/razorpay/verify", { orderId: data.orderId, ...response });
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          ondismiss: () => {
            axios.delete(`/api/v1/order/razorpay/${data.orderId}`).catch(() => {});
            reject(new Error("Payment window closed"));
          },
        },
      });
      razorpay.open();
    });
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const items = cart.map((item) => ({ _id: item._id, qty: item.qty }));

      if (paymentMethod === "Razorpay") {
        await payOnline(items);
      } else {
        await axios.post("/api/v1/order/cod", { cart: items });
      }

      clearCart();
      toast.success("Order confirmed successfully! Receipt generated.", {
        icon: "🎉",
      });
      navigate("/dashboard/user/orders");
    } catch (error) {
      toast.error(error.response ? getErrorMessage(error) : error.message);
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Layout title="Shopping Cart - SnapCart">
        <div className="container py-5 text-center">
          <div className="card-box empty-state p-5 mx-auto" style={{ maxWidth: 540 }}>
            <div className="auth-icon-wrap mx-auto mb-3" style={{ background: "#f1f5f9", color: "#64748b" }}>
              <FiShoppingBag size={28} />
            </div>
            <h4 className="fw-bold text-dark mb-2">Your Shopping Bag is Empty</h4>
            <p className="text-muted small mb-4" style={{ maxWidth: 420, margin: "0 auto" }}>
              Looks like you haven't added anything to your cart yet. Explore our newest drops in luxury apparel and premium electronics.
            </p>
            <Link to="/" className="btn btn-brand px-4 py-2.5">
              <FiShoppingBag className="me-2" /> Start Shopping Now
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Shopping Bag (${cartCount} items) - SnapCart`}>
      <div className="container py-4">
        {/* Checkout Steps Indicator */}
        <div className="d-flex align-items-center justify-content-center gap-3 mb-4 text-center">
          <div className="d-flex align-items-center gap-2 text-primary fw-bold small">
            <span className="badge bg-primary rounded-circle p-2">1</span> Bag Review
          </div>
          <div style={{ width: 40, height: 1, background: "#cbd5e1" }} />
          <div className="d-flex align-items-center gap-2 text-muted fw-semibold small">
            <span className="badge bg-light text-muted border rounded-circle p-2">2</span> Shipping
          </div>
          <div style={{ width: 40, height: 1, background: "#cbd5e1" }} />
          <div className="d-flex align-items-center gap-2 text-muted fw-semibold small">
            <span className="badge bg-light text-muted border rounded-circle p-2">3</span> Payment
          </div>
        </div>

        <div className="row g-4">
          {/* Items Column */}
          <div className="col-lg-8">
            <div className="card-box p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
                <h5 className="fw-bold text-dark mb-0">Review Bag ({cartCount} {cartCount === 1 ? "item" : "items"})</h5>
                <button
                  className="btn btn-link text-danger text-decoration-none small p-0 d-flex align-items-center gap-1"
                  onClick={() => {
                    clearCart();
                    toast("Bag cleared", { icon: "🗑️" });
                  }}
                >
                  <FiTrash2 size={13} /> Clear Bag
                </button>
              </div>

              {cart.map((item) => (
                <div className="cart-item py-3 d-flex flex-wrap align-items-center gap-3 border-bottom" key={item._id}>
                  <img src={photoUrl(item._id)} alt={item.name} className="cart-item-img" />

                  <div className="flex-grow-1" style={{ minWidth: 200 }}>
                    <Link to={`/product/${item.slug}`} className="text-dark text-decoration-none">
                      <h6 className="fw-bold mb-1 hover-primary">{item.name}</h6>
                    </Link>
                    <div className="small text-muted mb-2">
                      Unit Price: <span className="fw-semibold text-dark">{formatPrice(item.price)}</span>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <div className="qty-control">
                        <button onClick={() => updateQty(item._id, item.qty - 1)} aria-label="Decrease">
                          <FiMinus size={12} />
                        </button>
                        <span>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item._id, item.qty + 1)}
                          disabled={item.qty >= item.quantity}
                          aria-label="Increase"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>

                      <button
                        className="btn btn-link text-muted p-0 small text-decoration-none hover-danger"
                        onClick={() => {
                          removeFromCart(item._id);
                          toast.success(`${item.name} removed`, { icon: "🗑️" });
                        }}
                      >
                        <FiTrash2 size={14} className="me-1" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-end">
                    <div className="fs-6 fw-extrabold text-primary">
                      {formatPrice(item.price * item.qty)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Address Box */}
            <div className="card-box p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <FiMapPin className="text-primary" /> Delivery Destination
                </h6>
                {auth?.user && (
                  <Link to="/dashboard/user/profile" className="small fw-semibold text-primary text-decoration-none">
                    Change Address
                  </Link>
                )}
              </div>

              {!auth?.user ? (
                <div className="p-3 bg-light rounded-3 text-center">
                  <p className="small text-muted mb-2">Please sign in to confirm your delivery address and access saved payment methods.</p>
                  <button
                    className="btn btn-brand btn-sm px-4"
                    onClick={() => navigate("/login", { state: "/cart" })}
                  >
                    Sign In to Continue
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-light rounded-3 border">
                  <div className="fw-bold text-dark small mb-1">{auth.user.name} ({auth.user.phone})</div>
                  <div className="text-muted small">{auth.user.address || "No delivery address configured yet."}</div>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="card-box p-4">
              <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <FiCreditCard className="text-primary" /> Payment Method
              </h6>

              <div className="row g-3">
                {PAYMENT_OPTIONS.map((opt) => (
                  <div className="col-sm-6" key={opt.value}>
                    <div
                      className={`p-3 rounded-3 border cursor-pointer h-100 ${
                        paymentMethod === opt.value
                          ? "border-primary bg-primary-subtle shadow-sm"
                          : "border-secondary-subtle bg-white hover-bg-light"
                      }`}
                      style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                      onClick={() => setPaymentMethod(opt.value)}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          {opt.icon}
                          <span className="fw-bold text-dark small">{opt.label}</span>
                        </div>
                        {paymentMethod === opt.value && (
                          <div className="badge bg-primary text-white rounded-circle p-1">
                            <FiCheck size={12} />
                          </div>
                        )}
                      </div>
                      <p className="text-muted small mb-0" style={{ fontSize: "11.5px" }}>
                        {opt.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Summary Column */}
          <div className="col-lg-4">
            <div className="order-summary-box">
              <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">Order Summary</h5>

              {/* Coupon Box */}
              <div className="mb-3">
                {appliedCode ? (
                  <div className="p-2.5 bg-success-subtle text-success rounded-3 border border-success d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-1.5 small fw-bold">
                      <FiTag /> {appliedCode} (-{appliedDiscount}%)
                    </div>
                    <button
                      className="btn btn-sm btn-link text-danger p-0 fw-bold text-decoration-none small"
                      onClick={handleRemoveCoupon}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control form-control-sm text-uppercase"
                      placeholder="Promo code (e.g. SNAPCART20)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button type="submit" className="btn btn-brand btn-sm px-3">
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Breakdown */}
              <div className="d-flex justify-content-between small text-muted mb-2">
                <span>Items Subtotal:</span>
                <span className="fw-semibold text-dark">{formatPrice(cartTotal)}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="d-flex justify-content-between small text-success fw-semibold mb-2">
                  <span>Promo Discount ({appliedDiscount}%):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="d-flex justify-content-between small text-muted mb-2">
                <span>Estimated Taxes (GST):</span>
                <span className="text-success fw-semibold">Inclusive</span>
              </div>

              <div className="d-flex justify-content-between small text-muted mb-3 pb-3 border-bottom">
                <span>Express Delivery:</span>
                <span className={isFreeDelivery ? "text-success fw-bold" : "text-dark fw-semibold"}>
                  {isFreeDelivery ? "FREE" : formatPrice(99)}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-baseline mb-4">
                <span className="fw-bold text-dark fs-6">Order Total:</span>
                <span className="fs-4 fw-extrabold text-primary">{formatPrice(finalPayable)}</span>
              </div>

              {/* Checkout Button */}
              {!auth?.user ? (
                <button
                  className="btn btn-brand w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate("/login", { state: "/cart" })}
                >
                  Sign In to Complete Order <FiArrowRight />
                </button>
              ) : !auth.user.address ? (
                <button
                  className="btn btn-warning w-100 py-3 fw-bold text-dark"
                  onClick={() => navigate("/dashboard/user/profile")}
                >
                  Add Delivery Address to Order
                </button>
              ) : (
                <button
                  className="btn btn-brand w-100 py-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  disabled={placing}
                  onClick={placeOrder}
                >
                  <FiLock size={16} /> {placing ? "Processing Order..." : `Pay ${formatPrice(finalPayable)}`}
                </button>
              )}

              {/* Trust Strip */}
              <div className="mt-4 pt-3 border-top text-center">
                <div className="d-flex align-items-center justify-content-center gap-3 text-muted small" style={{ fontSize: "11.5px" }}>
                  <span className="d-flex align-items-center gap-1">
                    <FiShield className="text-primary" /> Verified Checkout
                  </span>
                  <span>•</span>
                  <span>Instant Refund SLA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
