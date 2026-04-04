// import React from 'react'
// import Layout from '../../components/Layout/Layout'
// import AdminMenu from '../../components/Layout/AdminMenu'

// const AdminDashboard = () => {
//   return (
//     <Layout>
//     <div className="container-fluid">
//         <div className="row">
//             <div className="col-md-3">
//             <AdminMenu/>
//             </div>
//             <div className="col-md-9">

//             </div>
//         </div>
//     </div>
//   </Layout>
//   )
// }

// export default AdminDashboard
import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title={"Admin Dashboard"}>
      <div
        className="container-fluid px-4 py-3"
        style={{ background: "#f4f7fb", minHeight: "100vh" }}
      >
        <div className="row">

          {/* Sidebar */}
          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* Main */}
          <div className="col-md-9">

            {/* Header */}
            <div className="mb-4">
              <h2 style={{ fontWeight: "600", color: "#1e293b" }}>
                Admin Dashboard
              </h2>
              <p style={{ color: "#64748b" }}>
                Overview of your account details
              </p>
            </div>

            {/* Profile Card */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                padding: "30px",
                maxWidth: "600px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "#3b82f6",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  fontWeight: "600",
                  marginBottom: "20px",
                }}
              >
                {auth?.user?.name?.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="mb-3">
                <p style={{ margin: 0, color: "#64748b" }}>Admin Name</p>
                <h5 style={{ margin: 0 }}>{auth?.user?.name}</h5>
              </div>

              <div className="mb-3">
                <p style={{ margin: 0, color: "#64748b" }}>Email Address</p>
                <h5 style={{ margin: 0 }}>{auth?.user?.email}</h5>
              </div>

              <div className="mb-3">
                <p style={{ margin: 0, color: "#64748b" }}>Contact Number</p>
                <h5 style={{ margin: 0 }}>{auth?.user?.phone}</h5>
              </div>

              {/* Divider */}
              <hr style={{ borderColor: "#e5e7eb" }} />

              {/* Status */}
              <div
                style={{
                  background: "#eff6ff",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  color: "#1e40af",
                  fontWeight: "500",
                  width: "fit-content",
                }}
              >
                Active Admin Account
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;