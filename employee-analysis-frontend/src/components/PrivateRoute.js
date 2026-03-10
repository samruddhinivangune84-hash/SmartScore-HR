// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * PrivateRoute wraps any page/component that requires role-based access.
 * @param {ReactNode} children - The page/component to render
 * @param {Array} allowedRoles - Array of roles allowed to access
 */
function PrivateRoute({ children, allowedRoles }) {
  // Try to get the user object from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role;

  if (!role) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Logged in but role not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  // User is allowed
  return children;
}

export default PrivateRoute;