import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Trash2, Plus, X } from "lucide-react";

const Variants = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [regNo, setRegNo] = useState("");
  const [regError, setRegError] = useState("");
  
  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/variants`);
        setVariants(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVariants();
  }, []);

  const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;

  const handleRegChange = (e) => {
    let value = e.target.value.toUpperCase();

    // allow only A-Z and 0-9
    if (!/^[A-Z0-9]*$/.test(value)) return;

    setRegNo(value);

    if (value && !vehicleRegex.test(value)) {
      setRegError("Invalid format (e.g., GJ01AB1234)");
    } else {
      setRegError("");
    }
  };

  const handleView = (variant) => {
    setSelectedVariant(variant);
    setRegNo("");
  };

  const handleClose = () => {
    setSelectedVariant(null);
    setRegNo("");
  };

  console.log(selectedVariant); // should be null when closed

  const handleAddRegNo = async () => {
    if (!regNo.trim()) {
      setRegError("Registration number is required");
      return;
    }

    if (!vehicleRegex.test(regNo)) {
      setRegError("Invalid vehicle number format");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/variants/${selectedVariant._id}/vehicles`,
        { regNo: regNo.trim() }
      );

      setVariants(variants.map(v => v._id === data._id ? data : v));
      setSelectedVariant(data);
      setRegNo("");
      setRegError("");
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteRegNo = async (reg) => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/variants/${selectedVariant._id}/vehicles/${reg}`
      );

      setVariants(variants.map(v => v._id === data._id ? data : v));
      setSelectedVariant(data);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteVariant = async (id) => {
  console.log("Deleting ID:", id);

  try {
    const res = await axios.delete(`${API_URL}/variants/${id}`);
    console.log(res.data); 

    setVariants(prev => prev.filter(v => v._id !== id));

  } catch (err) {
    console.error("DELETE ERROR:", err.response?.data || err.message);
  }
};

console.log("BASE_URL:", BASE_URL);
  return (
    <div className="px-6 py-6 text-white">

      <h2 className="text-2xl font-bold mb-6">
        All <span className="text-yellow-500">Variants</span>
      </h2>

      {/* TABLE */}
<div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-yellow-500/20 rounded-2xl shadow-xl overflow-hidden">

  <table className="w-full text-sm text-left">

    {/* HEADER */}
    <thead className="bg-yellow-500/10 text-yellow-400 uppercase text-xs tracking-wider">
      <tr>
        <th className="px-6 py-4">Car</th>
        <th className="px-6 py-4">Details</th>
        <th className="px-6 py-4">Price</th>
        <th className="px-6 py-4 text-center">Vehicles</th>
        <th className="px-6 py-4 text-center">Actions</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody className="divide-y divide-gray-800">

      {variants.map((variant) => (
        <tr
          key={variant._id}
          className="hover:bg-yellow-500/5 transition duration-200"
        >

          {/* CAR IMAGE + NAME */}
          <td className="px-6 py-4 flex items-center gap-4">
            <img
              src={`${BASE_URL}${(variant?.image || "").replace("undefined", "")}`}
              onError={(e) => {
                e.target.src = "/no-image.png";   // fallback
              }}
              className="h-14 w-24 object-cover rounded-lg"
            />

            <div>
              <p className="font-semibold text-white">
                {variant.name}
              </p>
              <p className="text-xs text-gray-400">
                {variant.company}
              </p>
            </div>
          </td>

          {/* DETAILS */}
          <td className="px-6 py-4 text-gray-400">
            <p>AC: {variant.ac}</p>
            <p>Seats: {variant.seating}</p>
          </td>

          {/* PRICE */}
          <td className="px-6 py-4 text-yellow-400 font-semibold">
            ₹{variant.price}
            <span className="text-gray-500 text-xs"> /day</span>
          </td>

          {/* VEHICLES */}
          <td className="px-6 py-4 text-center">
            <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-xs">
              {variant.vehicles?.length || 0}
            </span>
          </td>

          {/* ACTIONS */}
          <td className="px-6 py-4">
            <div className="flex justify-center gap-3">

              <button
                onClick={() => handleView(variant)}
                className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition text-xs"
              >
                <Eye size={14} />
                View
              </button>

              <button
                onClick={() => {
                  console.log("DELETE CLICKED");
                  handleDeleteVariant(variant._id);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-400 transition text-xs"
              >
                Delete
              </button>

            </div>
          </td>

        </tr>
      ))}

    </tbody>
  </table>

  {/* EMPTY STATE */}
  {variants.length === 0 && (
    <div className="text-center py-10 text-gray-500">
      No variants found 🚗
    </div>
  )}

</div>

      {/* POPUP */}
      {selectedVariant && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-start pt-20 z-50">

          <div className="bg-white/5 border border-yellow-500/20 rounded-xl w-full max-w-4xl p-6 backdrop-blur-xl relative">

            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="flex gap-6">

              <img
                src={`${BASE_URL}${(selectedVariant?.image || "").replace("undefined", "")}`}
                onError={(e) => {
                  e.target.src = "/no-image.png";
                }}
                className="w-40 h-28 object-cover rounded"
              />

              <div>
                <h3 className="text-xl font-semibold">
                  {selectedVariant.name}
                </h3>

                <p className="text-gray-400">
                  {selectedVariant.company}
                </p>

                <p className="text-sm text-gray-500">
                  AC: {selectedVariant.ac}
                </p>

                <p className="text-sm text-gray-500">
                  Seating: {selectedVariant.seating}
                </p>
              </div>

            </div>

            {/* ADD VEHICLE */}
            <div className="mt-6 flex flex-col gap-2">

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Registration No (e.g., GJ01AB1234)"
                  value={regNo}
                  onChange={handleRegChange}
                  maxLength={10}
                  className={`bg-black border ${
                    regError ? "border-red-500" : "border-gray-700"
                  } rounded px-3 py-2 w-full focus:outline-none focus:ring-2 ${
                    regError ? "focus:ring-red-500" : "focus:ring-yellow-500"
                  }`}
                />

                <button
                  onClick={handleAddRegNo}
                  disabled={!regNo || regError}
                  className={`px-4 py-2 rounded flex items-center gap-1 ${
                    !regNo || regError
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-yellow-500 hover:bg-yellow-600 text-black"
                  }`}
                >
                  <Plus size={16} /> Add
                </button>
              </div>

              {regError && (
                <p className="text-red-500 text-sm">{regError}</p>
              )}
            </div>

            {/* VEHICLE LIST */}
            <div className="mt-6">

              <h4 className="font-semibold mb-2">
                Registered Vehicles
              </h4>

              <table className="w-full text-sm border border-gray-700 rounded overflow-hidden">

                <thead className="bg-white/10 text-gray-300">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Registration No</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedVariant.vehicles?.map((reg, idx) => (
                    <tr key={idx} className="border-t border-gray-700">

                      <td className="p-2">{idx + 1}</td>
                      <td className="p-2">{reg}</td>

                      <td className="p-2">
                        <button
                          onClick={() => handleDeleteRegNo(reg)}
                          className="text-red-500 hover:text-red-400 flex items-center gap-1"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </td>

                    </tr>
                  ))}

                  {(!selectedVariant.vehicles || selectedVariant.vehicles.length === 0) && (
                    <tr>
                      <td colSpan="3" className="p-2 text-center text-gray-500">
                        No vehicles added yet.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Variants;