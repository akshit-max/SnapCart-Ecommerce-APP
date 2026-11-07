import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
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
      // go back to the page that sent us here (cart, dashboard...)
      navigate(location.state || "/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
    setLoading(false);
  };

  return (
    <Layout title="Login">
      <div className="auth-wrapper">
        <div className="card-box auth-card">
          <FaUserCircle className="auth-icon" />
          <h4 className="page-title mb-4">Welcome back</h4>

          <form onSubmit={handleSubmit} className="text-start">
            <label htmlFor="email" className="form-label small">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control mb-3"
              placeholder="Enter your email"
              required
            />

            <label htmlFor="password" className="form-label small">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control mb-2"
              placeholder="Enter your password"
              required
            />

            <div className="text-end mb-3">
              <Link to="/forgot-password" className="small">Forgot password?</Link>
            </div>

            <button type="submit" className="btn btn-brand w-100 py-2" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="small mt-3 mb-0">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
