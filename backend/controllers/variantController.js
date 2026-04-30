const Variant = require("../models/variant");

// GET all variants
exports.getAllVariants = async (req, res) => {
  try {
    const variants = await Variant.find();
    res.json(variants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ADD a registration number to a variant
exports.addVehicle = async (req, res) => {
  const { regNo } = req.body;
  const { id } = req.params;

  if (!regNo) return res.status(400).json({ message: "Registration number required" });

  try {
    const variant = await Variant.findById(id);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    if (variant.vehicles.includes(regNo)) {
      return res.status(400).json({ message: "Vehicle already exists" });
    }

    variant.vehicles.push(regNo);
    await variant.save();
    res.json(variant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE a registration number from a variant
exports.deleteVehicle = async (req, res) => {
  const { id, regNo } = req.params;

  try {
    const variant = await Variant.findById(id);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    variant.vehicles = variant.vehicles.filter(v => v !== regNo);
    await variant.save();
    res.json(variant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
