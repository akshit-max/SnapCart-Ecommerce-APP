import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
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
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
    setSaving(false);
  };

  return (
    <DashboardLayout title="Edit Profile">
      <div className="card-box" style={{ maxWidth: 600 }}>
        <h4 className="page-title mb-4">Edit Profile</h4>

        <form onSubmit={handleSubmit}>
          <label className="form-label small">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="form-control mb-3" required />

          <label className="form-label small">Email</label>
          <input value={auth?.user?.email || ""} className="form-control mb-3" disabled />

          <label className="form-label small">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="form-control mb-3" required />

          <label className="form-label small">Delivery address</label>
          <textarea name="address" value={form.address} onChange={handleChange}
            className="form-control mb-3" rows={2} required />

          <label className="form-label small">New password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange}
            className="form-control mb-4" placeholder="Leave empty to keep current password" minLength={6} />

          <button type="submit" className="btn btn-brand w-100 py-2" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
