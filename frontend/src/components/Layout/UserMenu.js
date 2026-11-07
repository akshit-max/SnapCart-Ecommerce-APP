import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <div className="card-box side-menu">
      <h6 className="fw-semibold px-2 mb-2">My Account</h6>
      <NavLink to="/dashboard/user" end>Overview</NavLink>
      <NavLink to="/dashboard/user/orders">My Orders</NavLink>
      <NavLink to="/dashboard/user/profile">Edit Profile</NavLink>
    </div>
  );
};

export default UserMenu;
