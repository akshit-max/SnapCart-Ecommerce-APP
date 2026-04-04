import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "20px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
      }}
    >
      {/* Title */}
      <h5
        style={{
          marginBottom: "20px",
          color: "#1e293b",
          fontWeight: "600",
        }}
      >
        User Dashboard
      </h5>

      {/* Menu */}
      <div className="d-flex flex-column gap-2">

        {/* Profile */}
        <NavLink
          to="/dashboard/user/profile"
          style={({ isActive }) => ({
            padding: "10px 15px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "500",
            background: isActive ? "#eff6ff" : "transparent",
            color: isActive ? "#2563eb" : "#374151",
            transition: "0.2s",
            
          })}
        >
          Profile
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/dashboard/user/orders"
          style={({ isActive }) => ({
            padding: "10px 15px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "500",
            background: isActive ? "#eff6ff" : "transparent",
            color: isActive ? "#2563eb" : "#374151",
            transition: "0.2s",
          })}
        >
           Orders
        </NavLink>

      </div>
    </div>
  );
};

export default UserMenu;