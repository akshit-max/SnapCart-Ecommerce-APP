import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { formatDate, getErrorMessage } from "../../utils/helpers";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("/api/v1/auth/all-users")
      .then(({ data }) => setUsers(data.users))
      .catch((error) => toast.error(getErrorMessage(error)));
  }, []);

  return (
    <DashboardLayout title="Users" admin>
      <h4 className="page-title mb-4">Users ({users.length})</h4>

      <div className="card-box p-0 table-responsive">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td className="fw-medium">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <span className={`status-badge ${u.role === 1 ? "" : "Paid"}`}>
                    {u.role === 1 ? "Admin" : "Customer"}
                  </span>
                </td>
                <td>{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Users;
