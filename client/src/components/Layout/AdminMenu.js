import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <div className="text-center">
      <div
        className="list-group"
        style={{
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <h4
          style={{
            padding: "12px",
            margin: 0,
            background: "#f1f5f9",
            color: "#1e293b",
            fontWeight: "600",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          Admin Panel
        </h4>

        <NavLink
          to="/dashboard/admin/create-category"
          className="list-group-item list-group-item-action admin-link"
        >
          Create Category
        </NavLink>

        <NavLink
          to="/dashboard/admin/create-product"
          className="list-group-item list-group-item-action admin-link"
        >
          Create Product
        </NavLink>

        <NavLink
          to="/dashboard/admin/products"
          className="list-group-item list-group-item-action admin-link"
        >
          Product
        </NavLink>

        <NavLink
          to="/dashboard/admin/orders"
          className="list-group-item list-group-item-action admin-link"
        >
          Orders
        </NavLink>

        <NavLink
          to="/dashboard/admin/users"
          className="list-group-item list-group-item-action admin-link"
        >
          User
        </NavLink>
      </div>

      {/* Styles */}
      <style>
        {`
          .admin-link {
            font-weight: 500;
            color: #334155;
            transition: all 0.2s ease;
            border: none;
          }

          .admin-link:hover {
            background: #eff6ff;
            color: #2563eb;
            padding-left: 18px;
          }

          .admin-link.active {
            background: #dbeafe !important;
            color: #1d4ed8 !important;
            font-weight: 600;
          }
        `}
      </style>
    </div>
  );
};

export default AdminMenu;