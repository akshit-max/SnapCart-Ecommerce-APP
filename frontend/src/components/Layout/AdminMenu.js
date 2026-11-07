import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <div className="card-box side-menu">
      <h6 className="fw-semibold px-2 mb-2">Admin Panel</h6>
      <NavLink to="/dashboard/admin" end>Overview</NavLink>
      <NavLink to="/dashboard/admin/orders">Orders</NavLink>
      <NavLink to="/dashboard/admin/products">Products</NavLink>
      <NavLink to="/dashboard/admin/create-product">Add Product</NavLink>
      <NavLink to="/dashboard/admin/create-category">Categories</NavLink>
      <NavLink to="/dashboard/admin/users">Users</NavLink>
    </div>
  );
};

export default AdminMenu;
