const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const User = require("../models/user");
const Variant = require("../models/variant");
const Notification = require("../models/notification"); 
const authMiddleware = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");

router.get("/all", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone")
      .populate("variant", "name company") 
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; 

    const bookings = await Booking.find({ user: userId })
      .populate("user", "name email phone")
      .populate("variant", "name company image")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);

  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone")
      .populate("variant", "name company image");

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

router.put("/cancel/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user")
      .populate("variant");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "Cancelled") {
      return res.json({ message: "Already cancelled" });
    }

    booking.status = "Cancelled";
    await booking.save();

    await sendEmail({
      to: booking.user.email,
      subject: "Booking Cancelled",
      text: `Hello ${booking.user.name}, your booking has been cancelled.`,
    });

    await Notification.create({
      user: booking.user._id,
      message: `${booking.user.name}, your booking has been cancelled ❌`,
      link: "/mybookings"
    });

    res.json({ message: "Booking cancelled & notification sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/admin/status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.approvalStatus = status;

    if (status === "Rejected") {
      booking.status = "Cancelled";

      if (booking.paymentStatus === "Paid") {
        booking.refundStatus = "Pending";
      }
    }

    await booking.save();

    await Notification.create({
      user: booking.user._id,
      message: `${booking.user.name}, your booking has been ${status}`,
      link: "/mybookings"
    });

    console.log("🔔 Notification saved in DB");

    res.json({ message: "Updated", booking });

  } catch (err) {
    console.error("STATUS ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/admin/refund/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.paymentStatus !== "Paid") {
      return res.status(400).json({ message: "Not eligible" });
    }

    if (booking.paymentStatus === "Refunded") {
      return res.status(400).json({ message: "Already refunded" });
    }

    // ✅ UPDATE BOOKING
    booking.paymentStatus = "Refunded";
    booking.status = "Cancelled";
    booking.refundStatus = "Completed";
    booking.refundDate = new Date();
    booking.refundAmount = booking.totalPrice;

    await booking.save();

    // =========================
    // ✅ SEND EMAIL HERE
    // =========================
    await sendEmail(
      booking.user.email,
      "Refund Processed Successfully 💰",
      `
        <h2>Hello ${booking.user.name},</h2>
        <p>Your refund has been successfully processed.</p>
        <p><strong>Amount:</strong> ₹${booking.refundAmount}</p>
        <p>Thank you for using our service.</p>
      `
    );

    console.log("📧 Refund email sent");

    // =========================
    // ✅ SAVE NOTIFICATION
    // =========================
    await Notification.create({
      user: booking.user._id,
      message: `${booking.user.name}, your refund has been processed 💰`,
      link: "/mybookings"
    });

    console.log("🔔 Refund notification saved");

    res.json({ message: "Refund success + email sent", booking });

  } catch (err) {
    console.error("REFUND ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
});

// ==========================
//  DELETE BOOKING
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;