import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaQuestionCircle, FaKey } from "react-icons/fa";

const ForgotPasssword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/forgot-password", {
        email,
        newPassword,
        answer,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Forgot Password - Ecommerce APP"}>
      {/* STYLE */}
      <style>{`
        .forgot-wrapper {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
          padding: 20px;
        }

        .forgot-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          border-radius: 18px;
          padding: 35px 28px;
          box-shadow: 0 15px 40px rgba(0, 102, 255, 0.08);
          border: 1px solid #e6efff;
          text-align: center;
        }

        /* 🔑 Top Icon */
        .top-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 15px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 22px;
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
        }

        .forgot-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 25px;
          color: #1e293b;
        }

        .input-group-custom {
          display: flex;
          align-items: center;
          border: 1px solid #dbeafe;
          border-radius: 10px;
          padding: 0 10px;
          margin-bottom: 15px;
          background: #fff;
          transition: all 0.2s ease;
        }

        .input-group-custom:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .input-icon {
          color: #2563eb;
          font-size: 14px;
          margin-right: 8px;
        }

        .input-field {
          border: none;
          outline: none;
          width: 100%;
          height: 40px;
          font-size: 14px;
        }

        .reset-btn {
          height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          font-weight: 500;
          transition: all 0.25s ease;
        }

        .reset-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
        }
      `}</style>

      <div className="forgot-wrapper">
        <div className="forgot-card">
          {/* 🔑 Key Icon */}
          <div className="top-icon">
            <FaKey />
          </div>

          <div className="forgot-title">Reset your password</div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="input-group-custom">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Security Answer */}
            <div className="input-group-custom">
              <FaQuestionCircle className="input-icon" />
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="input-field"
                placeholder="Your favorite sport"
                required
              />
            </div>

            {/* New Password */}
            <div className="input-group-custom">
              <FaLock className="input-icon" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                placeholder="New password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100 text-white reset-btn mt-2"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasssword;
