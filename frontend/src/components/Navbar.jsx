import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, User, LogOut, Car, Calendar, Bell } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  // ✅ Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/notifications/${user._id}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    fetchNotifications();
  }, [user]);

  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-black/70 border-b border-yellow-500/20 px-4 sm:px-8 py-4 flex justify-between items-center">
      
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <Car className="text-yellow-500" />
        <span className="text-lg sm:text-2xl font-bold text-white">
          <span className="text-yellow-500">Rentora</span>
        </span>
      </div>

      {/* Guest Menu */}
      {!user && (
        <div className="hidden md:flex gap-8 text-gray-300">
          {["/", "/cars", "/about", "/contact-us"].map((path, i) => (
            <Link key={i} to={path} className="hover:text-yellow-500">
              {["Home", "Cars", "About", "Contact"][i]}
            </Link>
          ))}
        </div>
      )}

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {/* 🔔 Notifications */}
        {user && (
          <div ref={notificationRef} className="relative">
            
            <button
              onClick={async () => {
                setShowNotifications(prev => !prev);
                if (!showNotifications) {
                  await fetchNotifications(); // refresh when open
                }
              }}
            >
              <Bell className="text-yellow-500 cursor-pointer" size={22} />
            </button>

            {/* 🔴 Unread Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}

            {/* Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-72 bg-black text-white shadow-lg rounded-lg border border-yellow-500/20 z-50 max-h-80 overflow-y-auto">

                {notifications.length === 0 ? (
                  <p className="p-3 text-gray-400 text-sm">
                    No notifications
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={async () => {
                        try {
                          setShowNotifications(false);

                             await fetch(
                            `http://localhost:4000/api/notifications/${notif._id}/read`,
                            { method: "PUT" }
                          );

                          // update UI instantly
                          setNotifications(prev =>
                            prev.map(n =>
                              n._id === notif._id ? { ...n, read: true } : n
                            )
                          );

                          navigate(notif.link || "/mybookings");
        
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className={`px-4 py-2 text-sm cursor-pointer transition
                        ${notif.read
                          ? "bg-black text-white"
                          : "bg-yellow-100 text-black font-semibold"}
                      `}
                    >
                      {notif.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* User Section */}
        {!user ? (
          <>
            <button
              onClick={() =>
                navigate("/register", { state: { from: location.pathname } })
              }
              className="text-gray-300 hover:text-yellow-500 text-sm"
            >
              Register
            </button>

            <button
              onClick={() =>
                navigate("/login", { state: { from: location.pathname } })
              }
              className="bg-yellow-500 text-black px-4 py-1.5 rounded-full font-semibold"
            >
              Login
            </button>
          </>
        ) : (
          <div className="relative">
            <div
              ref={profileRef}
              className="w-10 h-10 bg-yellow-500 text-black rounded-full flex items-center justify-center cursor-pointer font-bold"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Profile Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-52 bg-black border border-yellow-500/20 text-white rounded-xl shadow-xl overflow-hidden">
                
                <button
                  onClick={() => {
                    navigate("/user/UserHome");
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition"
                >
                  <Home size={16} /> Home
                </button>

                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition"
                >
                  <User size={16} /> View Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/mybookings");
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition"
                >
                  <Calendar size={16} /> View Booking
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-white/10 transition"
                >
                  <LogOut size={16} /> Logout
                </button>

              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;