import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import {
  FaUserCircle,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title={"Dashboard - SnapCart"}>

      <style>{`
        .dashboard-wrapper {
          padding: 30px;
        }

        .dashboard-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 25px;
          border: 1px solid #e6efff;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          width: 100%;
          max-width: 500px;
        }

        .user-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .user-icon {
          font-size: 45px;
          color: #2563eb;
        }

        .user-name {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          font-size: 14px;
          color: #475569;
          border-bottom: 1px solid #f1f5ff;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-icon {
          font-size: 16px;
          color: #2563eb;
          min-width: 18px;
        }
      `}</style>

      <div className="container dashboard-wrapper">
        <div className="row">

          {/* SIDEBAR */}
          <div className="col-md-3">
            <UserMenu />
          </div>

          {/* MAIN */}
          <div className="col-md-9 d-flex justify-content-center">

            <div className="dashboard-card">

              {/* HEADER */}
              <div className="user-header">
                <FaUserCircle className="user-icon" />
                <div className="user-name">
                  {auth?.user?.name}
                </div>
              </div>

              {/* EMAIL */}
              <div className="info-row">
                <FaEnvelope className="info-icon" />
                <span>{auth?.user?.email}</span>
              </div>

              {/* ADDRESS */}
              <div className="info-row">
                <FaMapMarkerAlt className="info-icon" />
                <span>{auth?.user?.address || "Not provided"}</span>
              </div>

            </div>

          </div>

        </div>
      </div>

    </Layout>
  );
};

export default Dashboard;