import React, { useEffect, useState } from "react";
import axios from "axios";
import generateInvoice from "../utils/generateInvoice";

const MyBookings = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [bookings, setBookings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        return;
      }

      const res = await axios.get(`${API_URL}/bookings/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const uniqueBookings = [];
      const seen = new Set();

      res.data.forEach((b) => {
        const key = `${b.variant?._id}-${b.fromDate}-${b.toDate}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueBookings.push(b);
        }
      });

      console.log("BOOKINGS:", res.data);

      setBookings(uniqueBookings);

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await axios.put(`${API_URL}/bookings/cancel/${id}`);
      alert("Booking Cancelled");
      fetchBookings();
    } catch (err) {
      console.log(err);
    }
  };

  //  INVOICE
const handleInvoice = (b) => {
  const bookingData = {
    id: b.paymentId,

    //  USER DETAILS
    customer: b.user?.name,
    phone: b.user?.phone,        // ADD
    email: b.user?.email,        // ADD

    //  CAR DETAILS
    carVariant: `${b.variant?.company} ${b.variant?.name}`,

    //  DATE DETAILS
    fromDate: b.fromDate,
    toDate: b.toDate,
    totalDays:
      Math.ceil(
        (new Date(b.toDate) - new Date(b.fromDate)) /
        (1000 * 60 * 60 * 24)
      ) + 1,

    //  PAYMENT
    price: b.totalPrice,
    paymentStatus: b.paymentStatus,
    approvalStatus: b.approvalStatus,   //  ADD

    //  TIME
    bookingTime: new Date(b.createdAt).toLocaleString(),
  };

  generateInvoice(bookingData);
};

  //  STATUS LOGIC
  const getStatus = (b) => {
    const today = new Date();
    const from = new Date(b.fromDate);
    const to = new Date(b.toDate);

    if (b.status === "Cancelled") return "Cancelled";
    if (to < today) return "Completed";
    if (from >= today) return "Upcoming";
    return "Ongoing";
  };

  const filteredBookings = bookings.filter((b) => {
    if (selectedFilter === "All") return true;
    const status = getStatus(b);
    return status === selectedFilter;
  });

  return (
    <div className="max-w-6xl mx-auto mt-20 px-4 space-y-6 text-white">

      <h1 className="text-3xl font-bold text-center text-yellow-500">
        My Bookings
      </h1>

      {/* FILTER */}
      <div className="flex justify-center gap-3 flex-wrap">
        {["All", "Upcoming", "Completed", "Cancelled"].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-5 py-2 rounded-full ${
              selectedFilter === filter
                ? "bg-yellow-500 text-black"
                : "bg-gray-700 text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* LIST */}
      {filteredBookings.length === 0 ? (
        <p className="text-center text-white/50">
          No bookings found
        </p>
      ) : (
        filteredBookings.map((b) => {
          console.log("FULL BOOKING:", b);
          console.log("VARIANT:", b.variant);
          console.log("IMAGE:", b.variant?.image);

          console.log("API_URL:", API_URL);
        return(
          <div key={b._id} className="flex gap-4 bg-black p-4 rounded-xl">
          
          
            {/* IMAGE */}
            <img
              src={
                b.variant?.image
                  ? `${BASE_URL}${b.variant.image.replace("undefined", "")}`
                  : "/default.png"
              }
              className="w-40 h-28 object-cover rounded"
            />

            {/* DETAILS */}
            <div className="flex-1">

              <h2 className="text-yellow-400 font-bold">
                {b.variant?.company} {b.variant?.name}
              </h2>

              <p>ID: {b.paymentId}</p>
              <p>₹{b.totalPrice}</p>
              <p>{b.user?.name}</p>

              <p>
                {new Date(b.fromDate).toLocaleDateString()} →{" "}
                {new Date(b.toDate).toLocaleDateString()}
              </p>

            {/* PAYMENT */}
                <p
                  className={`text-sm font-semibold ${
                    b.paymentStatus === "Paid"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  Payment: {b.paymentStatus}
                </p>

                {/* STATUS */}
                <p
                  className={`text-sm font-semibold ${
                    getStatus(b) === "Upcoming"
                      ? "text-yellow-400"
                      : getStatus(b) === "Completed"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  Status: {getStatus(b)}
                </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-2">

              {getStatus(b) === "Upcoming" && (
                <button
                  onClick={() => handleCancel(b._id)}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Cancel
                </button>
              )}

              <button
                onClick={() => handleInvoice(b)}
                className="bg-yellow-500 px-3 py-1 rounded text-black"
              >
                Invoice
              </button>

            </div>

          </div>
        )
        })
      )}
    </div>
  );
};

export default MyBookings;