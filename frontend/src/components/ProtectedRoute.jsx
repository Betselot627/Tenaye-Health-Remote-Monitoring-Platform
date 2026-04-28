import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // In dev mode, skip auth check so you can test pages directly
  if (import.meta.env.DEV) return children;

  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
