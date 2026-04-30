import { useNavigate } from "react-router-dom";
import { Car, BadgeDollarSign, Headphones, Search, CalendarCheck, CarFront } from "lucide-react";

const WhyChooseUs = () => {

  const navigate = useNavigate();

  return (
    // <div className="w-full mt-10 bg-black py-16 px-6 text-center text-white">
    <div className="w-full bg-black py-16 px-6 text-center text-white">
      
      {/* Section Heading */}
      <h2 className="text-3xl font-bold mb-10">
        Why Choose <span className="text-yellow-500">Rentora</span> ?
      </h2>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
        
        {/* Feature 1 */}
        <div className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-6 rounded-2xl shadow hover:border-yellow-500 transition">
          <Car className="text-yellow-500 w-10 h-10 mb-4 mx-auto" />
          <h3 className="font-bold text-lg text-yellow-500">Wide Range of Cars</h3>
          <p className="text-gray-300 mt-2">Choose from economy to luxury vehicles.</p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-6 rounded-2xl shadow hover:border-yellow-500 transition">
          <BadgeDollarSign className="text-yellow-500 w-10 h-10 mb-4 mx-auto" />
          <h3 className="font-bold text-lg text-yellow-500">Affordable Pricing</h3>
          <p className="text-gray-300 mt-2">Best price guarantee with no hidden charges.</p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-6 rounded-2xl shadow hover:border-yellow-500 transition">
          <Headphones className="text-yellow-500 w-10 h-10 mb-4 mx-auto" />
          <h3 className="font-bold text-lg text-yellow-500">24/7 Customer Support</h3>
          <p className="text-gray-300 mt-2">We’re here to help you anytime, anywhere.</p>
        </div>
      </div>

      {/* How It Works */}
      <h2 className="text-3xl font-bold mb-10">
        How It <span className="text-yellow-500">Works</span>
      </h2>

      <div className="flex flex-col sm:flex-row justify-center gap-8 max-w-5xl mx-auto">
        
        {/* Step 1 */}
        <div className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-6 rounded-2xl shadow hover:border-yellow-500 transition w-full sm:w-1/3">
          <Search className="text-yellow-500 w-10 h-10 mb-4 mx-auto" />
          <h3 className="font-bold text-lg text-yellow-500">1. Search Your Car</h3>
          <p className="text-gray-300 mt-2">Use our search bar to find the perfect ride.</p>
        </div>

        {/* Step 2 */}
        <div className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-6 rounded-2xl shadow hover:border-yellow-500 transition w-full sm:w-1/3">
          <CalendarCheck className="text-yellow-500 w-10 h-10 mb-4 mx-auto" />
          <h3 className="font-bold text-lg text-yellow-500">2. Book Instantly</h3>
          <p className="text-gray-300 mt-2">Click ‘Book Now’ and fill in your details.</p>
        </div>

        {/* Step 3 */}
        <div className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-6 rounded-2xl shadow hover:border-yellow-500 transition w-full sm:w-1/3">
          <CarFront className="text-yellow-500 w-10 h-10 mb-4 mx-auto" />
          <h3 className="font-bold text-lg text-yellow-500">3. Pick Up & Drive</h3>
          <p className="text-gray-300 mt-2">Collect your car and enjoy the ride!</p>
        </div>

      </div>

      {/* CTA */}
      <div className="mt-12">
        <p className="text-gray-400 mb-4 font-semibold">
          Ready to find your perfect ride?
        </p>

        <button
          onClick={() => navigate("/cars")}
          className="bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-600 transition shadow-lg"
        >
          Explore Cars
        </button>
      </div>

    </div>
  );
};

export default WhyChooseUs;
// import { useNavigate } from "react-router-dom";
// import { Car, BadgeDollarSign, Headphones, Search, CalendarCheck, CarFront } from "lucide-react";

// const WhyChooseUs = () => {

//   const navigate = useNavigate();

//   return (
//     <div className="w-full mt-10 bg-white py-12 px-6 text-center rounded-2xl">
//       {/* Section Heading */}
//       <h2 className="text-3xl font-bold text-gray-800 mb-10">Why Choose <span className="text-blue-800">Rentora ?</span></h2>

//       {/* 3 Features */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
//         {/* Feature 1 */}
//         <div className="bg-[#DCD5FB] p-6 rounded-xl shadow flex flex-col items-center text-center">
//           <Car className="text-blue-800 w-10 h-10 mb-4" />
//           <h3 className="font-bold text-lg text-blue-800">Wide Range of Cars</h3>
//           <p className="text-gray-700 mt-2">Choose from economy to luxury vehicles.</p>
//         </div>

//         {/* Feature 2 */}
//         <div className="bg-[#DCD5FB] p-6 rounded-xl shadow flex flex-col items-center text-center">
//           <BadgeDollarSign className="text-blue-800 w-10 h-10 mb-4" />
//           <h3 className="font-bold text-lg text-blue-800">Affordable Pricing</h3>
//           <p className="text-gray-700 mt-2">Best price guarantee with no hidden charges.</p>
//         </div>

//         {/* Feature 3 */}
//         <div className="bg-[#DCD5FB] p-6 rounded-xl shadow flex flex-col items-center text-center">
//           <Headphones className="text-blue-800 w-10 h-10 mb-4" />
//           <h3 className="font-bold text-lg text-blue-800">24/7 Customer Support</h3>
//           <p className="text-gray-700 mt-2">We’re here to help you anytime, anywhere.</p>
//         </div>
//       </div>

//       {/* How It Works Section */}
//       <h2 className="text-3xl font-bold text-gray-800 mb-10">How It Works</h2>
//       <div className="flex flex-col sm:flex-row justify-center gap-8 max-w-5xl mx-auto">
//         {/* Step 1 */}
//         <div className="bg-[#DCD5FB] p-6 rounded-xl shadow flex flex-col items-center text-center w-full sm:w-1/3">
//           <Search className="text-blue-800 w-10 h-10 mb-4" />
//           <h3 className="font-bold text-lg text-blue-800">1. Search Your Car</h3>
//           <p className="text-gray-700 mt-2">Use our search bar to find the perfect ride.</p>
//         </div>

//         {/* Step 2 */}
//         <div className="bg-[#DCD5FB] p-6 rounded-xl shadow flex flex-col items-center text-center w-full sm:w-1/3">
//           <CalendarCheck className="text-blue-800 w-10 h-10 mb-4" />
//           <h3 className="font-bold text-lg text-blue-800">2. Book Instantly</h3>
//           <p className="text-gray-700 mt-2">Click ‘Book Now’ and fill in your details.</p>
//         </div>

//         {/* Step 3 */}
//         <div className="bg-[#DCD5FB] p-6 rounded-xl shadow flex flex-col items-center text-center w-full sm:w-1/3">
//           <CarFront className="text-blue-800 w-10 h-10 mb-4" />
//           <h3 className="font-bold text-lg text-blue-800">3. Pick Up & Drive</h3>
//           <p className="text-gray-700 mt-2">Collect your car and enjoy the ride!</p>
//         </div>

//       </div>

//       <br></br>

//       <p className="text-gray-600 mb-4 font-semibold">Ready to find your perfect ride?</p>
      
//       <br></br>

//       {/* Explore Cars Button AFTER How It Works */}
//       <button
//         onClick={() => navigate("/cars")}
//         className="bg-blue-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
//       >
//         Explore Cars
//       </button>

//     </div>
//   );
// };

// export default WhyChooseUs;
