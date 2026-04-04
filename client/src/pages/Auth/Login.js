import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import { FaUserCircle } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        {
          email,
          password,
        },
      );

      if (data?.success) {
        toast.success("Login Successful");
        setAuth({
          ...auth,
          user: data.user,
          token: data.token,
        });
        localStorage.setItem("auth", JSON.stringify(data));
        navigate("/");
      } else {
        toast.error(data?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <Layout title="Login | ShopVerse">
      {/* STYLE */}
      <style>{`
        .login-wrapper {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
          padding: 20px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          border-radius: 18px;
          padding: 40px 30px;
          box-shadow: 0 15px 40px rgba(0, 102, 255, 0.08);
          border: 1px solid #e6efff;
          text-align: center;
        }

        .login-icon {
          font-size: 55px;
          color: #2563eb;
          margin-bottom: 12px;
        }

        .login-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 25px;
          color: #1e293b;
        }

        .form-label {
          font-size: 13px;
          font-weight: 500;
          color: #475569;
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

        .forgot-btn {
          font-size: 12px;
          color: #2563eb;
        }

        .forgot-btn:hover {
          text-decoration: underline;
        }

        .login-btn {
          height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          font-weight: 500;
          transition: all 0.25s ease;
        }

        .login-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
        }
      `}</style>

      <div className="login-wrapper">
        <div className="login-card">
          <FaUserCircle className="login-icon" />

          <div className="login-title">Welcome back</div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-2 text-start">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="text-end mb-3">
              <button
                type="button"
                className="btn p-0 forgot-btn"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="btn w-100 text-white login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
