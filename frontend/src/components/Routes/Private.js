import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/auth";
import Spinner from "../Spinner";

// protects user pages, and admin pages when adminOnly is passed
export default function PrivateRoute({ adminOnly = false }) {
  const [auth] = useAuth();
  const location = useLocation();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!auth?.token) {
      setStatus("denied");
      return;
    }
    const url = adminOnly ? "/api/v1/auth/admin-auth" : "/api/v1/auth/user-auth";
    axios
      .get(url)
      .then(() => setStatus("ok"))
      .catch(() => setStatus("denied"));
  }, [auth?.token, adminOnly]);

  if (status === "checking") return <Spinner />;

  if (status === "denied") {
    // logged in users without admin rights go home, everyone else to login
    return auth?.token ? (
      <Navigate to="/" replace />
    ) : (
      <Navigate to="/login" state={location.pathname} replace />
    );
  }

  return <Outlet />;
}
