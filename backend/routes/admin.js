const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ msg: "Admin already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({ fullName, email, password: hashedPassword });
    await newAdmin.save();

    const token = jwt.sign({ id: newAdmin._id, email: newAdmin.email }, "YOUR_SECRET_KEY", { expiresIn: "7d" });
    res.status(201).json({ admin: newAdmin, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) return res.status(400).json({ msg: "All fields are required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: "Invalid credentials | email does not exist" });

    if (!admin.password) {
      return res.status(500).json({ msg: "Admin password not set" });
    }
    

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials | password does not match" });

//     const token = jwt.sign(
//       { id: admin._id, email: admin.email },
//       process.env.JWT_SECRET || "YOUR_SECRET_KEY",
//       { expiresIn: "7d" }
//     );

//     res.status(200).json({ admin, token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server Error" });
//   }
// });

const token = jwt.sign(
          {
            id: admin._id,
            email: admin.email,
            role: "admin",
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

res.json({
          admin: {
            _id: admin._id,
            fullName: admin.fullName,
            email: admin.email,
            role: "admin",
          },
          token,
        });
      } catch (err) {
        res.status(500).json({ msg: "Server Error" });
      }
    });

// Get all admins
router.get("/all", async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;