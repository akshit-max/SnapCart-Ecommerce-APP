import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUser, FiPhone, FiMapPin, FiLock, FiCheck } from "react-icons/fi";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useAuth } from "../../context/auth";
import { getErrorMessage } from "../../utils/helpers";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [form, setForm] = useState({
    name: auth?.user?.name || "",
    phone: auth?.user?.phone || "",
    address: auth?.user?.address || "",
    password: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.put("/api/v1/auth/profile", form);
      setAuth({ ...auth, user: data.user });
      setForm({ ...form, password: "" });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
    setSaving(false);
  };

  return (
    <DashboardLayout title="Account Settings - SnapCart">
      <div className="card-box p-4" style={{ maxWidth: 680 }}>
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
          <div>
            <h4 className="fw-bold text-dark mb-1">Account & Shipping Details</h4>
            <p className="text-muted small mb-0">Update your personal information and delivery destination.</p>
          </div>
          <div className="p-2 rounded-3 bg-primary-subtle text-primary">
            <FiUser size={22} />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small d-flex align-items-center gap-1">
                <FiUser size={14} className="text-muted" /> Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label small">Email Address</label>
              <input
                value={auth?.user?.email || ""}
                className="form-control bg-light text-muted"
                disabled
              />
              <span className="small text-muted" style={{ fontSize: "11.5px" }}>
                Email address is linked to your account identity and cannot be edited.
              </span>
            </div>

            <div className="col-12">
              <label className="form-label small d-flex align-items-center gap-1">
                <FiPhone size={14} className="text-muted" /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="form-control"
                placeholder="10-digit mobile number"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label small d-flex align-items-center gap-1">
                <FiMapPin size={14} className="text-muted" /> Delivery Address
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="form-control"
                rows={3}
                placeholder="Complete street address, house/flat no., city, state, and pin code"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label small d-flex align-items-center gap-1">
                <FiLock size={14} className="text-muted" /> New Password (Optional)
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Leave blank to maintain current password"
                minLength={6}
              />
            </div>

            <div className="col-12 mt-4">
              <button type="submit" className="btn btn-brand w-100 py-2" disabled={saving}>
                {saving ? "Saving Changes..." : <><FiCheck className="me-1" /> Save Account Changes</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
