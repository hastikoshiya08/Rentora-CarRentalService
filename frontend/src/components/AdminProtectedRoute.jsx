import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminProtectedRoute = ({ children }) => {
 const { isAuthenticated, loading } = useAdminAuth();

  if (loading) return null; 
  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  return children;
};

export default AdminProtectedRoute;
