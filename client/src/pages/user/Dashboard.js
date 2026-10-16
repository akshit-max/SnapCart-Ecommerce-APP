import { Link } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const [auth] = useAuth();
  const user = auth?.user;

  return (
    <DashboardLayout title="My Account">
      <div className="card-box">
        <div className="d-flex align-items-center gap-3 mb-4">
          <FaUserCircle size={48} color="var(--primary)" />
          <div>
            <h5 className="mb-0">Hi, {user?.name}</h5>
            <span className="small text-muted-soft">Manage your orders and account details</span>
          </div>
        </div>

        <p className="d-flex align-items-center gap-2">
          <FaEnvelope color="var(--primary)" /> {user?.email}
        </p>
        <p className="d-flex align-items-center gap-2">
          <FaPhone color="var(--primary)" /> {user?.phone}
        </p>
        <p className="d-flex align-items-center gap-2">
          <FaMapMarkerAlt color="var(--primary)" /> {user?.address}
        </p>

        <div className="d-flex gap-2 mt-4">
          <Link to="/dashboard/user/orders" className="btn btn-brand">View Orders</Link>
          <Link to="/dashboard/user/profile" className="btn btn-outline-dark">Edit Profile</Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
