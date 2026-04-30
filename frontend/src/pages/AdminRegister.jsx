import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

const AdminRegisterModal = ({ onRegister }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/admin/register`, formData);

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      if (onRegister) onRegister(res.data.admin);

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-center items-center px-4">

      {/* Modal */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl text-white">

        {/* Close */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-4 text-gray-400 text-xl hover:text-yellow-500 transition"
        >
          &times;
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin <span className="text-yellow-500">Register</span>
        </h2>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full pl-10 pr-3 py-2 bg-black/40 border border-yellow-500/20 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="w-full pl-10 pr-3 py-2 bg-black/40 border border-yellow-500/20 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="w-full pl-10 pr-3 py-2 bg-black/40 border border-yellow-500/20 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm Password"
              className="w-full pl-10 pr-3 py-2 bg-black/40 border border-yellow-500/20 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-2 rounded-full font-semibold hover:bg-yellow-600 transition shadow-md"
          >
            Register
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-gray-400">
            Already registered?{" "}
            <Link to="/admin/login" className="text-yellow-500 hover:underline">
              Login
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
};

export default AdminRegisterModal;