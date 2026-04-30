//BOOKINGPAGE.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Car, Users, Snowflake, PaintBucket } from "lucide-react";
import { MapPin } from "lucide-react";

const PRICING_RULES = {
  DEFAULT: {
    weekendMultiplier: 1.1,
    festivalMultiplier: 1.3,
    discountAfterDays: 5,
    discountPercent: 0.10,
    allowDiscount: true,
  },

  LUXURY: {
    weekendMultiplier: 1.2,
    festivalMultiplier: 1.5,
    allowDiscount: false,            
  },
};

const KM_LIMIT_PER_DAY = 100;
const EXTRA_KM_PRICE = 150;
const LATE_FEE_PER_HOUR = 200;

const locations = [
  { area: "Adajan", landmark: "Near Tapi River" },
  { area: "Vesu", landmark: "VIP Road" },
  { area: "Piplod", landmark: "Dumas Road" },
  { area: "Varachha", landmark: "Mini Bazar" },
  { area: "Katargam", landmark: "Dabholi" },
  { area: "Athwa", landmark: "City Light" },
  { area: "Pal", landmark: "RTO Road" },
  { area: "Althan", landmark: "Canal Road" },
];

const MIN_KM = 5;
const PRICE_PER_KM = 10; // you can change later

const MIN_HOURS = 4;

const getDistance = (pickup, drop) => {
  if (!pickup || !drop) return 0;

  // Fake realistic distances (you can upgrade later)
  const map = {
    "Adajan-Vesu": 12,
    "Vesu-Adajan": 12,
    "Adajan-Piplod": 8,
    "Piplod-Adajan": 8,
    "Vesu-Piplod": 5,
    "Piplod-Vesu": 5,
  };

  return map[`${pickup}-${drop}`] || 10; // default fallback
};

const CITY_KM_LIMITS = {
  Adajan: 80,
  Vesu: 120,
  Piplod: 100,
  Varachha: 90,
  Default: 150,
};

const getMaxKM = (location) => {
  if (!location) return CITY_KM_LIMITS.Default;
  return CITY_KM_LIMITS[location] || CITY_KM_LIMITS.Default;
};

const BookingPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const location = useLocation();
  const navigate = useNavigate();
  const car = location.state?.car;

  const getCarRule = (car) => {
    if (!car) return PRICING_RULES.DEFAULT;

     const luxuryBrands = ["BMW", "AUDI", "MERCEDES", "JAGUAR", "VOLVO"];

    if (car?.company && luxuryBrands.includes(car.company.toUpperCase())) {
    return PRICING_RULES.LUXURY;
  }
    return PRICING_RULES.DEFAULT;
  };

  const [bookingType, setBookingType] = useState("day"); 

  const SECURITY_DEPOSIT =
  bookingType === "km"
    ? 2000
    : bookingType === "hour"
    ? 3000
    : 5000;

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [hours, setHours] = useState(0);
  const [kms, setKms] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [withDriver, setWithDriver] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
 const [festivalCharge, setFestivalCharge] = useState(0);

  const DRIVER_CHARGE = 600;

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const isValid = () => {
    if (bookingType === "day") {
      return fromDate && toDate && pickup && drop;
    }

    if (bookingType === "hour") {
      return fromDate && toDate && totalHours >= 4;
    }

    if (bookingType === "km") {
      return kms >= 5 && pickup && drop;
    }

    return false;
  };

  const [showPickup, setShowPickup] = useState(false);
  const [showDrop, setShowDrop] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const FESTIVALS = [
    { date: "2026-11-12", name: "Diwali", multiplier: 1.3 },
    { date: "2026-12-25", name: "Christmas", multiplier: 1.25 },
    { date: "2026-01-01", name: "New Year", multiplier: 1.4 },
  ];

  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  };

  const getFestival = (date) => {
    return FESTIVALS.find(f => f.date === date);
  };

  const getPriceForDate = (date, basePrice) => {
    let price = basePrice;

    //Festival pricing FIRST (higher priority)
    const festival = getFestival(date);
    if (festival) {
      price = price * festival.multiplier;
      return Math.round(price);
    }
    
    //weekend pricing(10%)
    if (isWeekend(date)) {
      price = price * 1.1;
    }

    return Math.round(price);
  };

