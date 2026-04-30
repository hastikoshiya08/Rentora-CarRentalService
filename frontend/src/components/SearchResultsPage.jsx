import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import axios from "axios";
import FilterSidebar from "./FilterSidebar.jsx";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const navigate = useNavigate();
  const queryParam = useQuery().get("query") || "";
  const categoryParam = useQuery().get("category") || "All";
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [committedSearchTerm, setCommittedSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Vehicle availability state
  const [availability, setAvailability] = useState({}); 

  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    ac: [],
    seatingCapacity: [],
    company: [],
    sortBy: "",
  });

  const categories = ["All", "SUV", "Sedan", "Hatchback", "Luxury"];

  useEffect(() => {
    setSearchTerm(queryParam);
    setCommittedSearchTerm(queryParam);
    setSelectedCategory(categoryParam);
  }, [queryParam, categoryParam]);

  // Fetch all variants
  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/variants`);
        setCars(data);
        // Fetch availability for each variant
        const availabilityData = {};
        await Promise.all(
          data.map(async (variant) => {
            const res = await axios.get(
              `${API_URL}/variants/${variant._id}/availability?fromDate=${new Date().toISOString()}&toDate=${new Date(
                new Date().getTime() + 24 * 60 * 60 * 1000
              ).toISOString()}`
            );
            availabilityData[variant._id] = res.data.vehicles;
          })
        );
        setAvailability(availabilityData);
      } catch (err) {
        console.error("Error fetching variants or availability:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVariants();
  }, []);

  // Header scroll
  useEffect(() => {
    const threshold = 30;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (lastScrollY.current - currentScrollY > threshold) {
        setShowHeader(true);
      } else if (currentScrollY - lastScrollY.current > threshold) {
        setShowHeader(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBookNow = (car) => {
    navigate("/booking", { state: { car } });
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setSearchTerm("");
    setCommittedSearchTerm("");
    navigate(`/search?category=${cat}`);
  };

  const handleSearch = () => {
    setCommittedSearchTerm(searchTerm);
    navigate(`/search?query=${searchTerm}&category=${selectedCategory}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setCommittedSearchTerm(suggestion);
    navigate(`/search?query=${suggestion}&category=${selectedCategory}`);
  };

  // Suggestions
  const suggestions = cars
    .filter(
      (car) =>
        searchTerm.trim() !== "" &&
        (car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.company.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .map((car) => `${car.company} ${car.name}`)
    .slice(0, 5);

  // Filtered cars
  const filteredCars = cars
    .filter((car) => {
      const fullName = `${car.company} ${car.name}`.toLowerCase();
      const matchesSearch =
        committedSearchTerm.trim() === "" ||
        fullName.includes(committedSearchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || car.type === selectedCategory;
      const matchesAC = filters.ac.length === 0 || filters.ac.includes(car.ac);
      const matchesSeating =
        filters.seatingCapacity.length === 0 ||
        filters.seatingCapacity.includes(Number(car.seating));
      const matchesCompany =
        filters.company.length === 0 || filters.company.includes(car.company);
      const matchesPrice =
        car.price >= filters.priceRange[0] &&
        car.price <= filters.priceRange[1];
      return (
        matchesSearch &&
        matchesCategory &&
        matchesAC &&
        matchesSeating &&
        matchesCompany &&
        matchesPrice
      );
    })
    .sort((a, b) => {
      if (filters.sortBy === "priceLowToHigh") return a.price - b.price;
      if (filters.sortBy === "priceHighToLow") return b.price - a.price;
      return 0;
    });

  const allCompanies = Array.from(new Set(cars.map((car) => car.company)));

return (
  <div className="w-full min-h-screen bg-black text-white">

    <FilterSidebar
      isOpen={showFilterSidebar}
      onClose={() => setShowFilterSidebar(false)}
      filters={filters}
      setFilters={setFilters}
      allCompanies={allCompanies}
    />

    {/* Header */}
    <div
      className={`fixed top-0 left-0 w-full z-40 transition-transform duration-500 ${
        showHeader ? "translate-y-[64px]" : "-translate-y-full"
      } bg-black/80 backdrop-blur-md border-b border-yellow-500/20`}
    >
      <div className="px-4 sm:py-8 py-5 sm:max-w-6xl sm:mx-auto">

        {/* SEARCH */}
        <div className="flex flex-col gap-2 relative">
          <div className="flex items-center gap-2">

            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-white/5 border border-yellow-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />

            <button
              onClick={handleSearch}
              className="p-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => setShowFilterSidebar(true)}
              className="p-2 text-yellow-500 hover:bg-white/10 rounded-full transition"
            >
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <ul className="absolute top-full mt-2 w-full bg-black border border-yellow-500/20 rounded-xl shadow-lg overflow-hidden">
              {suggestions.map((sug, i) => (
                <li
                  key={i}
                  onClick={() => handleSuggestionClick(sug)}
                  className="px-4 py-2 text-sm hover:bg-white/10 cursor-pointer"
                >
                  {sug}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CATEGORY */}
        <div className="mt-3 flex gap-2 flex-wrap justify-center sm:justify-start">
          {categories.map((cat) => (
            <span
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm cursor-pointer transition ${
                selectedCategory === cat
                  ? "bg-yellow-500 text-black"
                  : "bg-white/5 border border-yellow-500/20 text-gray-300 hover:bg-white/10"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

      </div>
    </div>

    {/* Cars List */}
    <div className="sm:pt-[250px] pt-44 px-3 sm:px-4 sm:max-w-6xl sm:mx-auto">

      {loading ? (
        <p className="text-center text-gray-400">Loading cars...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

          {filteredCars.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No cars found.
            </p>
          ) : (
            filteredCars.map((car) => {
              const carAvailability = availability[car._id] || [];
              const isAvailable = carAvailability.some((v) => v.available);

              return (
                <div
                  key={car._id}
                  className={`relative rounded-2xl p-3 sm:p-4 backdrop-blur-md border transition-all duration-300 hover:scale-[1.03] ${
                    isAvailable
                      ? "bg-white/5 border-yellow-500/20 hover:shadow-yellow-500/10 hover:shadow-xl"
                      : "bg-white/5 border-gray-700 opacity-60"
                  }`}
                >

                  {/* IMAGE */}
                  <div className="w-full h-32 sm:h-40 rounded-lg overflow-hidden bg-black/30 mb-3">
                    <img
                      src={`${API_URL.replace("/api", "")}${car.image}`}
                      alt={car.name}
                      className={`w-full h-full object-cover ${
                        !isAvailable && "grayscale opacity-50"
                      }`}
                    />
                  </div>

                  {/* TITLE */}
                  <h3 className="text-sm sm:text-lg font-semibold text-white">
                    {car.company} {car.name}
                  </h3>

                  {/* TYPE */}
                  <p className="text-xs sm:text-sm text-gray-400">
                    {car.type}
                  </p>

                  {/* PRICE */}
                  <p className="mt-1 sm:mt-2 text-yellow-400 font-bold text-sm sm:text-base">
                    ₹{car.price}/day
                  </p>

                  {/* DETAILS */}
                  <p className="text-[10px] sm:text-sm text-gray-500">
                    {car.ac} • {car.seating} Seats
                  </p>

                  {/* BUTTON */}
                  <button
                    onClick={() => handleBookNow(car)}
                    disabled={!isAvailable}
                    className={`absolute bottom-3 right-3 text-[10px] sm:text-sm px-3 py-1.5 rounded-lg transition ${
                      isAvailable
                        ? "bg-yellow-500 text-black hover:bg-yellow-400"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isAvailable ? "Book Now" : "Not Available"}
                  </button>

                </div>
              );
            })
          )}

        </div>
      )}

    </div>
  </div>
);
}
export default SearchResultsPage;