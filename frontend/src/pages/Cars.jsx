import React from "react";
import { useLocation , useNavigate } from "react-router-dom";

import fortuner from "../assets/fortuner.jpg";
import bmw from "../assets/bmw.jpg";
import audi from "../assets/audi.jpg";
import creta from "../assets/creta.jpg";
import harrier from "../assets/harrier.jpg";
import swift from "../assets/Swift.jpg";
import i20 from "../assets/Hyundai i20.jpg";
import baleno from "../assets/Baleno.jpg";

const cars = [
  { name: "Toyota Fortuner", price: "₹3500/day", image: fortuner },
  { name: "BMW X5", price: "₹6500/day", image: bmw },
  { name: "Audi A6", price: "₹6000/day", image: audi },
  { name: "Hyundai Creta", price: "₹2500/day", image: creta },
  { name: "Tata Harrier", price: "₹2800/day", image: harrier },
  { name: "Maruti Swift", price: "₹1200/day", image: swift },
  { name: "Hyundai i20", price: "₹1500/day", image: i20 },
  { name: "Maruti Baleno", price: "₹1400/day", image: baleno }
];

function Cars() {
  const location = useLocation();
  const navigate = useNavigate();

  //  GET SEARCH PARAM
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search") || "";

  //  FILTER + SMART SORT
  const filteredCars = cars
    .filter((car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(searchTerm.toLowerCase());
      const bStarts = b.name.toLowerCase().startsWith(searchTerm.toLowerCase());

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="pt-24 bg-black min-h-screen text-white">

      {/* Heading */}
      <h1 className="text-4xl text-center font-bold mb-6">
        Our <span className="text-yellow-500">Cars</span>
      </h1>

      {/*  Show Search Text */}
      {searchTerm && (
        <p className="text-center text-gray-400 mb-8">
          Showing results for:{" "}
          <span className="text-yellow-500">{searchTerm}</span>
        </p>
      )}

      {/* Cars Grid */}
      <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">

        {filteredCars.length > 0 ? (
          filteredCars.map((car, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-yellow-500/10 hover:-translate-y-2 transition-all duration-300"
            >

              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover hover:scale-110 transition duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-5 text-center">
                <h3 className="font-semibold text-lg text-yellow-500">
                  {car.name}
                </h3>

                <p className="text-gray-300 mt-1">{car.price}</p>

                <button
                  onClick={() => navigate("/login")}
                  className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-full font-semibold hover:bg-yellow-600 transition shadow-md"
                >
                  Book Now
                </button>
              </div>

            </div>
          ))
        ) : (
          // ❌ No Result
          <div className="col-span-full text-center text-gray-400 text-lg">
            No cars found 😢
          </div>
        )}

      </div>

    </div>
  );
}

export default Cars;