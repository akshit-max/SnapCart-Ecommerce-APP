import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUsers, FiSearch, FiShield, FiUserCheck, FiMail, FiPhone } from "react-icons/fi";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import Spinner from "../../components/Spinner";
import { formatDate, getErrorMessage } from "../../utils/helpers";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/v1/auth/all-users")
      .then(({ data }) => setUsers(data.users))
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search)
  );

  return (
    <DashboardLayout title="Customer Database - SnapCart" admin>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Customer Database ({users.length})</h4>
          <p className="text-muted small mb-0">Registered accounts, administrative roles, and verification status.</p>
        </div>
        <div className="p-2 rounded-3 bg-info-subtle text-info">
          <FiUsers size={22} />
        </div>
      </div>

      {/* Search Input */}
      <div className="card-box p-3 mb-4">
        <div className="position-relative">
          <FiSearch
            className="position-absolute text-muted"
            style={{ left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}
          />
          <input
            type="text"
            className="form-control ps-5"
            placeholder="Search by customer name, email address, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-5">
          <Spinner />
        </div>
      ) : (
        <div className="card-box p-0 table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Customer Profile</th>
                <th>Contact Details</th>
                <th>Access Level</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted small">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const initial = u.name ? u.name[0].toUpperCase() : "U";
                  return (
                    <tr key={u._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              background: u.role === 1 ? "var(--brand-gradient)" : "#e2e8f0",
                              color: u.role === 1 ? "#fff" : "#334155",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            {initial}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{u.name}</div>
                            <span className="small text-muted font-monospace" style={{ fontSize: "11px" }}>
                              ID: {u._id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="small text-dark d-flex align-items-center gap-1 mb-1">
                          <FiMail size={12} className="text-muted" /> {u.email}
                        </div>
                        <div className="small text-muted d-flex align-items-center gap-1">
                          <FiPhone size={12} className="text-muted" /> {u.phone || "No phone"}
                        </div>
                      </td>
                      <td>
                        {u.role === 1 ? (
                          <span className="badge bg-primary text-white fw-bold px-2 py-1 d-inline-flex align-items-center gap-1">
                            <FiShield size={12} /> Administrator
                          </span>
                        ) : (
                          <span className="badge bg-success-subtle text-success fw-bold px-2 py-1 d-inline-flex align-items-center gap-1">
                            <FiUserCheck size={12} /> Customer
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="small text-muted">{formatDate(u.createdAt)}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Users;
