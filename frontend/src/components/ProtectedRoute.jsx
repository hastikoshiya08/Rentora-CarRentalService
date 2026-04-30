// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // While checking localStorage, show nothing or a loader
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    // User not logged in → redirect
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
