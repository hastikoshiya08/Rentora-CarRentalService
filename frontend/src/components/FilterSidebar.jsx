import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const FilterSidebar = ({ onClose, filters, setFilters, allCompanies = [], isOpen }) => {
  const [localFilters, setLocalFilters] = useState({ ...filters });

  useEffect(() => {
    setLocalFilters({ ...filters });
  }, [filters]);

  const handleApply = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      priceRange: [0, 10000],
      ac: [],
      seatingCapacity: [],
      company: [],
      sortBy: "",
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    onClose();
  };

  const toggleArrayFilter = (key, value) => {
    const current = localFilters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    setLocalFilters((prev) => ({
      ...prev,
      [key]: updated,
    }));
  };

  const handleSortChange = (e) => {
    setLocalFilters((prev) => ({
      ...prev,
      sortBy: e.target.value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-80 bg-black text-white-400 z-50 p-5 overflow-y-auto shadow-2xl border-l border-yellow-500"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white-400">Filters</h2>
              <button onClick={onClose} className="text-white-400 hover:text-white-300">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <label className="block font-medium mb-2">Price Range (₹)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={localFilters.priceRange[0]}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      priceRange: [Number(e.target.value), prev.priceRange[1]],
                    }))
                  }
                  className="w-1/2 bg-black border border-yellow-500 px-2 py-1 rounded focus:outline-none"
                />
                <span>to</span>
                <input
                  type="number"
                  value={localFilters.priceRange[1]}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], Number(e.target.value)],
                    }))
                  }
                  className="w-1/2 bg-black border border-yellow-500 px-2 py-1 rounded focus:outline-none"
                />
              </div>
            </div>

            {/* AC */}
            <div className="mb-5">
              <label className="block font-medium mb-2">AC Condition</label>
              {["AC", "Non-AC"].map((condition) => (
                <label key={condition} className="block mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.ac.includes(condition)}
                      onChange={() => toggleArrayFilter("ac", condition)}
                      className="mr-2 accent-yellow-400"
                    />
                    {condition}
                  </div>
                </label>
              ))}
            </div>

            {/* Seating Capacity */}
            <div className="mb-5">
              <label className="block font-medium mb-2">Seating Capacity</label>
              {[4, 5, 6, 7, 8].map((capacity) => (
                <label key={capacity} className="block mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.seatingCapacity.includes(capacity)}
                      onChange={() => toggleArrayFilter("seatingCapacity", capacity)}
                      className="mr-2 accent-yellow-400"
                    />
                    {capacity} Seater
                  </div>
                </label>
              ))}
            </div>

            {/* Company */}
            <div className="mb-5">
              <label className="block font-medium mb-2">Company</label>
              {allCompanies?.map((company, index) => (
                <label key={index} className="block mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.company.includes(company)}
                      onChange={() => toggleArrayFilter("company", company)}
                      className="mr-2 accent-yellow-400"
                    />
                    {company}
                  </div>
                </label>
              ))}
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <label className="block font-medium mb-2">Sort By</label>
              <select
                value={localFilters.sortBy}
                onChange={handleSortChange}
                className="w-full bg-black border border-yellow-500 px-2 py-1 rounded focus:outline-none"
              >
                <option value="">None</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-3">
              <button
                onClick={handleReset}
                className="flex-1 border border-yellow-500 text-white-400 px-4 py-2 rounded-full hover:bg-yellow-500 hover:text-black transition"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-1 bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-400 transition"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;
