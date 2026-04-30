const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  resetToken: String,
resetTokenExpire: Date,
  drivingLicence: {
    filename: String,
    path: String,
    mimeType: String,
    size: Number,
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
  },
  aadhaar: {
    filename: String,
    path: String,
    mimeType: String,
    size: Number,
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
  },
  createdAt: { type: Date, default: Date.now }
  
});

module.exports = mongoose.model('User', UserSchema);
