import { NavLink } from "react-router-dom";
import { FiUser, FiPackage, FiSettings } from "react-icons/fi";

const UserMenu = () => {
  return (
    <div className="card-box side-menu p-3">
      <div className="px-2 mb-3 pb-2 border-bottom">
        <h6 className="fw-bold mb-0 text-dark">My Account</h6>
        <span className="text-muted small" style={{ fontSize: "11px" }}>Customer Portal</span>
      </div>
      <NavLink to="/dashboard/user" end className="d-flex align-items-center gap-2">
        <FiUser size={16} /> Profile Overview
      </NavLink>
      <NavLink to="/dashboard/user/orders" className="d-flex align-items-center gap-2">
        <FiPackage size={16} /> My Orders & Tracking
      </NavLink>
      <NavLink to="/dashboard/user/profile" className="d-flex align-items-center gap-2">
        <FiSettings size={16} /> Shipping Addresses
      </NavLink>
    </div>
  );
};

export default UserMenu;
