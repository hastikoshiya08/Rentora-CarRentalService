import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Mail, Phone, Lock, Upload } from "lucide-react";
import {Eye, EyeOff, CheckCircle, XCircle , Info } from "lucide-react";

const RegisterModal = ({ onRegister }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    drivingLicence: null,
    aadhaar: null,
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  //const [confirmError, setConfirmError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 12) {
      return "Password must be 8 to 12 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Must include at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Must include at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Must include at least one number";
    }
    if (!/[@$!%*?&.()/^]/.test(password)) {
      return "Must include one special character";
    }
    return ""; //  valid
  };

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleFileValidation = (e) => {
    const file = e.target.files[0];

    if (file && file.size > 10 * 1024 * 1024) {
      setError("File must be under 10MB");
      e.target.value = "";
      return;
    }

    setFormData({ ...formData, [e.target.name]: file });
  };

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedForm);

    // 🔐 PASSWORD VALIDATION 👉 ADD HERE
    if (name === "password") {
      const errorMsg = validatePassword(value);
      setPasswordError(errorMsg);
    }

    // Confirm password validation
    if (
      (name === "password" || name === "confirmPassword") &&
      updatedForm.confirmPassword
    ) {
      if (updatedForm.password !== updatedForm.confirmPassword) {
        setConfirmError("Passwords do not match");
      } else {
        setConfirmError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const res = await axios.post(`${API_URL}/auth/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (onRegister) onRegister(res.data.user);

      navigate(from);
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-center items-center px-4">

      {/* Modal */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl text-white">

        {/* Close */}
        <button
          onClick={() => navigate(from)}
          className="absolute top-3 right-4 text-gray-400 text-xl hover:text-yellow-500 transition"
        >
          &times;
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create <span className="text-yellow-500">Account</span>
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
              name="name"
              value={formData.name}
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

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Phone Number"
              pattern="[6-9]{1}[0-9]{9}"
              maxLength="10"
              className="w-full pl-10 pr-3 py-2 bg-black/40 border border-yellow-500/20 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>

          {/* Password */}
          {/* <div className="relative">
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
          </div> */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className={`w-full pl-10 pr-10 py-2 bg-black/40 border rounded-md text-white placeholder-gray-400 focus:ring-2 outline-none
                ${
                  formData.confirmPassword
                    ? formData.password === formData.confirmPassword
                      ? "border-green-500 focus:ring-green-500"
                      : "border-red-500 focus:ring-red-500"
                    : "border-yellow-500/20 focus:ring-yellow-500"
                }`}  
            />

            {passwordError && (
              <div className="relative group mt-1">
                <Info className="text-red-400 cursor-pointer" size={16} />

                {/* Tooltip */}
                <div className="absolute left-5 top-0 hidden group-hover:block bg-black text-red-400 text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                  {passwordError}
                </div>
              </div>
            )}

            {/* 👁 Eye */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Confirm Password */}
          {/* <div className="relative mt-3">
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
            {confirmError && (
              <p className="text-red-400 text-sm mt-1">
                {confirmError}
              </p>
            )}
          </div> */}
          <div className="relative mt-3">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm Password"
              className={`w-full pl-10 pr-16 py-2 bg-black/40 border rounded-md text-white placeholder-gray-400 focus:ring-2 outline-none
                ${
                  formData.confirmPassword
                    ? formData.password === formData.confirmPassword
                      ? "border-green-500 focus:ring-green-500"
                      : "border-red-500 focus:ring-red-500"
                    : "border-yellow-500/20 focus:ring-yellow-500"
                }`}
            />

            {/* 👁 Eye */}
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-8 top-2.5 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

            {/* ✔ / ❌ Icon */}
            {formData.confirmPassword && (
              <div className="absolute right-2 top-2.5">
                {formData.password === formData.confirmPassword ? (
                  <CheckCircle className="text-green-400" size={18} />
                ) : (
                  <XCircle className="text-red-400" size={18} />
                )}
              </div>
            )}
            {formData.confirmPassword && (
              <p
                className={`text-xs mt-1 ${
                  formData.password === formData.confirmPassword
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {formData.password === formData.confirmPassword
                  ? "Passwords match ✔"
                  : "Passwords do not match ❌"}
              </p>
            )}
          </div>

          {/* Driving Licence */}
          <div>
            <label className="text-sm text-gray-400 flex items-center gap-2 mb-1">
              <Upload size={16}/> Driving Licence
            </label>
            <input
              type="file"
              name="drivingLicence"
              required
              onChange={handleFileValidation}
              className="w-full text-sm bg-black/40 border border-yellow-500/20 rounded-md file:bg-yellow-500 file:text-black file:px-3 file:py-1 file:border-0 hover:file:bg-yellow-600"
            />
          </div>

          {/* Aadhaar */}
          <div>
            <label className="text-sm text-gray-400 flex items-center gap-2 mb-1">
              <Upload size={16}/> Aadhaar Card
            </label>
            <input
              type="file"
              name="aadhaar"
              required
              onChange={handleFileValidation}
              className="w-full text-sm bg-black/40 border border-yellow-500/20 rounded-md file:bg-yellow-500 file:text-black file:px-3 file:py-1 file:border-0 hover:file:bg-yellow-600"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black py-2 rounded-full font-semibold hover:bg-yellow-600 transition shadow-md disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Login */}
          <p className="text-center text-sm text-gray-400">
            Already registered?{" "}
            <Link
              to="/login"
              state={{ from }}
              className="text-yellow-500 hover:underline"
            >
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default RegisterModal;