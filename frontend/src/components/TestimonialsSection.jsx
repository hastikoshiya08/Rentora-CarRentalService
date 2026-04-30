
import { motion as _motion } from "framer-motion";
import { useMemo } from "react";
import AvatarImg from "../assets/avtar.png"; 

const generateTestimonials = () => {
  const comments = [
    "Smooth booking experience. Car was in great condition!",
    "Very affordable and professional service. Will use again.",
    "Customer support was super helpful during the whole process.",
    "Booked a car last minute for a weekend trip — process was seamless and the car was spotless!",
    "Highly recommend this platform for hassle-free car rentals.",
    "Amazing service! The car was clean and comfortable.",
    "Quick and easy booking process. Loved it!",
    "Staff was polite and helpful, very satisfied.",
    "Best car rental experience I've had so far.",
    "Perfect for weekend trips. Will use again.",
  ];

  const names = [
    "Rahul Sharma", "Priya Patel", "Amit Verma", "Sneha Iyer",
    "Karan Mehta", "Neha Gupta", "Arjun Reddy", "Pooja Shah",
    "Rohit Jain", "Ananya Das"
  ];

  let testimonials = [];

  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * 7) + 1;

    testimonials.push({
      text: comments[Math.floor(Math.random() * comments.length)],
      name: names[Math.floor(Math.random() * names.length)],
      location: "Surat, Gujarat",
      date: `${daysAgo} days ago`,
      rating: Math.floor(Math.random() * 2) + 4 // 4 or 5 stars
    });
  }

  return testimonials.sort(() => Math.random() - 0.5);
};

const TestimonialsSection = () => {
  const testimonials = useMemo(() => generateTestimonials(), []);
  const displayedTestimonials = testimonials.slice(0, 4);

  return (
    <div className="w-full bg-black py-20 px-6 text-center">

      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
        What Our Customers Say
        <span className="block text-yellow-500 text-lg mt-2">
          Trusted by hundreds of happy users
        </span>
      </h2>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-stretch">
        

        {displayedTestimonials.map((testimonial, index) => (
        <_motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 p-5 rounded-xl backdrop-blur-md hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 flex flex-col"
        >

          {/* Header */}
          <div className="flex items-start justify-between mb-3">

            <div className="flex items-center gap-3">
              {/* Initial Avatar */}
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500 text-black font-semibold">
                {testimonial.name.charAt(0)}
              </div>

              {/* Name + Location */}
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-white">
                  {testimonial.name}
                </span>
                <span className="text-xs text-gray-400">
                  {testimonial.location}
                </span>
              </div>
            </div>

            {/* Date */}
            <span className="text-xs text-gray-500">
              {testimonial.date}
            </span>

          </div>

          {/* Rating */}
          <div className="text-yellow-400 text-sm mb-2">
            {"⭐".repeat(testimonial.rating)}
          </div>

          {/* Review Text */}
          <p className="text-gray-300 text-sm leading-relaxed flex-grow">
            {testimonial.text}
          </p>

          {/* Footer */}
          {/* <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-green-400">
              ✔ Verified Booking
            </span>
            <span className="text-yellow-500 text-lg">❝</span>
          </div> */}

        </_motion.div>
        ))}

      </div>
    </div>
  );
};

export default TestimonialsSection;