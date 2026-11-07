import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiKey, FiMail, FiHelpCircle, FiLock, FiArrowLeft, FiCheck } from "react-icons/fi";
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
    <Layout title="Reset Password - SnapCart">
      <div className="auth-wrapper">
        <div className="auth-card" style={{ maxWidth: 440 }}>
          <div className="auth-icon-wrap">
            <FiKey />
          </div>
          <h4 className="fw-extrabold text-dark mb-1">Reset Password</h4>
          <p className="text-muted small mb-4">
            Verify your security question to set up a brand new account password.
          </p>

          <form onSubmit={handleSubmit} className="text-start">
            <div className="mb-3">
              <label className="form-label small d-flex align-items-center gap-1">
                <FiMail size={13} className="text-muted" /> Registered Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small d-flex align-items-center gap-1">
                <FiHelpCircle size={13} className="text-muted" /> Security Question
              </label>
              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="form-control"
                placeholder="What is your favourite sport?"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label small d-flex align-items-center gap-1">
                <FiLock size={13} className="text-muted" /> New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control"
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
            </div>

            <button type="submit" className="btn btn-brand w-100 py-2" disabled={loading}>
              {loading ? "Resetting Password..." : <><FiCheck className="me-1" /> Reset & Save Password</>}
            </button>
          </form>

          <div className="border-top pt-3 mt-4">
            <Link to="/login" className="small text-muted text-decoration-none d-inline-flex align-items-center gap-1">
              <FiArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
