const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const upload = require('../middleware/upload'); // multer instance
const path = require('path');
const authMiddleware = require("../middleware/auth")
const fs = require("fs");
const crypto = require("crypto");


// use multer fields: keys must match form-data keys from frontend
const cpUpload = upload.fields([
  { name: 'drivingLicence', maxCount: 1 },
  { name: 'aadhaar', maxCount: 1 }
]);

// POST /api/auth/register
router.post(
  '/admin/register',
  cpUpload,
  [
    body('name', 'Name is required').trim().notEmpty(),
    body('email', 'Valid email required').isEmail().normalizeEmail(),
    body('phone', 'Phone required (10-15 digits)').trim().isLength({ min: 10, max: 15 }),
    body('password', 'Password minimum 6 chars').isLength({ min: 6 })
  ],
  async (req, res) => {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // delete any uploaded files if validation fails
      if (req.files) {
        Object.values(req.files).flat().forEach(f => {
          try { require('fs').unlinkSync(f.path); } catch (e) {}
        });
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;

    try {
      // check duplicates
      let user = await User.findOne({ $or: [{ email }, { phone }] });
      if (user) {
        // cleanup files
        if (req.files) {
          Object.values(req.files).flat().forEach(f => {
            try { require('fs').unlinkSync(f.path); } catch (e) {}
          });
        }
        return res.status(400).json({ errors: [{ msg: 'Email or phone already in use' }] });
      }

      // ensure both files provided
      if (!req.files || !req.files.drivingLicence || !req.files.aadhaar) {
        // cleanup any uploaded file
        if (req.files) {
          Object.values(req.files).flat().forEach(f => {
            try { require('fs').unlinkSync(f.path); } catch (e) {}
          });
        }
        return res.status(400).json({ errors: [{ msg: 'Driving licence and Aadhaar files are required' }] });
      }

      // create user
      user = new User({
        name,
        email,
        phone,
        password: '' 
      });

      // attach file metadata
      const dl = req.files.drivingLicence[0];
      const ad = req.files.aadhaar[0];

      user.drivingLicence = {
        filename: dl.filename,
        path: path.relative(process.cwd(), dl.path),
        mimeType: dl.mimetype,
        size: dl.size
      };

      user.aadhaar = {
        filename: ad.filename,
        path: path.relative(process.cwd(), ad.path),
        mimeType: ad.mimetype,
        size: ad.size
      };

      // hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // generate JWT (optional)
      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        msg: 'User registered successfully',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          drivingLicence: user.drivingLicence.filename,
          aadhaar: user.aadhaar.filename
        }
      });

    } catch (err) {
      console.error(err);
      // on server error, cleanup files
      if (req.files) {
        Object.values(req.files).flat().forEach(f => {
          try { require('fs').unlinkSync(f.path); } catch (e) {}
        });
      }
      res.status(500).send('Server error');
    }
  }
);


// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // check empty fields
//     if (!email || !password) {
//       return res.status(400).json({ errors: [{ msg: "Please enter all fields" }] });
//     }

//     // check user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
//     }

//     // check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
//     }

//     // generate token
//     const token = jwt.sign(
//       { id: user.id },
//       process.env.JWT_SECRET || "secretKey",
//       { expiresIn: "7d" }
//     );

//     res.json({
//       msg: "Login successful",
//       token,
//       user: {
//         _id: user.id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         drivingLicence: user.drivingLicence,
//         aadhaar: user.aadhaar,
//         token,
//       },
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check empty fields
    if (!email || !password) {
      return res.status(400).json({ errors: [{ msg: "Please enter all fields" }] });
    }

    //  ADMIN LOGIN (STATIC)
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        msg: "Admin login successful",
        role: "admin"
      });
    }

    //  USER LOGIN (DATABASE)
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // token generate
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful",
      role: "user",
      token,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        drivingLicence: user.drivingLicence,
        aadhaar: user.aadhaar
      },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/admin/customers", async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ GET current logged-in user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // 🔥 fresh from DB
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.patch("/admin/customers/:userId/verify", async (req, res) => {
  try {
    const { userId } = req.params;
    const { docType, status } = req.body; 

    if (!["aadhaar", "drivingLicence"].includes(docType))
      return res.status(400).json({ msg: "Invalid document type" });

    if (!["Approved", "Rejected"].includes(status))
      return res.status(400).json({ msg: "Invalid status value" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user[docType].status = status;
    await user.save();

    res.json({
      msg: `${docType} status updated successfully`,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.patch("/user/upload/:docType", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    console.log("User:", req.user);
    console.log("File:", req.file);

    const { docType } = req.params;
    if (!["aadhaar", "drivingLicence"].includes(docType)) return res.status(400).json({ msg: "Invalid doc type" });

    const user = await User.findById(req.user.id);
    console.log("Fetched user:", user);

    if (!user) return res.status(404).json({ msg: "User not found" });
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    // delete old file
    if (user[docType]?.path) {
      const oldPath = path.join(process.cwd(), user[docType].path);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user[docType] = {
      filename: req.file.filename,
      path: path.relative(process.cwd(), req.file.path),
      mimeType: req.file.mimetype,
      size: req.file.size,
      status: "Pending"
    };

    await user.save();
    res.json({ msg: "File uploaded successfully", user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// router.post("/forgot-password", async (req, res) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) return res.json({ message: "User not found" });

//   const token = crypto.randomBytes(32).toString("hex");

//   user.resetToken = token;
//   user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

//   await user.save();

//   console.log("RESET LINK:", `http://localhost:5173/reset/${token}`);

//  res.json({
//   message: "Reset link generated",
//   token
// });
// });

router.post("/reset-password/:token", async (req, res) => {
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const bcrypt = require("bcryptjs");
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();

  res.json({
  message: "Reset link generated",
  token: token
});
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not found" });
    }

    //  TOKEN DEFINE HERE
    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    console.log("RESET LINK:", `http://localhost:5173/reset/${token}`);

    //  SEND TOKEN TO FRONTEND
    res.json({
      message: "Reset link generated",
      token: token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
