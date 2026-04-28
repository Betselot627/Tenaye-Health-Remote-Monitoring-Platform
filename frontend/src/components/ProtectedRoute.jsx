import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const roleHome = {
  admin: "/admin",
  doctor: "/doctor",
  patient: "/patient",
};

export default function ProtectedRoute({ children, allowedRoles, guestOnly }) {
  const [status, setStatus] = useState("loading");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus("unauthenticated");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Token verification failed");
        }

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
  }, []);

  if (status === "loading") {
    return null;
  }

  if (guestOnly) {
    return status === "authenticated" ? (
      <Navigate to={roleHome[userRole] || "/login"} replace />
    ) : (
      children
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(userRole)) {
    return <Navigate to={roleHome[userRole] || "/login"} replace />;
  }

  return children;
}
