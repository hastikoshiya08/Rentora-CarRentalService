import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import ForgotPassword from "./ForgotPassword";

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();                                                                                                                    
  const location = useLocation();
  const { login } = useAuth();

  const [showForgot, setShowForgot] = useState(false);
                                   
  {showForgot && <ForgotPassword onClose={() => setShowForgot(false)} />}

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleClose = () => {
    if (onClose) onClose();
    navigate("/user/UserHome");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      // ✅ STORE TOKEN
      localStorage.setItem("token", data.token);

      // ✅ then call context
      login(data.user, data.token);

      if (onClose) onClose();
      navigate("/user/UserHome");
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || "Invalid credentials");
    }
  };

 return (
  <>
    {/* Forgot Modal */}
    {showForgot && (
      <ForgotPassword onClose={() => setShowForgot(false)} />
    )}

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
          Welcome <span className="text-yellow-500">Back</span>
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
              placeholder="Email"
              className="w-full pl-10 pr-3 py-2 bg-black/40 border border-yellow-500/20 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          {/* <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-3 py-2 bg-black/40 border border-yellow-500/20 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div> */}

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-2 bg-black/40 border border-yellow-500/20 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* 👁️ Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p
            className="text-right text-sm text-yellow-500 cursor-pointer hover:underline"
            onClick={() => setShowForgot(true)}
          >
            Forgot Password?
          </p>
          {/* Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-2 rounded-full font-semibold hover:bg-yellow-600 transition shadow-md"
          >
            Login
          </button>

          {/* Links */}
          <div className="text-center text-sm text-gray-400 space-y-2">
            <p>
              Don’t have an account?{" "}
              <Link
                to="/register"
                state={{ from: location.state?.from || "/" }}
                className="text-yellow-500 hover:underline"
              >
                Register
              </Link>
            </p>

            {/* <Link
              to="/admin/login"
              className="text-gray-500 hover:text-yellow-500 transition text-xs"
            >
              Admin Login
            </Link> */}
          </div>

        </form>
      </div>
    </div>
      </>
  );

};

export default LoginModal;