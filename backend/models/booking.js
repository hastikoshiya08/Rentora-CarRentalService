const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  variant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Variant", 
    required: true 
  },

  vehicleRegNo: { 
    type: String, 
    required: true 
  },

  fromDate: { 
    type: Date, 
    required: true 
  },

  toDate: { 
    type: Date, 
    required: true 
  },

  totalPrice: { 
    type: Number, 
    required: true 
  },

  //  NEW: Pickup & Drop Location
  pickupLocation: { type: String },
  dropLocation: { type: String },

  //  NEW: Booking Status
  status: { 
    type: String, 
    enum: ["Upcoming", "Completed", "Cancelled"], 
    default: "Upcoming" 
  },

  //  NEW: Payment Status
  // paymentStatus: { 
  //   type: String, 
  //   enum: ["Pending", "Paid", "Failed", "Refunded"],
  //   default: "Pending" 
  // },

  paymentId: { type: String },

  //  NEW: Days calculation (optional but useful)
  totalDays: { type: Number },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  
  approvalStatus: {
  type: String,
  enum: ["Pending", "Approved", "Rejected"],
  default: "Pending",
  },

refundStatus: {
  type: String,
  enum: ["None", "Pending", "Completed"],
  default: "None",
},
paymentStatus: {
  type: String,
  enum: ["Pending", "Paid", "Failed", "Refunded"],
  default: "Pending",
},

});

module.exports = mongoose.model("Booking", bookingSchema);