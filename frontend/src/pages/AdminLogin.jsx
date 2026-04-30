import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { Mail, Lock } from "lucide-react";

const AdminLogin = ({ onClose }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) onClose();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post(`${API_URL}/admin/login`, {
        email,
        password,
      });

      login(data.admin, data.token);
      if (onClose) onClose();
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-center items-center px-4">

      {/* Modal */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl text-white">

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-gray-400 text-xl hover:text-yellow-500 transition"
        >
          &times;
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin <span className="text-yellow-500">Login</span>
        </h2>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-black/40 border border-yellow-500/20 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-black/40 border border-yellow-500/20 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-2 rounded-full font-semibold hover:bg-yellow-600 transition shadow-md"
          >
            Login
          </button>
        </form>

        {/* Footer note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Secure admin access only
        </p>

      </div>
    </div>
  );
};

export default AdminLogin;