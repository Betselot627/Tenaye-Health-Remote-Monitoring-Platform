import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

const roleHome = {
  admin: "/admin",
  doctor: "/doctor",
  patient: "/patient",
};

export default function ProtectedRoute({ children, allowedRoles, guestOnly }) {
  const token = localStorage.getItem("token");

  const [status, setStatus] = useState(token ? "loading" : "unauthenticated");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.message || "Token verification failed");

        localStorage.setItem("user", JSON.stringify(data));
        setUserRole(data.role);
        setStatus("authenticated");
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setStatus("unauthenticated");
      }
    };

    verifyToken();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (guestOnly) {
    return status === "authenticated" ? (
      <Navigate to={roleHome[userRole] || "/home"} replace />
    ) : (
      children
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(userRole)) {
    return <Navigate to={roleHome[userRole] || "/home"} replace />;
  }

  return children;
}
