import React from "react";

function About() {
  return (
    <div className="pt-24 bg-black min-h-screen text-white">

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Heading */}
        <h1 className="text-4xl font-bold text-center">
          About <span className="text-yellow-500">Rentora</span>
        </h1>

        {/* Description */}
        <p className="text-center mt-4 text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Rentora is a smart car rental platform designed to help you
          easily search, compare, and book cars online. Whether you need
          a ride for travel, business, or daily commute — we deliver
          comfort, convenience, and reliability.
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">

          {/* Mission */}
          <div className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-6 rounded-2xl shadow hover:border-yellow-500 transition">
            <h3 className="text-xl font-semibold text-yellow-500 mb-2">
              Our Mission
            </h3>
            <p className="text-gray-300">
              To provide affordable, reliable, and comfortable car rentals
              for everyone with a seamless booking experience.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-6 rounded-2xl shadow hover:border-yellow-500 transition">
            <h3 className="text-xl font-semibold text-yellow-500 mb-2">
              Our Vision
            </h3>
            <p className="text-gray-300">
              To become the most trusted and preferred car rental platform
              with exceptional customer satisfaction.
            </p>
          </div>

          {/* Values */}
          <div className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-6 rounded-2xl shadow hover:border-yellow-500 transition">
            <h3 className="text-xl font-semibold text-yellow-500 mb-2">
              Our Values
            </h3>
            <p className="text-gray-300">
              Transparency, innovation, and customer-first approach drive
              everything we do at Rentora.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default About;