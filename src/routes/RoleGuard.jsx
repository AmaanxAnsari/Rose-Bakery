import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RoleGuard({ roles = [], children }) {
  const userRoles = useSelector((s) => s.auth.roles);

  if (!userRoles.some((r) => roles.includes(r))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
