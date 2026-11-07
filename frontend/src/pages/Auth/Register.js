import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUserPlus, FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiHelpCircle, FiArrowRight } from "react-icons/fi";
import Layout from "../../components/Layout/Layout";
import { getErrorMessage } from "../../utils/helpers";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    answer: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/v1/auth/register", form);
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
    setLoading(false);
  };

  return (
    <Layout title="Create Account - SnapCart">
      <div className="auth-wrapper">
        <div className="auth-card" style={{ maxWidth: 480 }}>
          {/* Brand Icon */}
          <div className="auth-icon-wrap">
            <FiUserPlus />
          </div>
          <h4 className="fw-extrabold text-dark mb-1">Create an Account</h4>
          <p className="text-muted small mb-4">Join SnapCart for lightning-fast checkout and verified orders.</p>

          <form onSubmit={handleSubmit} className="text-start">
            <div className="mb-3">
              <label className="form-label small d-flex align-items-center gap-1">
                <FiUser size={13} className="text-muted" /> Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small d-flex align-items-center gap-1">
                <FiMail size={13} className="text-muted" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="form-control"
                required
              />
            </div>

            <div className="row g-2 mb-3">
              <div className="col-sm-6">
                <label className="form-label small d-flex align-items-center gap-1">
                  <FiLock size={13} className="text-muted" /> Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="form-control"
                  minLength={6}
                  required
                />
              </div>
              <div className="col-sm-6">
                <label className="form-label small d-flex align-items-center gap-1">
                  <FiPhone size={13} className="text-muted" /> Mobile Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small d-flex align-items-center gap-1">
                <FiMapPin size={13} className="text-muted" /> Default Delivery Address
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Street, City, State, PIN"
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small d-flex align-items-center gap-1">
                <FiHelpCircle size={13} className="text-muted" /> Security Question (Password Recovery)
              </label>
              <input
                name="answer"
                value={form.answer}
                onChange={handleChange}
                placeholder="What is your favourite sport?"
                className="form-control"
                required
              />
              <span className="small text-muted" style={{ fontSize: "11px" }}>
                This answer will be used to verify your identity if you ever forget your password.
              </span>
            </div>

            <button type="submit" className="btn btn-brand w-100 py-2 mt-4" disabled={loading}>
              {loading ? "Creating Account..." : <>Get Started <FiArrowRight className="ms-1" /></>}
            </button>
          </form>

          <div className="border-top pt-3 mt-4">
            <p className="small text-muted mb-0">
              Already have an account?{" "}
              <Link to="/login" className="fw-bold text-primary text-decoration-none">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
