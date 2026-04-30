import React, { forwardRef, useState } from "react";
import carData from "../data/cars";
import { useNavigate } from "react-router-dom";
import TestimonialsSection from "./TestimonialsSection";

const SearchSection = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(6); 

  const handleBookNow = (car) => {
    navigate("/booking", { state: { car } });
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6); // Show more cars
  };

  const carsToShow = carData.slice(0, visibleCount); // Show all cars without filter

  return (
    <div
      ref={ref}
      className="w-full min-h-screen bg-[#DCD5FB] flex flex-col items-center relative"
    >
      {/* 🔍 Search Area */}
      <div className="w-[90%] max-w-3xl bg-white/20 backdrop-blur-md rounded-xl p-2 shadow-xl text-center mt-10 min-h-[150px] flex flex-col justify-center border border-white/30">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 tracking-wide">
          Search Cars
        </h2>

        <div className="flex  items-center gap-2 sm:gap-3 justify-center">
          <input
            type="text"
            placeholder="Car name or brand"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[70%] px-4 py-1 sm:py-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white/60 placeholder-gray-500 text-gray-800"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-800 text-white sm:px-5 sm:py-2.5 py-1 px-2 rounded-full hover:bg-blue-700 transition duration-300 shadow-sm font-normal sm:font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Cars Display Section */}
      <div className="mt-10 w-full px-4 sm:px-12 mb-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Available Cars
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {carsToShow.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-48 object-contain bg-white"
              />
              <div className="p-4 relative">
                <h4 className="text-lg font-bold text-gray-800">
                  {car.name}
                </h4>
                <p className="text-gray-600">{car.company}</p>
                <p className="text-blue-800 font-semibold mt-2">
                  ₹{car.price}/day
                </p>
                
                <button
                  onClick={() => handleBookNow(car)}
                  className="absolute bottom-3 right-3 bg-blue-800 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {visibleCount < carData.length && (
          <div className="mt-4 text-center">
            <button
              onClick={handleShowMore}
              className="px-3 py-1 text-blue-800 hover:text-blue-700 transition"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default SearchSection;
