import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import axios from "axios";

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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("SUBMIT CLICKED", formData);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/contacts",
        formData
      );

      console.log("SAVED:", res.data);

      setSubmitted(true);

      setTimeout(() => {
        navigate(from);
      }, 2000);

    } catch (err) {
      console.error("ERROR:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-center items-center px-4">
      
      {/* Modal */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl text-white">

        {/* Close */}
        <button
          onClick={() => navigate(from)}
          className="absolute top-3 right-4 text-gray-400 text-xl hover:text-yellow-500 transition"
        >
          &times;
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          Contact <span className="text-yellow-500">Us</span>
        </h2>

        {submitted ? (
          <p className="text-green-400 text-center font-medium">
            ✅ Thank you! We’ll get back to you soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="name"
                required
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-black/40 border border-yellow-500/20 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                required
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-black/40 border border-yellow-500/20 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="tel"
                name="phone"
                required
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleChange}
                pattern="[6-9]{1}[0-9]{9}"
                maxLength="10"
                className="w-full pl-10 pr-3 py-2 bg-black/40 border border-yellow-500/20 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            {/* Message */}
            <div className="relative">
              <MessageCircle className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea
                name="message"
                required
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full pl-10 pr-3 py-2 bg-black/40 border border-yellow-500/20 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
              ></textarea>
            </div>

            {/* Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-yellow-500 text-black py-2 rounded-full font-semibold hover:bg-yellow-600 transition shadow-md"
            >
              Send Message
            </button>
          </form>
        )}

        {/* Contact Info */}
        <div className="mt-6 text-gray-400 text-sm space-y-2">
          <div className="flex items-center justify-center gap-2">
            <MapPin size={16} className="text-yellow-500" />
            <span>Surat, Gujarat</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Mail size={16} className="text-yellow-500" />
            <span>info@rentora.com</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone size={16} className="text-yellow-500" />
            <span>+91 98765 43220</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactModal;