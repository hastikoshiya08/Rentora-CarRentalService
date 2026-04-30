import React, { createContext, useState, useContext, useEffect } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); 

  // Load admin from localStorage on mount
  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) setAdmin(JSON.parse(savedAdmin));
    setLoading(false); // done loading
  }, []);

  // Admin login
  const login = (adminData, token) => {
    const adminWithToken = { ...adminData, _id: adminData._id, token };
    setAdmin(adminWithToken);
    localStorage.setItem("admin", JSON.stringify(adminWithToken));
  };

  // Admin logout
  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  // Update admin profile if needed
  const updateAdmin = (newData) => {
    if (!admin) return;
    const updatedAdmin = { ...admin, ...newData };
    setAdmin(updatedAdmin);
    localStorage.setItem("admin", JSON.stringify(updatedAdmin));
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        loading, 
        login,
        logout,
        updateAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
