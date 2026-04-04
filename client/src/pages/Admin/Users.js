import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { FaUsers } from "react-icons/fa";

const Users = () => {
  return (
    <Layout title={"Dashboard - All Users"}>
      <style>{`
        .users-wrapper {
          padding: 30px;
        }

        .users-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 25px;
          border: 1px solid #e6efff;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }

        .users-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .users-icon {
          font-size: 28px;
          color: #2563eb;
        }

        .users-title {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .empty-state {
          text-align: center;
          padding: 40px 0;
          color: #64748b;
          font-size: 14px;
        }
      `}</style>

      <div className="container-fluid users-wrapper">
        <div className="row">
          {/* SIDEBAR */}
          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* MAIN */}
          <div className="col-md-9">
            <div className="users-card">
              {/* HEADER */}
              <div className="users-header">
                <FaUsers className="users-icon" />
                <div className="users-title">All Users</div>
              </div>

              {/* CONTENT (placeholder for now) */}
              <div className="empty-state">No users to display yet.</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
