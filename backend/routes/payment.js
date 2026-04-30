//payment.js
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const Booking = require("../models/booking");
const User = require("../models/user");
const Variant = require("../models/variant");
const Notification = require("../models/notification");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order (amount in paise)
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

//  GET ALL BOOKINGS (User bookings)
router.get("/user", async (req, res) => {
  try {
    const bookings = await Booking.find()
     .populate("user", "name email phone")
     .populate("user", "name email phone")

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//  CANCEL BOOKING
router.put("/cancel/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.json({ message: "Booking Cancelled Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify payment & create booking
router.post("/verify", async (req, res) => {
  try {
    const { userId, variantId, fromDate, toDate, totalPrice, paymentId } = req.body;

    console.log("REQ BODY:", req.body); // debug

    const user = await User.findById(userId);
    const variant = await Variant.findById(variantId);

    if (!user || !variant) {
      return res.status(404).json({ message: "User or Variant not found" });
    }

    // ✅ CHECK VEHICLES EXIST
    if (!variant.vehicles || variant.vehicles.length === 0) {
      return res.status(400).json({ message: "No vehicles available" });
    }

    let availableVehicle;

    // ✅ KM BOOKING FIX
    if (!fromDate || !toDate) {
      console.log("KM BOOKING FLOW");

      availableVehicle = variant.vehicles[0]; // simple assign
    } else {
      console.log("DATE BOOKING FLOW");

      const bookedVehicles = await Booking.find({
        variant: variantId,
        $or: [
          { fromDate: { $lte: new Date(toDate), $gte: new Date(fromDate) } },
          { toDate: { $gte: new Date(fromDate), $lte: new Date(toDate) } },
          { fromDate: { $lte: new Date(fromDate) }, toDate: { $gte: new Date(toDate) } }
        ],
        status: { $in: ["Upcoming"] }
      }).distinct("vehicleRegNo");

      availableVehicle = variant.vehicles.find(
        v => !bookedVehicles.includes(v)
      );
    }

    if (!availableVehicle) {
      return res.status(400).json({
        message: "No vehicles available"
      });
    }

    const booking = new Booking({
      user: user._id,
      variant: variant._id,
      vehicleRegNo: availableVehicle,
      fromDate: fromDate || new Date(),
      toDate: toDate || new Date(),
      totalPrice,
      paymentStatus: "Paid",
      paymentId,
      status: "Upcoming"
    });

    await booking.save();

    await Notification.create({
      user: user._id,
      message: "Booking Confirmed 🚗",
      link: "/mybookings"
    });

    res.status(201).json(booking);

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ message: "Booking failed" });
  }
});


module.exports = router;
