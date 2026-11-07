import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiShoppingBag, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import { getErrorMessage } from "../../utils/helpers";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/v1/auth/login", { email, password });
      setAuth({ user: data.user, token: data.token });
      toast.success("Welcome back, " + data.user.name);
      navigate(location.state || "/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
    setLoading(false);
  };

  return (
    <Layout title="Sign In - SnapCart">
      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Brand Icon */}
          <div className="auth-icon-wrap">
            <FiShoppingBag />
          </div>
          <h4 className="fw-extrabold text-dark mb-1">Welcome Back</h4>
          <p className="text-muted small mb-4">Sign in to your SnapCart account to continue shopping.</p>

          <form onSubmit={handleSubmit} className="text-start">
            <div className="mb-3">
              <label htmlFor="email" className="form-label small d-flex align-items-center gap-1">
                <FiMail size={13} className="text-muted" /> Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center">
                <label htmlFor="password" className="form-label small d-flex align-items-center gap-1 mb-0">
                  <FiLock size={13} className="text-muted" /> Password
                </label>
                <Link to="/forgot-password" className="small text-primary text-decoration-none" style={{ fontSize: "12px" }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control mt-1"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn btn-brand w-100 py-2 mt-4" disabled={loading}>
              {loading ? "Signing in..." : <>Sign In <FiArrowRight className="ms-1" /></>}
            </button>
          </form>

          <div className="border-top pt-3 mt-4">
            <p className="small text-muted mb-0">
              Don't have an account?{" "}
              <Link to="/register" className="fw-bold text-primary text-decoration-none">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
