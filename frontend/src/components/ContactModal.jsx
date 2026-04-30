import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ContactModal = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  //  INPUT CHANGE
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  FINAL SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(" SUBMIT CLICKED", formData);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/contacts",
        formData
      );

      console.log("✅ SAVED:", res.data);

      setSubmitted(true);
    } catch (err) {
      console.error("❌ ERROR:", err);
    }

    setTimeout(() => {
      navigate(from);
    }, 2000);
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl mb-4">Contact Us</h2>

      {submitted ? (
        <p className="text-green-400">Message Sent Successfully ✅</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 bg-black border"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 bg-black border"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 bg-black border"
            required
          />

          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 bg-black border"
            required
          />

          {/*  IMPORTANT BUTTON */}
          <button
            type="submit"
            className="bg-yellow-500 text-black px-4 py-2"
          >
            Send Message
          </button>

        </form>
      )}
    </div>
  );
};

export default ContactModal;