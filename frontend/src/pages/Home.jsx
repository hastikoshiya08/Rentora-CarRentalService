import React, { useRef } from "react";
import Hero from '../components/Hero';
import SearchSection from '../components/SearchSection';
import WhyChooseUs from "../components/WhyChooseUs";
import TestimonialsSection from "../components/TestimonialsSection";
import Footer from "../components/Footer";

function Home() {
   
    
  return (
    <div className="pt-16">
    <Hero  />
    <WhyChooseUs />
    <TestimonialsSection />
    <Footer />
    
    </div>
  );
}

export default Home