import React from "react";
import { Link } from "react-router-dom";

const NotAuthorized = () => {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1 style={{ fontSize: 48, marginBottom: 20, color: "#e63946" }}>
        403 - Not Authorized
      </h1>
      <p style={{ fontSize: 18, marginBottom: 30 }}>
        Sorry, you do not have permission to access this page.
      </p>
      <Link
        to="/login"
        style={{
          padding: "10px 20px",
          backgroundColor: "#1d3557",
          color: "#fff",
          textDecoration: "none",
          borderRadius: 4,
        }}
      >
        Go to Login
      </Link>
    </div>
  );
};

export default NotAuthorized;
