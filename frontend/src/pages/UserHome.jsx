import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal , Calendar } from "lucide-react";
import axios from "axios";
import FilterSidebar from "../components/FilterSidebar";

const UserHome = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [committedSearchTerm, setCommittedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState({});

  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    ac: [],
    seatingCapacity: [],
    company: [],
    sortBy: "",
  });

  const categories = ["All", "SUV", "Sedan", "Hatchback", "Mini", "Luxury"];

  //  FETCH DATA
  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${API_URL}/variants`);
      setCars(data);

      const availabilityData = {};

      //  only fetch availability if dates exist
      if (fromDate && toDate) {
        await Promise.all(
          data.map(async (car) => {
            try {
              const res = await axios.get(
                `${API_URL}/variants/${car._id}/availability?fromDate=${fromDate}&toDate=${toDate}`
              );
              availabilityData[car._id] = res.data.vehicles || [];
            } catch {
              availabilityData[car._id] = [];
            }
          })
        );
      }

      setAvailability(availabilityData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [fromDate, toDate]);

  // SEARCH
  const handleSearch = () => {
    setCommittedSearchTerm(searchTerm);
  };

  const suggestions = cars
  .filter(
    (car) =>
      searchTerm.trim() !== "" &&
      (`${car.company} ${car.name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()))
  )
  .map((car) => `${car.company} ${car.name}`)
  .slice(0, 5);

  const handleSuggestionClick = (text) => {
    setSearchTerm(text);
    setCommittedSearchTerm(text);
  };

  // FILTER
  const filteredCars = cars
  .filter((car) => {
    const full = `${car.company} ${car.name}`.toLowerCase();

    return (
      // SEARCH
      (committedSearchTerm === "" ||
        full.includes(committedSearchTerm.toLowerCase())) &&

      // CATEGORY
      (selectedCategory === "All" || car.type === selectedCategory) &&

      // PRICE
      car.price >= filters.priceRange[0] &&
      car.price <= filters.priceRange[1] &&

      // AC
      (filters.ac.length === 0 ||
        filters.ac.includes(car.ac)) &&

      // SEATING
      (filters.seatingCapacity.length === 0 ||
        filters.seatingCapacity.includes(car.seating)) &&

      // COMPANY
      (filters.company.length === 0 ||
        filters.company.includes(car.company))
    );
  })
  .sort((a, b) => {
    if (filters.sortBy === "priceLowToHigh") return a.price - b.price;
    if (filters.sortBy === "priceHighToLow") return b.price - a.price;
    return 0;
  });

  const handleBookNow = (car) => {
    const isPast = (date) => new Date(date) < new Date(today);
      if (isPast(fromDate) || isPast(toDate)) {
        alert("Past dates not allowed");
        return;
      }

      if (new Date(toDate) < new Date(fromDate)) {
        alert("Invalid date range");
        return;
      }

    navigate("/booking", {
      state: {
        car,
        fromDate,
        toDate,
      },
    });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full min-h-screen bg-black text-white">

      {/* SIDEBAR */}
      <FilterSidebar
        isOpen={showFilterSidebar}
        onClose={() => setShowFilterSidebar(false)}
        filters={filters}
        setFilters={setFilters}
        allCompanies={[...new Set(cars.map((c) => c.company))]}
      />

      {/* HEADER */}
      {/* <div className="fixed top-0 left-0 w-full z-[999] bg-black/70 backdrop-blur-2xl border-b border-yellow-500/10 px-4 py-4"> */}
      <div className="fixed top-[70px] left-0 w-full z-40 h-[150px] bg-black/80 backdrop-blur-xl px-4 py-4">

        {/*  SEARCH (UPDATED LIKE SEARCH PAGE) */}
        <div className="flex flex-col gap-3 relative max-w-4xl mx-auto">

          <div
            className={`flex items-center gap-2 rounded-full px-2 transition-all duration-300 ${
              isFocused
                ? "bg-black/90 shadow-[0_0_25px_rgba(255,200,0,0.25)] scale-[1.02]"
                : "bg-transparent"
            }`}
          >

            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              onChange={(e) => setSearchTerm(e.target.value)}

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setCommittedSearchTerm(searchTerm);
                  setIsFocused(false);
                }
              }}
              className={`w-full px-5 py-3 rounded-full bg-white/5 border border-yellow-500/20 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                  isFocused ? "ring-2 ring-yellow-500" : ""
                }`}
            />

            <button
              onClick={handleSearch}
              className="p-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-all duration-200 active:scale-90"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>


            <button
              onClick={() => setShowFilterSidebar(true)}
             className="p-2 text-yellow-500 hover:bg-white/10 rounded-full transition-all duration-200 active:scale-90"
            >
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

          </div>

          {/*  Suggestions Dropdown */}
          {suggestions.length > 0 && (
            // <ul className="absolute top-full mt-2 w-full bg-black border border-yellow-500/20 rounded-xl shadow-lg overflow-hidden z-50">
            <ul className="absolute top-full mt-2 w-full bg-black border border-yellow-500/20 rounded-xl shadow-lg overflow-hidden z-40 backdrop-blur-xl">
              
              {suggestions.map((sug, i) => (
                <li
                  key={i}
                  onClick={() => handleSuggestionClick(sug)}
                  className="px-4 py-2 text-sm hover:bg-white/10 cursor-pointer transition-all duration-200 hover:pl-6"
                >
                  {sug}
                </li>
              ))}

            </ul>
          )}

        </div>

        {/* DATE */}
        <div className="flex gap-3 mt-4 max-w-4xl mx-auto">
          <input
            type="date"
            value={fromDate}
            min={today}
            onChange={(e) => {
              setFromDate(e.target.value);

              // auto reset toDate if invalid
              if (toDate && e.target.value > toDate) {
                setToDate("");
              }
            }}
            className="px-3 py-2 bg-black border border-yellow-500/30 rounded"
          />
          
          <input
            type="date"
            value={toDate}
            min={fromDate || today}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 bg-black border border-yellow-500/30 rounded"
          />
        </div>

        {/* CATEGORY */}
        <div className="flex gap-3 mt-4 max-w-4xl mx-auto overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-yellow-500 text-black shadow-md shadow-yellow-500/30 scale-105"
                  : "bg-white/5 border border-yellow-500/20 hover:bg-white/10 hover:scale-105"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      {/* <div className="pt-[170px] px-4 max-w-6xl mx-auto"> */}
      <div className="pt-[300px] px-4 max-w-6xl mx-auto">

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white/5 border border-yellow-500/10 rounded-xl p-4"
            >
              <div className="h-40 bg-gray-800 rounded mb-3"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {filteredCars.map((car) => {
            const isAvailable =
              availability[car._id] &&
              availability[car._id].some((v) => v.available);

            return (
              <div
                key={car._id}
                className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 to-white/0 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,200,0,0.15)]"
              >

                {/* IMAGE */}
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={`${API_URL.replace("/api", "")}${car.image}`}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* overlay glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                </div>

                {/* CONTENT */}
                <div className="p-4">

                  <h3 className="text-white font-semibold text-lg">
                    {car.company} {car.name}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    {car.type} • {car.seating} seats • {car.ac}
                  </p>

                  <p className="text-yellow-400 font-bold mt-2 text-lg">
                    ₹{car.price}/day
                  </p>

                </div>

                {/* BUTTON */}
                <button
                  disabled={!fromDate || !toDate || !isAvailable}
                  onClick={() => handleBookNow(car)}
                  className={`absolute bottom-4 right-4 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300
                  ${
                    fromDate && toDate && isAvailable
                      ? "bg-yellow-500 text-black hover:bg-yellow-400 hover:scale-105 shadow-md shadow-yellow-500/30"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {!fromDate || !toDate
                    ? "Select Dates"
                    : isAvailable
                    ? "Book Now"
                    : "Unavailable"}
                </button>

              </div>
            );
          })}

        </div>
      )}
    </div>
    </div>
  );
};

export default UserHome;