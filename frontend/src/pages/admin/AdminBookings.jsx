import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminBookings = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null); //  for button loading

  //  FETCH BOOKINGS
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const { data } = await axios.get(`${API_URL}/bookings/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  //  APPROVE / REJECT
  const updateStatus = async (id, status) => {
    try {
      setLoadingId(id);

      await axios.put(`${API_URL}/bookings/admin/status/${id}`, { status });

      await fetchBookings(); //  refresh

      setLoadingId(null);
    } catch (err) {
      console.log(err);
      setLoadingId(null);
    }
  };

  //  REFUND ( FIXED API URL + SINGLE CLICK)
const handleRefund = async (id) => {
  try {
    setLoadingId(id);

    await axios.put(`${API_URL}/bookings/admin/refund/${id}`);

    await fetchBookings();

    setLoadingId(null);
  } catch (err) {
    console.error("REFUND ERROR:", err);
    setLoadingId(null);
  }
};

  // 🗑 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      await axios.delete(`${API_URL}/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 bg-black">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="px-8 py-8 bg-black min-h-screen text-white">

      <h2 className="text-2xl font-bold mb-6">
        All <span className="text-yellow-500">Bookings</span>
      </h2>

      <div className="overflow-x-auto border border-yellow-500/20 rounded-xl">
        <table className="min-w-full text-sm">

          <thead className="bg-black text-gray-400 border-b border-yellow-500/20">
            <tr>
              <th className="px-6 py-4 text-left">Booking ID</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Variant</th>
              <th className="px-6 py-4 text-left">Vehicle</th>
              <th className="px-6 py-4 text-left">Dates</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Payment</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-400">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((b, i) => (
                <tr
                  key={b._id}
                  className={`border-b border-yellow-500/10 ${
                    i % 2 === 0 ? "bg-black" : "bg-[#111]"
                  } hover:bg-[#1a1a1a] transition`}
                >

                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {b._id.slice(-6)}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {b.user?.name || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    {b.variant?.name || "N/A"}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    {b.vehicleRegNo || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(b.fromDate).toLocaleDateString()} -{" "}
                    {new Date(b.toDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-yellow-500 font-semibold">
                    ₹{b.totalPrice}
                  </td>

                  {/* PAYMENT */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        b.paymentStatus === "Paid"
                          ? "bg-yellow-500 text-black"
                          : b.paymentStatus === "Refunded"
                          ? "bg-green-600"
                          : "bg-gray-600"
                      }`}
                    >
                      {b.paymentStatus}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        b.status === "Completed"
                          ? "bg-green-600"
                          : b.status === "Cancelled"
                          ? "bg-red-600"
                          : "bg-gray-600"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 flex flex-wrap gap-2">

                    {/*  APPROVE / REJECT */}
                    {b.approvalStatus === "Pending" && b.status === "Upcoming" && (
                      <>
                        <button
                          onClick={() => updateStatus(b._id, "Approved")}
                          disabled={loadingId === b._id}
                          className="bg-green-500 px-3 py-1 rounded text-xs"
                        >
                          {loadingId === b._id ? "..." : "Approve"}
                        </button>

                        <button
                          onClick={() => updateStatus(b._id, "Rejected")}
                          disabled={loadingId === b._id}
                          className="bg-red-500 px-3 py-1 rounded text-xs"
                        >
                          {loadingId === b._id ? "..." : "Reject"}
                        </button>
                      </>
                    )}

                    {/* 💰 REFUND */}
                    {b.status === "Cancelled" &&
                      b.paymentStatus === "Paid" &&
                      b.refundStatus !== "Completed" && (
                        <button
                          onClick={() => handleRefund(b._id)}
                          disabled={loadingId === b._id}
                          className="bg-yellow-500 text-black px-3 py-1 rounded text-xs"
                        >
                          {loadingId === b._id ? "Processing..." : "Refund"}
                        </button>
                    )}

                    {/* 🟢 REFUND DONE */}
                    {b.paymentStatus === "Refunded" && (
                      <span className="text-green-400 text-xs">
                        Refund Completed
                      </span>
                    )}

                    {/* 🗑 DELETE */}
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="bg-gray-700 px-2 py-1 rounded"
                    >
                      🗑
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminBookings;