import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false); 
  }, []);

  const login = (userData, token) => {
    const userWithToken = { ...userData, _id: userData._id, token };
    setUser(userWithToken);
    localStorage.setItem("user", JSON.stringify(userWithToken));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateDocumentStatus = (docType, status) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      [docType]: { ...user[docType], status },
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const updateDocumentFile = (docType, file) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      [docType]: { ...user[docType], filename: file.name, status: "Pending" },
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const updateUser = (newData) => {
    if (!user) return;
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,         
        login,
        logout,
        updateDocumentStatus,
        updateDocumentFile,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
