import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    if (count === 0) {
      navigate(`/${path}`, {
        state: location.pathname,
      });
    }

    return () => clearInterval(interval);
  }, [count, navigate, location, path]);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "#f4f7fb",
      }}
    >
      {/* Card */}
      <div
        style={{
          background: "#ffffff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          textAlign: "center",
          width: "320px",
        }}
      >
        {/* Spinner */}
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid #e0e7ff",
            borderTop: "5px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}
        />

        {/* Title */}
        <h5 style={{ marginBottom: "10px", color: "#1e293b" }}>
          Redirecting...
        </h5>

        {/* Countdown */}
        <p style={{ color: "#64748b", margin: 0 }}>
          You will be redirected in{" "}
          <span style={{ color: "#2563eb", fontWeight: "600" }}>
            {count}
          </span>{" "}
          second{count !== 1 && "s"}
        </p>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Spinner;