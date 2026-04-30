const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");

// POST - save contact
router.post("/", async (req, res) => {
  try {
    console.log(" BACKEND HIT:", req.body);

    const newContact = new Contact(req.body);
    await newContact.save();

    res.status(201).json(newContact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save contact" });
  }
});

// GET - fetch contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

module.exports = router;   