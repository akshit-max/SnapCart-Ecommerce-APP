import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaKey } from "react-icons/fa";
import Layout from "../../components/Layout/Layout";
import { getErrorMessage } from "../../utils/helpers";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/v1/auth/forgot-password", {
        email,
        answer,
        newPassword,
      });
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
    setLoading(false);
  };

  return (
    <Layout title="Reset Password">
      <div className="auth-wrapper">
        <div className="card-box auth-card">
          <FaKey className="auth-icon" />
          <h4 className="page-title mb-4">Reset your password</h4>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control mb-3"
              placeholder="Your email"
              required
            />
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control mb-3"
              placeholder="Your favourite sport"
              required
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control mb-3"
              placeholder="New password (min 6 characters)"
              minLength={6}
              required
            />
            <button type="submit" className="btn btn-brand w-100 py-2" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <p className="small mt-3 mb-0">
            <Link to="/login">Back to login</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
