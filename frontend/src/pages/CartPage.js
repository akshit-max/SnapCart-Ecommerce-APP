import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { formatPrice, getErrorMessage, loadRazorpay, photoUrl } from "../utils/helpers";

const PAYMENT_OPTIONS = [
  { value: "Razorpay", label: "Pay Online (UPI / Card / Netbanking)" },
  { value: "COD", label: "Cash on Delivery" },
];

const CartPage = () => {
  const [auth] = useAuth();
  const { cart, cartCount, cartTotal, updateQty, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [placing, setPlacing] = useState(false);

  // opens the razorpay popup and resolves once the payment is verified by our server
  const payOnline = async (items) => {
    if (!(await loadRazorpay())) throw new Error("Could not load Razorpay, check your internet");

    const { data } = await axios.post("/api/v1/order/razorpay/create", { cart: items });

    return new Promise((resolve, reject) => {
      const razorpay = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "SnapCart",
        description: "Order payment",
        order_id: data.razorpayOrderId,
        prefill: { name: auth.user.name, email: auth.user.email, contact: auth.user.phone },
        theme: { color: "#2563eb" },
        handler: async (response) => {
          try {
            await axios.post("/api/v1/order/razorpay/verify", { orderId: data.orderId, ...response });
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          // popup closed without paying, release the reserved stock
          ondismiss: () => {
            axios.delete(`/api/v1/order/razorpay/${data.orderId}`).catch(() => {});
            reject(new Error("Payment cancelled"));
          },
        },
      });
      razorpay.open();
    });
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      // server looks up prices itself, we only send ids and quantities
      const items = cart.map((item) => ({ _id: item._id, qty: item.qty }));

      if (paymentMethod === "Razorpay") {
        await payOnline(items);
      } else {
        await axios.post("/api/v1/order/cod", { cart: items });
      }

      clearCart();
      toast.success("Order placed successfully");
      navigate("/dashboard/user/orders");
    } catch (error) {
      toast.error(error.response ? getErrorMessage(error) : error.message);
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Layout title="Cart">
        <div className="container empty-state">
          <h4>Your cart is empty</h4>
          <Link to="/" className="btn btn-brand mt-3 px-4">
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Cart">
      <div className="container mt-3">
        <h3 className="page-title mb-4">Shopping Cart ({cartCount})</h3>

        <div className="row g-4">
          {/* items */}
          <div className="col-lg-7">
            {cart.map((item) => (
              <div className="card-box cart-item d-flex gap-3 mb-3 p-3" key={item._id}>
                <img src={photoUrl(item._id)} alt={item.name} />

                <div className="flex-grow-1">
                  <Link to={`/product/${item.slug}`} className="text-decoration-none text-dark fw-semibold">
                    {item.name}
                  </Link>
                  <div className="product-price mt-1">{formatPrice(item.price)}</div>

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="qty-control">
                      <button onClick={() => updateQty(item._id, item.qty - 1)} aria-label="Decrease">
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item._id, item.qty + 1)} aria-label="Increase">
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* summary + checkout */}
          <div className="col-lg-5">
            <div className="card-box">
              <h5 className="fw-semibold">Order Summary</h5>
              <div className="d-flex justify-content-between mt-3">
                <span className="text-muted-soft">Items ({cartCount})</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted-soft">Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fs-5 fw-semibold">
                <span>Total</span>
                <span className="product-price">{formatPrice(cartTotal)}</span>
              </div>

              {!auth?.token ? (
                <button
                  className="btn btn-brand w-100 mt-4"
                  onClick={() => navigate("/login", { state: "/cart" })}
                >
                  Login to Checkout
                </button>
              ) : (
                <>
                  <div className="mt-4">
                    <p className="mb-1 fw-semibold small">Deliver to</p>
                    <p className="small text-muted-soft mb-1">{auth.user?.address}</p>
                    <Link to="/dashboard/user/profile" className="small">
                      Change address
                    </Link>
                  </div>

                  <p className="mt-4 mb-2 fw-semibold small">Payment method</p>
                  {PAYMENT_OPTIONS.map((option) => (
                    <label key={option.value} className="d-flex align-items-center gap-2 mb-1">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === option.value}
                        onChange={() => setPaymentMethod(option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                  {paymentMethod === "Razorpay" && (
                    <p className="small text-muted-soft mt-1 mb-0">
                      Test mode: pay with UPI ID <b>success@razorpay</b>
                    </p>
                  )}

                  <button
                    className="btn btn-brand w-100 mt-3 py-2"
                    disabled={placing}
                    onClick={placeOrder}
                  >
                    {placing ? "Processing..." : `Place Order - ${formatPrice(cartTotal)}`}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
