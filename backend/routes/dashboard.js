const express = require("express");
const Booking = require("../models/booking");
const Variant = require("../models/variant");
const router = express.Router();


//  DASHBOARD STATS
router.get("/stats", async (req, res) => {
  try {
    //  TOTAL BOOKINGS
    const totalBookings = await Booking.countDocuments();

    //  GET ALL BOOKINGS (REMOVED STRICT FILTER ❌)
    const bookings = await Booking.find();

    //  REVENUE CALCULATION (SAFE)
    const revenue = bookings.reduce((sum, b) => {
      return sum + (b.totalPrice || 0); // ⚠️ make sure totalPrice exists
    }, 0);

    //  GET ALL VARIANTS
    const variants = await Variant.find();

    let totalCars = 0;

    variants.forEach((v) => {
      if (Array.isArray(v.vehicles)) {
  totalCars += v.vehicles.length;
}
    });

    // console.log("🚗 Total Cars 👉", totalCars);

    //  RENTED CARS (Upcoming bookings = active rentals)
    const rentedCars = await Booking.countDocuments({
      status: "Upcoming",
    });

    //  AVAILABLE CARS (simplified logic)
    const availableCars = totalCars;

    //  FINAL RESPONSE
    res.json({
      revenue,
      totalBookings,
      rentedCars,
      availableCars,
    });

  } catch (err) {
    console.error("❌ Dashboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//  Weekly bookings
router.get("/weekly-bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = [0, 0, 0, 0, 0, 0, 0];

    bookings.forEach((b) => {
      const day = new Date(b.createdAt).getDay();
      result[day]++;
    });

    const formatted = days.map((day, i) => ({
      day,
      value: result[i],
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Category data
router.get("/category-data", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("variant");

    const counts = {};

    bookings.forEach((b) => {
      const category = b.variant?.category || "Other";
      counts[category] = (counts[category] || 0) + 1;
    });

    const result = Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;