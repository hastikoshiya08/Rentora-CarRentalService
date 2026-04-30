import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

const RegisterAdmin = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Fetch all admins on mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/all`);
      setAdmins(data);
    } catch (err) {
      console.error("Error fetching admins", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Minimum 6 characters.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setSuccessMsg("");

    if (Object.keys(validationErrors).length === 0) {
      try {
        if (editIndex !== null) {
          // Update admin (optional future feature)
          setEditIndex(null);
        } else {
          await axios.post(`${API_URL}/admin/register`, formData);
          setSuccessMsg("Admin registered successfully!");
          fetchAdmins(); // refresh list
        }

        setFormData({ fullName: "", email: "", password: "" });
      } catch (err) {
        setErrors({ api: err.response?.data?.msg || "Error registering admin" });
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/admin/${id}`);
      fetchAdmins();
    } catch (err) {
      console.error("Error deleting admin", err);
    }
  };

  return (
    <div className="px-4 md:px-8">
      {/* Hide entire admin section on small screens */}
      <div className="block md:hidden text-center py-10 text-gray-600">
        Sorry, admin section is not available on mobile devices.
      </div>

      <div className="hidden md:block">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Register Admin</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name */}
            <div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
              <div className="min-h-[1.25rem] mt-1">
                {errors.fullName && (
                  <p className="text-red-600 text-sm">{errors.fullName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
              <div className="min-h-[1.25rem] mt-1">
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
              <span
                className="absolute right-3 top-5 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              <div className="min-h-[1.25rem] mt-1">
                {errors.password && (
                  <p className="text-red-600 text-sm">{errors.password}</p>
                )}
              </div>
            </div>
          </div>

          {errors.api && <p className="text-red-600">{errors.api}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              {editIndex !== null ? "Update Admin" : "Register"}
            </button>
          </div>

          {/* Reserved space for success message */}
          <div className="h-6 mt-4 text-center transition-all duration-300 ease-in-out">
            {successMsg && (
              <p className="text-green-600 font-medium">{successMsg}</p>
            )}
          </div>
        </form>

        {/* Admin List */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Registered Admins
          </h2>
          {admins.length === 0 ? (
            <p className="text-gray-500">No admins registered yet.</p>
          ) : (
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => (
                  <tr key={admin._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{admin.fullName}</td>
                    <td className="p-2 border">{admin.email}</td>
                    <td className="p-2 border flex gap-2">
                      {/* Delete admin */}
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterAdmin;
