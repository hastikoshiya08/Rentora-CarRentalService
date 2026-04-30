const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: ["SUV", "Sedan", "Hatchback", "Mini", "Luxury"], 
      required: true 
    },
    price: { type: Number, required: true },
    seating: { type: Number, required: true },
    ac: { type: String, enum: ["AC", "Non-AC"], required: true },
    image: { type: String, required: true }, 

    // Vehicles array to store registration numbers
    vehicles: {
      type: [String],
      validate: {
        validator: function(v) {
          return new Set(v).size === v.length;
        },
        message: "Duplicate vehicle numbers not allowed"
      }
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Variant", variantSchema);
