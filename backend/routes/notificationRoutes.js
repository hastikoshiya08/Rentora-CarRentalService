const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");

router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.params.userId
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    res.json(notification);
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;