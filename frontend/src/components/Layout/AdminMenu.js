import { NavLink } from "react-router-dom";
import { FiGrid, FiShoppingBag, FiBox, FiPlusCircle, FiFolder, FiUsers } from "react-icons/fi";

const AdminMenu = () => {
  return (
    <div className="card-box side-menu p-3">
      <div className="px-2 mb-3 pb-2 border-bottom">
        <h6 className="fw-bold mb-0 text-dark">Management Console</h6>
        <span className="text-muted small" style={{ fontSize: "11px" }}>Admin Access Level</span>
      </div>
      <NavLink to="/dashboard/admin" end className="d-flex align-items-center gap-2">
        <FiGrid size={16} /> Overview
      </NavLink>
      <NavLink to="/dashboard/admin/orders" className="d-flex align-items-center gap-2">
        <FiShoppingBag size={16} /> Order Management
      </NavLink>
      <NavLink to="/dashboard/admin/products" className="d-flex align-items-center gap-2">
        <FiBox size={16} /> Product Inventory
      </NavLink>
      <NavLink to="/dashboard/admin/create-product" className="d-flex align-items-center gap-2">
        <FiPlusCircle size={16} /> Add New Product
      </NavLink>
      <NavLink to="/dashboard/admin/create-category" className="d-flex align-items-center gap-2">
        <FiFolder size={16} /> Category Master
      </NavLink>
      <NavLink to="/dashboard/admin/users" className="d-flex align-items-center gap-2">
        <FiUsers size={16} /> Customer Database
      </NavLink>
    </div>
  );
};

export default AdminMenu;
