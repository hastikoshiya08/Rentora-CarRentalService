import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, UploadCloud } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const UserProfile = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState({ drivingLicence: false, aadhaar: false });
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Fetch bookings for logged-in user
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?._id) return;

      try {
        setLoadingBookings(true);
        const token = localStorage.getItem("token");

          const { data } = await axios.get(
            `${API_URL}/bookings/user`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("FRESH USER:", data.user);
        updateUser(data.user);
      } catch (err) {
        console.error(err);
      }
    };

    if (user?.token) fetchUser();
  }, []); // ✅ EMPTY DEPENDENCY

  if (!user) return <div className="text-center mt-20 text-gray-600">Loading...</div>;

  const { name, email, phone } = user;

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  const handleReupload = async (docType, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading((prev) => ({ ...prev, [docType]: true }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.patch(
        `${API_URL}/auth/user/upload/${docType}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      updateUser(data.user);
      alert(`${docType} uploaded successfully!`);
    } catch (err) {
      console.error("Upload error:", err.response?.data || err);
      alert(err.response?.data?.msg || "Upload failed. Try again.");
    } finally {
      setLoading((prev) => ({ ...prev, [docType]: false }));
    }
  };


 return (
  <div className="w-full min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-black flex justify-center items-start py-16 px-4">
    

    <div className="w-full max-w-6xl bg-white/5 backdrop-blur-xl border border-yellow-500/20 shadow-[0_0_40px_rgba(234,179,8,0.1)] rounded-2xl px-6 sm:px-10 py-8 space-y-8">

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left sm:space-x-6 space-y-4 sm:space-y-0">

        <div className="w-16 h-16 rounded-full bg-yellow-500 text-black flex items-center justify-center text-2xl font-bold shadow-lg shadow-yellow-500/30">
          {getInitial(name)}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">{name}</h2>
          <p className="text-white/60 break-words">{email}</p>
          <p className="text-white/60 break-words">+91-{phone}</p>
        </div>
      </div>

      <hr className="border-yellow-500/20" />

      {/* Documents Section */}
      <div className="space-y-5">
        {["drivingLicence", "aadhaar"].map((doc) => (
          <div
            key={doc}
            className="flex justify-between items-center bg-white/5 hover:bg-white/10 transition p-4 rounded-xl border border-yellow-500/10 shadow-sm"
          >

            <div>
              <p className="font-medium text-white tracking-wide">
                {doc === "drivingLicence" ? "Driving Licence" : "Aadhaar Card"}
              </p>
              <p className="text-xs text-white/50 truncate max-w-xs">
                {user[doc]?.filename || "No file uploaded"}
              </p>
            </div>

            <div className="flex items-center gap-3">

              {user[doc]?.status === "Approved" ? (
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <CheckCircle className="h-5 w-5" />
                  Approved
                </div>

              ) : user[doc]?.status === "Rejected" ? (
                <>
                  <label className="flex items-center gap-1 text-yellow-400 text-sm hover:text-yellow-300 cursor-pointer">
                    {loading[doc] ? "Uploading..." : "Re-upload"}
                    <UploadCloud className="h-5 w-5" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleReupload(doc, e)}
                    />
                  </label>

                  <XCircle className="text-red-400 h-5 w-5" />
                </>

              ) : (
                <span className="text-white/50 text-sm">Pending</span>
              )}

            </div>

          </div>
        ))}
      </div>

      <hr className="border-yellow-500/20" />

      {/* Booking History */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-6 text-center text-white tracking-wide">
          Booking History
        </h3>

        {loadingBookings ? (
          <p className="text-white/50 text-sm text-center">Loading bookings...</p>

        ) : bookings.length === 0 ? (
          <p className="text-white/50 text-sm text-center">No bookings found.</p>

        ) : (
          <div className="grid sm:grid-cols-2 gap-4">

            {bookings.map((booking, index) => (
              <div
                key={booking._id || index}
                className="bg-white/5 border border-yellow-500/10 rounded-xl p-4 hover:bg-white/10 hover:shadow-yellow-500/10 transition-all duration-300"
              >

                <p className="text-base font-semibold text-yellow-400">
                  {booking.variant?.company} {booking.variant?.name}
                </p>

                <p className="text-sm text-white/70 mt-1">
                  {new Date(booking.fromDate).toLocaleDateString()} →{" "}
                  {new Date(booking.toDate).toLocaleDateString()}
                </p>

                <p className="text-sm text-white mt-1">
                  ₹{booking.totalPrice}
                </p>

                <p className="text-xs text-white/50 mt-1">
                  Status: {booking.status}
                </p>

              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  </div>
);
}

export default UserProfile;
