 import React, { useState, useEffect } from "react";
import axios from "axios";

const AddVariants = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const carVariants = {
        SUV: [
          { name: "Creta", company: "Hyundai", category: "SUV", seating: 5, ac: "AC", price: 2500 },
          { name: "Venue", company: "Hyundai", category: "SUV", seating: 5, ac: "AC", price: 2000 },
          { name: "Seltos", company: "Kia", category: "SUV", seating: 5, ac: "AC", price: 2600 },
          { name: "Scorpio", company: "Mahindra", category: "SUV", seating: 7, ac: "AC", price: 3200 },
          { name: "Brezza", company: "Maruti", category: "SUV", seating: 5, ac: "AC", price: 2200 },
          { name: "Safari", company: "Tata", category: "SUV", seating: 7, ac: "AC", price: 3500 },
          { name: "Fortuner", company: "Toyota", category: "SUV", seating: 7, ac: "AC", price: 5000 }
        ],

        Sedan: [
          { name: "Amaze", company: "Honda", category: "Sedan", seating: 5, ac: "AC", price: 2000 },
          { name: "City", company: "Honda", category: "Sedan", seating: 5, ac: "AC", price: 2800 },
          { name: "Aura", company: "Hyundai", category: "Sedan", seating: 5, ac: "AC", price: 1800 },
          { name: "Verna", company: "Hyundai", category: "Sedan", seating: 5, ac: "AC", price: 2700 },
          { name: "Ciaz", company: "Maruti", category: "Sedan", seating: 5, ac: "AC", price: 2400 },
          { name: "Tigor", company: "Tata", category: "Sedan", seating: 5, ac: "AC", price: 1800 }
        ],

        Hatchback: [
          { name: "i10", company: "Hyundai", category: "Hatchback", seating: 5, ac: "AC", price: 1500 },
          { name: "i20", company: "Hyundai", category: "Hatchback", seating: 5, ac: "AC", price: 1800 },
          { name: "Baleno", company: "Maruti", category: "Hatchback", seating: 5, ac: "AC", price: 1700 },
          { name: "Swift", company: "Maruti", category: "Hatchback", seating: 5, ac: "AC", price: 1500 },
          { name: "WagonR", company: "Maruti", category: "Hatchback", seating: 5, ac: "AC", price: 1300 },
          { name: "Tiago", company: "Tata", category: "Hatchback", seating: 5, ac: "AC", price: 1400 }
        ],

        Mini: [
          { name: "Alto 800", company: "Maruti", category: "Mini", seating: 4, ac: "Non-AC", price: 900 },
          { name: "Santro", company: "Hyundai", category: "Mini", seating: 5, ac: "AC", price: 1200 },
          { name: "Celerio", company: "Maruti", category: "Mini", seating: 5, ac: "AC", price: 1400 },
          { name: "S-Presso", company: "Maruti", category: "Mini", seating: 4, ac: "AC", price: 1200 },
          { name: "Kwid", company: "Renault", category: "Mini", seating: 5, ac: "AC", price: 1200 },
          { name: "Altroz", company: "Tata", category: "Mini", seating: 5, ac: "AC", price: 1600 }
        ],

        Luxury: [
          { name: "BMW 5 Series", company: "BMW", category: "Luxury", seating: 5, ac: "AC", price: 8000 },
          { name: "BMW 7 Series", company: "BMW", category: "Luxury", seating: 5, ac: "AC", price: 12000 },
          { name: "Audi A4", company: "Audi", category: "Luxury", seating: 5, ac: "AC", price: 7500 },
          { name: "Audi A6", company: "Audi", category: "Luxury", seating: 5, ac: "AC", price: 9500 },
          { name: "Mercedes C-Class", company: "Mercedes", category: "Luxury", seating: 5, ac: "AC", price: 9000 },
          { name: "Jaguar XF", company: "Jaguar", category: "Luxury", seating: 5, ac: "AC", price: 10000 },
          { name: "Volvo S90", company: "Volvo", category: "Luxury", seating: 5, ac: "AC", price: 8500 }
        ]
};

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    type: "",
    price: "",
    seating: "",
    ac: "",
    image: null,
    imagePreview: null,
  });

  const [variants, setVariants] = useState([]);

  useEffect(() => {
    fetchVariants();
  }, []);

  const fetchVariants = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/variants`);
      setVariants(data);
    } catch (err) {
      console.error("Error fetching variants:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type: inputType, files } = e.target;

    if (inputType === "file") {
      const file = files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: imageUrl,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.company || !formData.image) return;

    const data = new FormData();

    data.append("name", formData.name);
    data.append("company", formData.company);
    data.append("type", formData.type);
    data.append("price", formData.price);
    data.append("seating", formData.seating);
    data.append("ac", formData.ac);
    data.append("image", formData.image);

    try {
      await axios.post(`${API_URL}/variants/add`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchVariants();

      setFormData({
        name: "",
        company: "",
        type: "",
        price: "",
        seating: "",
        ac: "",
        image: null,
        imagePreview: null,
      });

    } catch (err) {
      console.error("Error adding variant:", err);
    }
  };

  return (
    <div className="px-6 py-6 text-white">

      <h1 className="text-2xl font-bold mb-6">
        Add Car <span className="text-yellow-500">Variant</span>
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-yellow-500/20 p-6 rounded-xl backdrop-blur-md space-y-6"
      >

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <select
            name="name"
            value={formData.name}
            onChange={(e) => {
              const selectedCar = carVariants[formData.type].find(
                (c) => c.name === e.target.value
              );

              setFormData({
                ...formData,
                name: selectedCar.name,
                company: selectedCar.company, 
                seating: selectedCar.seating,
                ac: selectedCar.ac,
                price: selectedCar.price
              });
            }}
            className="p-2 bg-black border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Select Car Variant</option>

            {formData.type &&
              carVariants[formData.type].map((car, i) => (
                <option key={i} value={car.name}>
                  {car.name}
                </option>
              ))}
          </select>

          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            disabled
            className="p-2 bg-black border border-gray-700 rounded text-gray-400"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="p-2 bg-black border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Select Type</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Mini">Mini</option>
            <option value="Luxury">Luxury</option>
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price / day"
            value={formData.price}
            onChange={handleChange}
            className="p-2 bg-black border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <input
            type="number"
            name="seating"
            placeholder="Seating Capacity"
            value={formData.seating}
            onChange={handleChange}
            className="p-2 bg-black border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <select
            name="ac"
            value={formData.ac}
            onChange={handleChange}
            className="p-2 bg-black border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">AC Condition</option>
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
          </select>

          {/* IMAGE */}
          <div className="flex flex-col gap-2">

            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="border border-gray-700 p-2 rounded bg-black"
            />

            {formData.imagePreview ? (
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="h-24 w-full object-cover rounded border border-gray-700"
              />
            ) : (
              <div className="h-24 w-full bg-black border border-gray-700 rounded flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

          </div>

        </div>

        <div className="flex justify-end">

          <button
            type="submit"
            className="bg-yellow-500 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-600 transition"
          >
            Add Variant
          </button>

        </div>

      </form>

      {/* VARIANTS LIST */}

      {variants.length > 0 && (

        <div className="mt-10">

          <h2 className="text-xl font-semibold mb-4">
            Variants <span className="text-yellow-500">List</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {variants.map((v, i) => (

              <div
                key={i}
                className="bg-white/5 border border-yellow-500/20 rounded-xl p-4 backdrop-blur-md hover:border-yellow-500 transition"
              >

                <img
                  src={`${API_URL.replace("/api", "")}${v.image}`}
                  alt={v.name}
                  className="h-40 w-full object-cover rounded mb-3"
                />

                <h3 className="text-lg font-semibold">{v.name}</h3>

                <p className="text-gray-400">{v.company}</p>

                <p className="text-sm text-gray-500">
                  {v.type} • {v.seating} Seater • {v.ac}
                </p>

                <p className="text-yellow-500 font-bold mt-2">
                  ₹{v.price}/day
                </p>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
};

export default AddVariants; 