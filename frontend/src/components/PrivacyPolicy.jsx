import React from "react";
import { Mail, Phone } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">

      <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 sm:p-10 shadow-2xl">

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
          Privacy <span className="text-yellow-500">Policy</span>
        </h1>

        <p className="mb-6 text-gray-300 text-center max-w-3xl mx-auto">
          Welcome to <strong className="text-yellow-500">Rentora</strong>. Your privacy is important to us. 
          This policy explains how we collect, use, and protect your data.
        </p>

        {/* Section */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-500">
            1. Information We Collect
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>Personal details like name, email, phone number.</li>
            <li>Government IDs (Aadhaar, Driving Licence).</li>
            <li>Booking and payment details.</li>
            <li>Device and usage data.</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-500">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>To process bookings and payments.</li>
            <li>To verify identity and prevent fraud.</li>
            <li>To improve services and support.</li>
            <li>To send updates (with your consent).</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-500">
            3. Sharing of Information
          </h2>
          <p className="text-gray-300 mb-3">
            We do not sell your data. We may share it only:
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>With payment/service providers.</li>
            <li>If required by law.</li>
            <li>To prevent fraud or misuse.</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-500">
            4. Data Security
          </h2>
          <p className="text-gray-300">
            We use secure systems and encryption to protect your data. However,
            no system is completely secure.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-500">
            5. Your Rights
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>Access, update, or delete your data.</li>
            <li>Opt out of promotional messages.</li>
            <li>Request account deletion anytime.</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-500">
            6. Updates
          </h2>
          <p className="text-gray-300">
            We may update this policy occasionally. Changes will be reflected here.
          </p>
        </section>

        {/* Contact */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3 text-yellow-500">
            7. Contact Us
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 text-gray-300">
            
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-yellow-500" />
              <span>info@rentora.com</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone size={16} className="text-yellow-500" />
              <span>+91 98765 43220</span>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;