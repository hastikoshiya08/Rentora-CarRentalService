import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LogOut,
  Plus,
  Car,
  ClipboardList,
  Users,
  LayoutDashboard,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const adminName = admin?.fullName || "Admin";
  const firstLetter = adminName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Warning */}
      <div className="lg:hidden min-h-screen flex items-center justify-center px-6 text-center bg-black text-white">
        <p className="text-lg text-gray-400 italic">
          Admin panel is available only on desktop.
        </p>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block bg-black text-white">

        {/* 🔝 Navbar */}
        <header className="fixed top-0 left-0 w-full h-16 bg-black/80 backdrop-blur-lg border-b border-yellow-500/20 z-50 flex items-center justify-between px-6">

          <h1 className="text-xl font-bold">
            Admin <span className="text-yellow-500">Panel</span>
          </h1>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold">
              {firstLetter}
            </div>
            <span className="text-gray-300">Hi, {adminName}</span>
          </div>
        </header>

        {/* Sidebar */}
        <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-black border-r border-yellow-500/20 p-4">

          <nav className="flex flex-col gap-3 text-sm mt-2">

            {/* Dashboard */}
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-yellow-500 text-black font-semibold"
                    : "text-gray-400 hover:bg-yellow-500/10 hover:text-yellow-500"
                }`
              }
            >
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>

            {/* Add Variants */}
            <NavLink
              to="/admin/add-variants"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-yellow-500 text-black font-semibold"
                    : "text-gray-400 hover:bg-yellow-500/10 hover:text-yellow-500"
                }`
              }
            >
              <Plus size={18} /> Add Variants
            </NavLink>

            {/* Variants */}
            <NavLink
              to="/admin/variants"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-yellow-500 text-black font-semibold"
                    : "text-gray-400 hover:bg-yellow-500/10 hover:text-yellow-500"
                }`
              }
            >
              <Car size={18} /> Variants
            </NavLink>

            {/* Bookings */}
            <NavLink
              to="/admin/bookings"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-yellow-500 text-black font-semibold"
                    : "text-gray-400 hover:bg-yellow-500/10 hover:text-yellow-500"
                }`
              }
            >
              <ClipboardList size={18} /> Bookings
            </NavLink>

            {/* Customers */}
            <NavLink
              to="/admin/customers"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-yellow-500 text-black font-semibold"
                    : "text-gray-400 hover:bg-yellow-500/10 hover:text-yellow-500"
                }`
              }
            >
              <Users size={18} /> Customers
            </NavLink>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-red-400 hover:bg-red-500/10 transition text-left"
            >
              <LogOut size={18} /> Logout
            </button>

          </nav>
        </aside>

        {/* Main */}
        <main className="ml-64 pt-20 p-6 bg-black min-h-screen overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </>
  );
};

export default AdminLayout;