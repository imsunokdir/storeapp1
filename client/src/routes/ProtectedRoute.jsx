import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotAuthorized from "../pages/NotAuthorized";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuth, user } = useContext(AuthContext);

  if (!isAuth) {
    // Not logged in: redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log("user.role:", user.role);
    // Role not authorized: show not authorized message
    return <NotAuthorized />;
  }

  // Authorized: render child routes
  return <Outlet />;
};

export default ProtectedRoute;
