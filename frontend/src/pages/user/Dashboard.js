import { Link } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiMapPin, FiPackage, FiShield, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const [auth] = useAuth();
  const user = auth?.user;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <DashboardLayout title="My Account - SnapCart">
      {/* Account Header Hero */}
      <div className="card-box p-4 mb-4" style={{ background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--brand-gradient)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 800,
                boxShadow: "0 6px 16px rgba(79, 70, 229, 0.25)",
              }}
            >
              {initials}
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h4 className="fw-bold text-dark mb-0">{user?.name}</h4>
                <span className="badge bg-success-subtle text-success fw-bold px-2 py-1 rounded-pill" style={{ fontSize: "11px" }}>
                  Verified Member
                </span>
              </div>
              <p className="text-muted small mb-0 mt-1">
                Welcome to your personal account dashboard. Manage your orders and shipping preferences.
              </p>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Link to="/" className="btn btn-outline-custom btn-sm">
              <FiShoppingBag className="me-1" /> Shop Catalog
            </Link>
            <Link to="/dashboard/user/profile" className="btn btn-brand btn-sm">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card-box p-3 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold text-dark small">My Orders</span>
                <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                  <FiPackage size={18} />
                </div>
              </div>
              <p className="text-muted small mb-3">View order history, track shipments and download invoices.</p>
            </div>
            <Link to="/dashboard/user/orders" className="small fw-bold text-primary d-inline-flex align-items-center gap-1">
              View all orders <FiArrowRight />
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-box p-3 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold text-dark small">Primary Address</span>
                <div className="p-2 rounded-3 bg-success-subtle text-success">
                  <FiMapPin size={18} />
                </div>
              </div>
              <p className="text-muted small mb-3 text-truncate">
                {user?.address || "No delivery address set yet."}
              </p>
            </div>
            <Link to="/dashboard/user/profile" className="small fw-bold text-success d-inline-flex align-items-center gap-1">
              Update address <FiArrowRight />
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-box p-3 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold text-dark small">Security & Password</span>
                <div className="p-2 rounded-3 bg-warning-subtle text-warning">
                  <FiShield size={18} />
                </div>
              </div>
              <p className="text-muted small mb-3">Keep your login credentials secure and up to date.</p>
            </div>
            <Link to="/dashboard/user/profile" className="small fw-bold text-warning d-inline-flex align-items-center gap-1">
              Security settings <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Account Details Box */}
      <div className="card-box p-4">
        <h5 className="fw-bold text-dark mb-4 pb-2 border-bottom">Profile & Contact Information</h5>
        <div className="row g-4">
          <div className="col-sm-6">
            <div className="small text-muted fw-semibold mb-1">Full Name</div>
            <div className="fw-bold text-dark d-flex align-items-center gap-2">
              <FiUser className="text-primary" /> {user?.name || "Not provided"}
            </div>
          </div>

          <div className="col-sm-6">
            <div className="small text-muted fw-semibold mb-1">Email Address</div>
            <div className="fw-bold text-dark d-flex align-items-center gap-2">
              <FiMail className="text-primary" /> {user?.email || "Not provided"}
            </div>
          </div>

          <div className="col-sm-6">
            <div className="small text-muted fw-semibold mb-1">Phone Number</div>
            <div className="fw-bold text-dark d-flex align-items-center gap-2">
              <FiPhone className="text-primary" /> {user?.phone || "Not provided"}
            </div>
          </div>

          <div className="col-sm-6">
            <div className="small text-muted fw-semibold mb-1">Shipping Address</div>
            <div className="fw-bold text-dark d-flex align-items-center gap-2">
              <FiMapPin className="text-primary" /> {user?.address || "No address configured"}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
