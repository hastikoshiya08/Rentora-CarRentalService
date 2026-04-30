import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import heroCar from "../assets/car-hero.png";

function Hero() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();
  const { user } = useAuth();

  const currentUser = user || JSON.parse(localStorage.getItem("user"));

  //  CAR LIST (same as Cars page)
  const cars = [
    "Toyota Fortuner",
    "BMW X5",
    "Audi A6",
    "Hyundai Creta",
    "Tata Harrier",
    "Maruti Swift",
    "Hyundai i20",
    "Maruti Baleno"
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShowScrollIndicator(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBookNow = () => {
    if (currentUser) {
      navigate("/search");
    } else {
      navigate("/login");
    }
  };

  //  SEARCH NAVIGATION
  const handleSearch = (value = search) => {
    if (value.trim() !== "") {
      navigate(`/cars?search=${value}`);
    }
  };

  // INPUT CHANGE + SUGGESTION LOGIC
  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value === "") {
      setSuggestions([]);
      return;
    }

    const filtered = cars.filter((car) =>
      car.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered);
  };

  //  CLICK SUGGESTION
  const handleSelect = (value) => {
    setSearch(value);
    setSuggestions([]);
    handleSearch(value);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      
      <img
        src={heroCar}
        alt="car"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4 text-white">
        
        <h1 className="text-3xl md:text-6xl font-bold leading-tight">
          Car On Rent <br />
          <span className="text-yellow-500">In Surat</span>
        </h1>

        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Hire a Car The Way You Want It
        </p>

        {/*  SEARCH BAR + DROPDOWN */}
        <div className="mt-6 w-full max-w-xl relative">

          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
            
            <input
              type="text"
              placeholder="Search cars..."
              className="w-full px-3 py-3 text-black outline-none"
              value={search}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />

            <button
              onClick={() => handleSearch()}
              className="bg-yellow-500 px-6 py-3 text-black font-medium hover:bg-yellow-600 transition"
            >
              Search
            </button>
          </div>

          {/*  DROPDOWN */}
          {suggestions.length > 0 && (
            <div className="absolute w-full bg-black border border-gray-700 rounded-md mt-1 max-h-60 overflow-y-auto z-50">

              {suggestions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-3 hover:bg-yellow-500 hover:text-black cursor-pointer transition"
                >
                  🔍 {item}
                </div>
              ))}

            </div>
          )}

        </div>
   {/* Call Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <a
          href="tel:+919876543220"
          className="flex items-center gap-2 bg-yellow-500 text-black px-5 py-2.5 rounded-full shadow-lg font-semibold hover:bg-yellow-600 transition"
        >
          📞 Call Us
        </a>
      </div>

      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/919876543220?text=Hi%20Rentora,%20I%20want%20to%20book%20a%20car"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-full shadow-lg font-semibold hover:bg-green-600 transition"
        >
          💬 WhatsApp
        </a>
      </div>
        {/* Button */}
        <button
          onClick={handleBookNow}
          className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 font-semibold transition rounded-full"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default Hero;