import React from "react";
import { Link } from "react-router-dom";
import { Car } from "lucide-react";
import { Instagram, Facebook } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full bg-black text-white pt-12 pb-6 px-6 border-t border-yellow-500/20">
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Car className="text-yellow-500" />
            <h2 className="text-xl font-bold">
              <span className="text-yellow-500">Rentora</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm">
            Premium car rental service in Surat. 
            Book your ride anytime, anywhere with ease.
          </p>
          <br></br>
<div className="flex items-center gap-5 mt-2">

  {/* Instagram */}
  <a
    href="https://instagram.com/yourpage"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-yellow-500 relative group transition"
  >
    <Instagram size={22} />
    <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-yellow-500 transition-all group-hover:w-full"></span>
  </a>

  {/* Facebook */}
  <a
    href="https://facebook.com/yourpage"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-yellow-500 relative group transition"
  >
    <Facebook size={22} />
    <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-yellow-500 transition-all group-hover:w-full"></span>
  </a>

</div>
        </div>

        {/* Quick Links */}
        {/* <div>
          <h3 className="text-yellow-500 font-semibold mb-3">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="text-gray-400 hover:text-yellow-500 transition">Home</Link>
            <Link to="/cars" className="text-gray-400 hover:text-yellow-500 transition">Cars</Link>
            <Link to="/about" className="text-gray-400 hover:text-yellow-500 transition">About Us</Link>
            <Link to="/contact-us" className="text-gray-400 hover:text-yellow-500 transition">Contact</Link>
          </div>
        </div>
         */}

         <div>
  <h3 className="text-yellow-500 font-semibold mb-4">Quick Links</h3>

  <div className="flex flex-col gap-2 text-sm">
    {["/", "/cars", "/about", "/contact-us"].map((path, i) => {
      const names = ["Home", "Cars", "About Us", "Contact"];

      return (
        <Link
          key={i}
          to={path}
          onClick={() => {
            if (path === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="text-gray-400 hover:text-yellow-500 relative group transition"
        >
          {names[i]}
          <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-yellow-500 transition-all group-hover:w-full"></span>
        </Link>
      );
    })}
  </div>
</div>

        {/* Legal */}
        <div>
          <h3 className="text-yellow-500 font-semibold mb-3">Legal</h3>
          <div className="flex flex-col gap-2 text-sm">
            <Link
      to="/privacy-policy"
      className="text-gray-400 hover:text-yellow-500 relative group transition"
    >
      Privacy Policy
      <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-yellow-500 transition-all group-hover:w-full"></span>
    </Link>
            <Link
      to="/terms-of-service"
      className="text-gray-400 hover:text-yellow-500 relative group transition"
    >
      Terms of Service
      <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-yellow-500 transition-all group-hover:w-full"></span>
    </Link>
          </div>
        </div>

        {/* Contact / CTA */}
        <div>
          <h3 className="text-yellow-500 font-semibold mb-3">Get in Touch</h3>
          <p className="text-gray-400 text-sm mb-3">
            Need help booking? Contact us anytime.
          </p>

         <a href="tel:+919876543220">
          <button className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-yellow-600 transition">
            📞 Call Now
          </button>
        </a>

          <div className="mt-4">
            {/* <Link
              to="/admin/register"
              className="text-gray-500 text-xs hover:text-yellow-500 transition"
            >
              Admin Register
            </Link> */}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-yellow-500/10 my-8"></div>

      {/* Bottom */}
      <p className="text-center text-gray-500 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="text-yellow-500">Rentora</span>. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;