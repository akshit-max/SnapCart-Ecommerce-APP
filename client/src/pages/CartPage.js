// import React, { useState } from "react";
// import Layout from "./../components/Layout/Layout";
// import { useCart } from "../context/cart";
// import { useAuth } from "../context/auth";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";

// const CartPage = () => {
//   const [auth] = useAuth();
//   const [cart, setCart] = useCart();
//   const [showPaymentCard, setShowPaymentCard] = useState(false);
//   const navigate = useNavigate();

//   const totalPrice = () => {
//     try {
//       const total = cart?.reduce((sum, item) => sum + item.price, 0);
//       return total.toLocaleString("en-US", {
//         style: "currency",
//         currency: "USD",
//       });
//     } catch (error) {
//       console.error(error);
//       return "$0.00";
//     }
//   };

//   const removeCartItem = (pid) => {
//     try {
//       const updatedCart = cart.filter((item) => item._id !== pid);
//       setCart(updatedCart);
//       localStorage.setItem("cart", JSON.stringify(updatedCart));
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <Layout>
//       <div className="cart-page container py-4">
//         <div className="row mb-4">
//           <div className="col-md-12 text-center">
//             <h1>{auth?.user ? `Hello, ${auth.user.name}` : "Hello Guest"}</h1>
//             <p>
//               {cart?.length
//                 ? `You have ${cart.length} item(s) in your cart.`
//                 : "Your Cart is Empty"}
//             </p>
//           </div>
//         </div>

//         <div className="row">
//           <div className="col-md-7">
//             {cart?.map((product) => (
//               <div
//                 className="card mb-3 p-2 d-flex flex-row align-items-center"
//                 key={product._id}
//               >
//                 <img
//                   src={`/api/v1/product/product-photo/${product._id}`}
//                   alt={product.name}
//                   style={{ width: "100px", height: "100px", objectFit: "cover" }}
//                 />
//                 <div className="ms-3">
//                   <h5>{product.name}</h5>
//                   <p>{product.description.substring(0, 50)}...</p>
//                   <p>
//                     <strong>Price:</strong> ${product.price}
//                   </p>
//                   <button
//                     className="btn btn-sm btn-danger"
//                     onClick={() => removeCartItem(product._id)}
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="col-md-5">
//             <div className="card p-3 shadow">
//               <h4>Cart Summary</h4>
//               <p>
//                 <strong>Total:</strong> {totalPrice()}
//               </p>
//               <hr />

//               {auth?.user?.address ? (
//                 <>
//                   <p>
//                     <strong>Address:</strong> {auth.user.address}
//                   </p>
//                   <button
//                     className="btn btn-outline-secondary"
//                     onClick={() => navigate("/dashboard/user/profile")}
//                   >
//                     Update Address
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   className="btn btn-outline-warning"
//                   onClick={() => navigate("/login", { state: "/cart" })}
//                 >
//                   {auth?.token ? "Add Address" : "Login to Checkout"}
//                 </button>
//               )}

//               {cart?.length > 0 && auth?.token && (
//                 <div className="mt-3">
//                   {!showPaymentCard && (
//                     <button
//                       className="btn btn-success w-100"
//                       onClick={() => setShowPaymentCard(true)}
//                     >
//                       Proceed to Payment
//                     </button>
//                   )}

//                   {showPaymentCard && (
//                     <div className="mt-3">
//                       <div className="payment-card border p-3 rounded text-center">
//                         <h5>Scan to Pay</h5>
//                         <p>or</p>
//                         <p className="upi-id">
//                           <strong>UPI ID:&nbsp;</strong>
//                           <span>{auth.user.name}@upi</span>
//                         </p>

//                         <button
//                           className="btn btn-outline-primary mb-2"
//                           onClick={() => {
//                             navigator.clipboard.writeText("yourupi@upi");
//                             toast.success("UPI ID Copied!");
//                           }}
//                         >
//                           Copy UPI ID
//                         </button>
//                         <br />

//                         <button
//                           className="btn btn-primary"
//                           onClick={async () => {
//                             try {
//                               await axios.post("http://localhost:8080/api/v1/auth/order", {
//                                 cart,
//                                 payment: {
//                                   method: "UPI",
//                                   status: "Success",
//                                 },
//                               });
//                               toast.success("Payment Confirmed!");
//                               localStorage.removeItem("cart");
//                               setCart([]);
//                               navigate("/dashboard/user/orders");
//                             } catch (err) {
//                               console.error(err);
//                               toast.error("Order creation failed.");
//                             }
//                           }}
//                         >
//                           Proceed To PAY
//                         </button>
//                       </div>