useEffect(() => {
  if (!car) return;
  // 🚨 STOP calculation if pickup/drop not selected
  if (!pickup || !drop) {
    setTotalDays(0);
    setTotalPrice(0);
    setDiscount(0);
    setFinalPrice(0);
    return;
  }

  const rule = getCarRule(car);

  let basePrice = 0;
  let days = 0;
  let festivalExtra = 0;

  // PER DAY
  if (bookingType === "day" && fromDate && toDate) {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    const diff = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

    if (diff > 0) {
      days = diff;
      const driverCost = withDriver ? diff * DRIVER_CHARGE : 0;

      let total = 0;
      let current = new Date(from);
      const end = new Date(to);

      while (current <= end) {
        const dateStr = current.toISOString().split("T")[0];

        let dailyPrice = car.price;

        if (rule.fixedPrice) {
          dailyPrice = rule.fixedPrice;
        } else {
          const festival = getFestival(dateStr);

          if (festival && !rule.ignoreFestival) {
            const multiplier = rule.festivalMultiplier || 1.3;
            const increased = car.price * multiplier;

            festivalExtra += (increased - car.price);

            dailyPrice = increased;
          }

        // 📅 Weekend
          else if (isWeekend(dateStr) && !rule.ignoreWeekend) {
            const multiplier = rule.weekendMultiplier || 1.1;
            dailyPrice = car.price * multiplier;
          }
        }

        // 🚗 Driver
        if (withDriver) {
          dailyPrice += DRIVER_CHARGE;
        }

        total += Math.round(dailyPrice);

        current.setDate(current.getDate() + 1);
      }

      basePrice = total;
    }
  }

  // PER HOUR
  if (bookingType === "hour" && fromDate && toDate) {
    const start = new Date(fromDate);
    const end = new Date(toDate);

    const diffHours = (end - start) / (1000 * 60 * 60);

    if (diffHours < MIN_HOURS) {
      setTotalDays(0);
      setTotalPrice(0);
      setFinalPrice(0);
      return;
    }

    const billableHours = Math.ceil(diffHours);
    days = billableHours;

    const pricePerHour = car.price / 24;

    const driverCost = withDriver
      ? billableHours * (DRIVER_CHARGE / 24)
      : 0;

    basePrice = billableHours * pricePerHour + driverCost;
  }

  // PER KM
  if (bookingType === "km") {
    let calculatedKM = kms;

    if (pickup && drop) {
      calculatedKM = getDistance(pickup, drop);
    }

    days = calculatedKM; // for UI display

    basePrice = Math.max(calculatedKM, MIN_KM) * PRICE_PER_KM;

    if (withDriver) {
      basePrice += DRIVER_CHARGE;
    }
  }

  // DISCOUNT LOGIC
  let discountAmount = 0;

  if (bookingType === "km" && kms >= 50) {
    discountAmount = basePrice * 0.10;
  }
  else if (
    rule.allowDiscount &&
    bookingType === "day" &&
    days >= (rule.discountAfterDays || 5)
  ) {
    discountAmount = basePrice * (rule.discountPercent || 0.10);
  }

  const final = basePrice - discountAmount;

  const roundedBase = Number(basePrice.toFixed(2));
const roundedDiscount = Number(discountAmount.toFixed(2));
const roundedFinal = Number(final.toFixed(2));

setTotalDays(days);
setTotalPrice(roundedBase);
setDiscount(roundedDiscount);
setFinalPrice(roundedFinal);
setFestivalCharge(Math.round(festivalExtra));

}, [bookingType, fromDate, toDate, kms, car, withDriver, pickup, drop]);

