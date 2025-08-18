import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const HomeRedirect = () => {
  const { user, loading } = useContext(AuthContext);

  //   if (loading) {
  //     return <div>Loading...</div>; // or spinner
  //   }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in - redirect based on role

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "store_owner":
      return <Navigate to="/store/dashboard" replace />;
    case "normal_user":
      return <Navigate to="/user/dashboard" replace />;
    default:
      // Fallback: send to login or somewhere else
      return <Navigate to="/login" replace />;
  }
};

export default HomeRedirect;
