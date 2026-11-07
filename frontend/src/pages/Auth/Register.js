import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUserPlus } from "react-icons/fa";
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
    <Layout title="Register">
      <div className="auth-wrapper">
        <div className="card-box auth-card">
          <FaUserPlus className="auth-icon" />
          <h4 className="page-title mb-4">Create your account</h4>

          <form onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="Full name" className="form-control mb-3" required />
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="Email address" className="form-control mb-3" required />
            <input type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="Password (min 6 characters)" className="form-control mb-3"
              minLength={6} required />
            <input type="tel" name="phone" value={form.phone} onChange={handleChange}
              placeholder="Phone number" className="form-control mb-3" required />
            <input name="address" value={form.address} onChange={handleChange}
              placeholder="Delivery address" className="form-control mb-3" required />
            <input name="answer" value={form.answer} onChange={handleChange}
              placeholder="Security question: your favourite sport?" className="form-control mb-1" required />
            <p className="small text-muted-soft text-start mb-3">Used to reset your password.</p>

            <button type="submit" className="btn btn-brand w-100 py-2" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="small mt-3 mb-0">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