useEffect(() => {
  if (bookingType === "km" && pickup && drop) {
    const autoKM = getDistance(pickup, drop);
    setKms(autoKM);
  }
}, [pickup, drop, bookingType]);

  if (!car) {
    return <div className="text-white p-10">Car not found</div>;
  }

  if (!user) {
    return <div className="text-white p-10">Please login first</div>;
  }

  const handleProceedPayment = () => {
    
    if (bookingType === "day") {
      if (!fromDate || !toDate) {
        alert("Please select dates");
        return;
      }
 if (!pickup || !drop) {
    alert("Please select pickup & drop location");
    return;
  }
      if (new Date(toDate) < new Date(fromDate)) {
        alert("Invalid date range");
        return;
      }
    }

    if (bookingType === "hour") {
      if (!fromDate || !toDate) {
        alert("Please select start & end time");
        return;
      }

      if (new Date(toDate) <= new Date(fromDate)) {
        alert("Invalid time range");
        return;
      }

      const diff =
        (new Date(toDate) - new Date(fromDate)) /
        (1000 * 60 * 60);

      if (diff < MIN_HOURS) {
        alert("Minimum 4 hours required");
        return;
      }
    }

    if (bookingType === "km" && !kms) {
      alert("Please enter KM");
      return;
    }

 navigate("/payment", {
      state: {
        variant: {
          _id: car._id,
          name: car.name,
          company: car.company,
          price: car.price,
        },
        bookingType,   //  ADD THIS
        fromDate,
        toDate,
        kms,
        totalPrice: finalPrice,
        discount,
        pickupLocation: pickup,
        dropLocation: drop,
        withDriver,
        securityDeposit: SECURITY_DEPOSIT,
      },
    });
  };

  const totalHours =
    (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60);

    const hasWeekend = () => {
    if (!fromDate || !toDate) return false;

    let current = new Date(fromDate);
    const end = new Date(toDate);

    while (current <= end) {
      if (isWeekend(current.toISOString().split("T")[0])) {
        return true;
      }
      current.setDate(current.getDate() + 1);
    }

    return false;
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const minDateTime = getCurrentDateTime();

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">

        {/* LEFT IMAGE */}
        <div className="relative bg-[#0b0b0b] border border-yellow-500/30 rounded-3xl p-8 h-[875px] flex flex-col justify-between overflow-hidden">

            {/* 🔥 GLOW BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(255,200,0,0.15),transparent_60%)]"></div>

            {/* 🔝 TOP CONTENT */}
            <div className="relative z-10">

              {/* CATEGORY TAG */}
              <div className="inline-block px-4 py-1 border border-yellow-500/50 rounded-full text-xs text-yellow-400 mb-6">
                {car.category || "SUV Category"}
              </div>

              {/* TITLE */}
              <h2 className="text-3xl font-bold leading-tight">
                {car.company} <span className="text-yellow-500">{car.name}</span>
              </h2>

              {/* DETAILS */}
              <div className="mt-6 space-y-3 text-gray-300 text-sm">

                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">👤</span>
                  <span>Color: {car.color || "N/A"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">⚙️</span>
                  <span>AC: {car.ac}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users size={16} className="text-yellow-500" />
                  <span>Seats: {car.seating}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">🚗</span>
                  <span>₹{car.price}/day</span>
                </div>

              </div>
            </div>

            {/* 🚗 CAR IMAGE (BOTTOM FIXED) */}
            <div className="relative z-10 flex flex-col items-center justify-end h-[350px]">
              <div className="absolute bottom-8 w-[260px] h-[50px] bg-black/60 blur-2xl rounded-full"></div>
                <img
                  src={car?.image ? `${API_URL.replace("/api","")}${car.image}` : "/car.png"}
                  alt={car?.name || "car"}
                  className="w-[95%] object-contain drop-shadow-[0_0_50px_rgba(255,200,0,0.25)]"
                />
            </div>
          </div>

        {/* RIGHT DETAILS */}
        <div className="bg-[#0b0b0b] border border-yellow-500/30 rounded-3xl p-8 h-[875px] flex flex-col justify-between">

          {/* TOP */}
          <div>

            {/* TITLE */}
            <h2 className="text-2xl font-bold mb-6">
              {car.company} <span className="text-yellow-500">{car.name}</span>
            </h2>

            {/* BOOKING TYPE */}
           <div className="mb-5">
              <label className="text-sm text-gray-400 mb-2 block">
                Booking Type
              </label>

              <div className="flex bg-black border border-yellow-500/30 rounded-xl overflow-hidden">
                
                {["day", "hour", "km"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setBookingType(type)}
                    className={`flex-1 py-2 text-sm transition-all ${
                      bookingType === type
                        ? "bg-yellow-500 text-black font-semibold"
                        : "text-gray-400 hover:bg-yellow-500/10"
                    }`}
                  >
                    {type === "day"
                      ? "Per Day"
                      : type === "hour"
                      ? "Per Hour"
                      : "Per KM"}
                  </button>
                ))}
                
              </div>
            </div>

            {/* DYNAMIC INPUTS */}
            {bookingType === "day" && (
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">From Date</label>
                  <input
                    type="date"
                    min={minDate}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full bg-black border border-yellow-500/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">To Date</label>
                  <input
                    type="date"
                    min={minDate}
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full bg-black border border-yellow-500/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>
            )}

            {bookingType === "hour" && (
              <div className="mb-5">

                {/* GRID */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* START TIME */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      value={fromDate}
                      min={minDateTime}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full bg-black border border-yellow-500/30 rounded-xl px-4 py-3 text-sm"
                    />
                  </div>

                  {/* END TIME */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      value={toDate}
                      min={fromDate || minDateTime}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full bg-black border border-yellow-500/30 rounded-xl px-4 py-3 text-sm"
                    />
                  </div>

                </div>

                {/* ERROR OUTSIDE GRID */}
                {totalHours > 0 && totalHours < 4 && (
                  <p className="text-red-400 text-xs mt-2">
                    Minimum 4 hours required
                  </p>
                )}

              </div>
            )}

            {bookingType === "km" && (
              <div className="mb-5">
                <label className="text-sm text-gray-400 mb-2 block">
                  Select Distance (KM)
                </label>

                {/* SLIDER */}
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="1"
                  value={kms}
                  onChange={(e) => setKms(Number(e.target.value))}
                  className="w-full accent-yellow-500 cursor-pointer"
                />

                {pickup && drop && (
                  <p className="text-xs text-green-400 mt-2">
                    Auto Distance: {getDistance(pickup, drop)} KM
                  </p>
                )}

                {/* VALUE DISPLAY */}
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0 KM</span>
                  <span>{kms} KM</span>
                  <span>200 KM</span>
                </div>

                {/* MIN + PRICE INFO */}
                <p className="text-xs text-yellow-500 mt-2">
                  Min {MIN_KM} KM • ₹{PRICE_PER_KM}/KM
                </p>

                {/* LIVE CALC */}
                {kms > 0 && (
                  <p className="text-xs text-gray-300 mt-1">
                    {/* Charged: {Math.max(kms, MIN_KM)} KM • ₹ */}
                    {/* {Math.round(Math.max(kms, MIN_KM) * PRICE_PER_KM)} */}
                  </p>
                )}
              </div>
            )}

            {/* LOCATIONS */}
            <div className="space-y-4 mb-5">

              {/* PICKUP */}
              <div className="relative">
                <label className="text-sm text-gray-400 mb-2 block">Pickup Location</label>
                {/* ICON */}
                  <span className="absolute left-3 top-[38px] text-green-400">
                    ●
                  </span>
               <input
                  type="text"
                  value={pickup}
                  placeholder="Enter pickup location"
                  onFocus={() => setShowPickup(true)}
                  onBlur={() => setTimeout(() => setShowPickup(false), 150)}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full pl-8 bg-black border border-green-500/40 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/30"
                />

                {showPickup && (
                  <div className="absolute w-full bg-black border border-green-500/30 mt-1 rounded-xl z-[999]">
                    {locations
                      .filter((l) =>
                        l.area.toLowerCase().includes((pickup || "").toLowerCase())
                      )
                      .map((l, i) => (
                        <div
                          key={i}
                          onMouseDown={() => {
                            setPickup(l.area);
                            setShowPickup(false);
                          }}
                          className="px-4 py-2 hover:bg-green-500/20 cursor-pointer"
                        >
                          <p>{l.area}</p>
                          <p className="text-xs text-gray-400">{l.landmark}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>

                
              {/* DROP */}
              <div className="relative">
                <label className="text-sm text-gray-400 mb-2 block">Drop Location</label>
                  {/* ICON */}
                  <span className="absolute left-3 top-[38px] text-red-400">
                    ●
                  </span>
                  <input
                  type="text"
                  value={drop}
                  placeholder="Enter drop location"
                  onFocus={() => setShowDrop(true)}
                  onBlur={() => setTimeout(() => setShowDrop(false), 150)}
                  onChange={(e) => setDrop(e.target.value)}
                  className="w-full pl-8 bg-black border border-red-500/40 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/30"
                />

                {showDrop && (
                  <div className="absolute w-full bg-black border border-red-500/30 mt-1 rounded-xl z-[999]">
                    {locations
                      .filter((l) =>
                        l.area.toLowerCase().includes((drop || "").toLowerCase())
                      )
                      .map((l, i) => (
                        <div
                          key={i}
                          onMouseDown={() => {
                            setDrop(l.area);
                            setShowDrop(false);
                          }}
                          className="px-4 py-2 hover:bg-red-500/20 cursor-pointer"
                        >
                          <p>{l.area}</p>
                          <p className="text-xs text-gray-400">{l.landmark}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* PRICE BOX */}
            <div className="bg-black/40 border border-yellow-500/20 rounded-2xl p-4 space-y-3 mb-5">
              <div className="flex justify-between text-sm text-gray-400">
                <span>
                  {bookingType === "day"
                    ? "Total Days"
                    : bookingType === "hour"
                    ? "Total Hours"
                    : "Total KM"}
                </span>
                <span>{totalDays}</span>
              </div>

              {festivalCharge > 0 && (
                <p className="flex justify-between text-red-400">
                  <span>Festival Surge</span>
                  <span>+ ₹{festivalCharge}</span>
                </p>
              )}

              {bookingType === "day" && hasWeekend() && (
              <div className="bg-orange-500/10 border rounded-lg p-2 text-xs text-orange-300">
                ⚠ Weekend pricing is applied for selected dates (higher demand period)
              </div>
            )}

              <div className="flex justify-between text-sm text-gray-400">
                <span>Total Price</span>
                <span>₹{totalPrice}</span>
              </div>

              {/* DRIVER */}
              <div className="flex items-center justify-between pt-2 border-t border-yellow-500/20">
                <span className="text-sm text-gray-400">Add Driver</span>
                <button
                  onClick={() => setWithDriver(!withDriver)}
                  className={`w-10 h-5 rounded-full relative ${
                    withDriver ? "bg-yellow-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                      withDriver ? "left-5" : "left-0.5"
                    }`}
                  ></div>
                </button>
              </div>

              {withDriver && (
                <p className="text-xs text-yellow-500">
                  +₹{DRIVER_CHARGE}/day driver charge applied
                </p>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-green-400 text-sm">
                  <span>Discount</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              <div className="pt-2 border-t border-yellow-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400 font-semibold">Final Price</span>
                  <span className="text-xl font-bold text-yellow-500">
                    ₹{finalPrice}
                  </span>
                </div>

                {bookingType === "km" && (
                  <p className="text-xs text-gray-500 mt-1">
                    {KM_LIMIT_PER_DAY} KM/day included, ₹{EXTRA_KM_PRICE} per extra KM
                  </p>
                )}

                {bookingType === "hour" && (
                  <p className="text-xs text-gray-500">
                  Late return ₹{LATE_FEE_PER_HOUR}/hour after end time
                </p>
                )}

              </div>
            </div>

            {/* SECURITY */}
            <div className="flex justify-between text-sm text-gray-400 mb-4">
              <span>Security Deposit</span>
              <span className="text-white">₹{SECURITY_DEPOSIT}</span>
              </div>
            </div>

          {/* BUTTON */}
          <button
            onClick={handleProceedPayment}
            disabled={!isValid()}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300
              ${
                isValid()
                  ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;