//                       <button
//                         className="btn btn-success w-100 mt-3"
//                         onClick={() =>
//                           navigate("/payment-qr", {
//                             state: {
//                               url: `https://yoursite.com/api/pay-now/${Math.random()
//                                 .toString(36)
//                                 .slice(2)}`,
//                             },
//                           })
//                         }
//                       >
//                         Pay with QR
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CartPage;



import React, { useState } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [showPaymentCard, setShowPaymentCard] = useState(false);
  const navigate = useNavigate();

  const totalPrice = () => {
    try {
      const total = cart?.reduce((sum, item) => sum + item.price, 0);
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch {
      return "$0.00";
    }
  };

  const removeCartItem = (pid) => {
    const updatedCart = cart.filter((item) => item._id !== pid);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <Layout>

      <style>{`
        .cart-wrapper {
          padding: 40px 0;
        }

        .cart-title {
          font-weight: 600;
          color: #1e293b;
        }

        .cart-item {
          border-radius: 16px;
          border: 1px solid #e6efff;
          padding: 12px;
          background: #fff;
          transition: all 0.2s ease;
        }

        .cart-item:hover {
          box-shadow: 0 10px 25px rgba(37,99,235,0.1);
        }

        .cart-img {
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-radius: 10px;
          object-position: top;
        }

        .remove-btn {
          font-size: 12px;
          border-radius: 6px;
        }

        .summary-card {
          border-radius: 18px;
          border: 1px solid #e6efff;
          padding: 20px;
          background: #fff;
          box-shadow: 0 12px 30px rgba(0,0,0,0.05);
        }

        .total-price {
          font-size: 20px;
          font-weight: 600;
          color: #2563eb;
        }

        .pay-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          border-radius: 10px;
          height: 45px;
        }

        .pay-btn:hover {
          box-shadow: 0 8px 20px rgba(37,99,235,0.3);
        }
      `}</style>

      <div className="container cart-wrapper">

        {/* HEADER */}
        <div className="text-center mb-4">
          <h2 className="cart-title">
            {auth?.user ? `Hello, ${auth.user.name}` : "Hello Guest"}
          </h2>
          <p className="text-muted">
            {cart?.length
              ? `${cart.length} item(s) in your cart`
              : "Your cart is empty"}
          </p>
        </div>

        <div className="row">

          {/* LEFT ITEMS */}
          <div className="col-md-7">

            {cart?.map((product) => (
              <div className="cart-item mb-3 d-flex" key={product._id}>

                <img
                  src={`/api/v1/product/product-photo/${product._id}`}
                  className="cart-img"
                  alt={product.name}
                />

                <div className="ms-3 flex-grow-1">
                  <h6>{product.name}</h6>

                  <p className="text-muted small">
                    {product.description.substring(0, 50)}...
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold text-primary">
                      ${product.price}
                    </span>

                    <button
                      className="btn btn-danger btn-sm remove-btn"
                      onClick={() => removeCartItem(product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

              </div>
            ))}

          </div>

          {/* RIGHT SUMMARY */}
          <div className="col-md-5">

            <div className="summary-card">

              <h5>Cart Summary</h5>

              <p className="total-price">{totalPrice()}</p>

              <hr />

              {auth?.user?.address ? (
                <>
                  <p className="small">
                    <strong>Address:</strong> {auth.user.address}
                  </p>

                  <button
                    className="btn btn-outline-secondary w-100 mb-2"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-outline-warning w-100 mb-2"
                  onClick={() => navigate("/login", { state: "/cart" })}
                >
                  {auth?.token ? "Add Address" : "Login to Checkout"}
                </button>
              )}

              {cart?.length > 0 && auth?.token && (
                <>
                  {!showPaymentCard ? (
                    <button
                      className="btn text-white w-100 pay-btn"
                      onClick={() => setShowPaymentCard(true)}
                    >
                      Proceed to Payment
                    </button>
                  ) : (
                    <div className="mt-3 text-center">

                      <p className="small">UPI ID</p>
                      <strong>{auth.user.name}@upi</strong>

                      <button
                        className="btn btn-outline-primary w-100 mt-2"
                        onClick={() => {
                          navigator.clipboard.writeText("yourupi@upi");
                          toast.success("UPI copied");
                        }}
                      >
                        Copy UPI ID
                      </button>

                      <button
                        className="btn btn-success w-100 mt-2"
                        onClick={async () => {
                          try {
                            await axios.post(
                              "http://localhost:8080/api/v1/auth/order",
                              {
                                cart,
                                payment: { method: "UPI", status: "Success" },
                              }
                            );
                            toast.success("Order placed!");
                            localStorage.removeItem("cart");
                            setCart([]);
                            navigate("/dashboard/user/orders");
                          } catch {
                            toast.error("Order failed");
                          }
                        }}
                      >
                        Confirm Payment
                      </button>
                    </div>
                  )}
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