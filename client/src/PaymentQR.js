// src/pages/PaymentQR.js
import React, { useState, useEffect } from "react";
// import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useLocation } from "react-router-dom";
// import Layout from "./../components/Layout/Layout";
import { useCart } from "./context/cart";
// import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
// import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";

// const CartPage = () => {
//   const [auth] = useAuth();
//   const [cart, setCart] = useCart();
//   const [clientToken, setClientToken] = useState("");
//   const [instance, setInstance] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showPaymentCard, setShowPaymentCard] = useState(false);
//   const navigate = useNavigate();





const PaymentQR = () => {
   const [cart, setCart] = useCart();
    const navigate = useNavigate();
  const location = useLocation();
  const paymentUrl = location.state?.url || "https://yoursite.com/checkout";

  return (
    <>
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Scan this QR to complete your payment</h2>
      <QRCodeCanvas value={paymentUrl} size={256} />
      <p style={{ marginTop: "20px" }}>Payment URL: <br />{paymentUrl}</p>
    </div>
    <div style={{ textAlign: "center", marginTop: "50px" }} >
     <button
  className="btn btn-primary"
  onClick={async () => {
    try {
      await axios.post("http://localhost:8080/api/v1/auth/order", {
        cart,
        payment: {
          method: "UPI",
          status: "Success",
        },
      });
      toast.success("Payment Confirmed!");
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
    } catch (err) {
      console.error(err);
      toast.error("Order creation failed.");
    }
  }}
>
  Proceed To PAY
</button>
    </div>
    </>
  );
};

export default PaymentQR;
