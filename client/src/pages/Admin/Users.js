import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { FaUsers } from "react-icons/fa";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  // GET USERS
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-users");
      if (data?.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

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

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 10px;
          border-bottom: 1px solid #e2e8f0;
          text-align: left;
        }

        th {
          background: #f8fafc;
        }

        .empty-state {
          text-align: center;
          padding: 40px 0;
          color: #64748b;
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

              {/* USERS TABLE */}
              {users.length === 0 ? (
                <div className="empty-state">No users found</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id}>
                        <td>{i + 1}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role === 1 ? "Admin" : "User"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;