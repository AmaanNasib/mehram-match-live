import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  
  console.log("PrivateRoute - Token:", token);
  console.log("PrivateRoute - UserId:", userId);
  
  // Allow access if token exists OR if userId exists (for Google sign up)
  if (token || userId) {
    console.log("PrivateRoute - Access granted");
    return children;
  } else {
    console.log("PrivateRoute - Redirecting to login");
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
