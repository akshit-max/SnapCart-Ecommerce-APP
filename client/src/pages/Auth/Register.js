import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaUserPlus } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/auth/register`, {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Registered successfully!");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <Layout title="Register - Ecommerce App">

      {/* STYLE */}
      <style>{`
        .auth-wrapper {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
          padding: 20px;
        }

        .auth-card {
          width: 100%;
          max-width: 450px;
          background: #ffffff;
          border-radius: 18px;
          padding: 35px 28px;
          box-shadow: 0 15px 40px rgba(0, 102, 255, 0.08);
          border: 1px solid #e6efff;
          text-align: center;
        }

        .auth-icon {
          margin-bottom: 12px;
        }

        .auth-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #1e293b;
        }

        .form-control {
          height: 42px;
          border-radius: 10px;
          border: 1px solid #dbeafe;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .form-control:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .register-btn {
          height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          font-weight: 500;
          transition: all 0.25s ease;
        }

        .register-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
        }
      `}</style>

      <div className="auth-wrapper">
        <div className="auth-card">

          <div className="auth-icon">
            <FaUserPlus size={45} color="#2563eb" />
          </div>

          <div className="auth-title">Create your account</div>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="form-control mb-3"
              required
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="form-control mb-3"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="form-control mb-3"
              required
            />

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="form-control mb-3"
              required
            />

            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="form-control mb-3"
              required
            />

            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="What is your favorite sport?"
              className="form-control mb-4"
              required
            />

            <button type="submit" className="btn w-100 text-white register-btn">
              Create Account
            </button>

          </form>

        </div>
      </div>

    </Layout>
  );
};

export default Register;