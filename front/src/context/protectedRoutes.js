import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./userContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(UserContext);

  // If there's no user, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user doesn't have an allowed role, redirect to a fallback
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
