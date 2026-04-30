import React from "react";
import { Mail, Phone } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">

      <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 sm:p-10 shadow-2xl">

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
          Terms of <span className="text-yellow-500">Service</span>
        </h1>

        <p className="mb-6 text-gray-300 text-center max-w-3xl mx-auto">
          Welcome to <strong className="text-yellow-500">Rentora</strong>. By using our platform,
          you agree to these terms. Please read them carefully.
        </p>

        {/* Sections */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-500">1. Eligibility</h2>
          <p className="text-gray-300">
            You must be at least 18 years old and have a valid driving licence.
            Providing false information may lead to account termination.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-500">2. User Responsibilities</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>Provide accurate details during registration.</li>
            <li>Take full responsibility for the vehicle.</li>
            <li>Return the car in proper condition.</li>
            <li>Follow all traffic laws.</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-500">3. Bookings & Payments</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>Bookings depend on availability.</li>
            <li>Payments are processed securely.</li>
            <li>Prices may vary based on selection.</li>
            <li>Refunds follow cancellation policy.</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-500">
            4. Driver Service & Security Deposit
          </h2>

          <ul className="list-disc ml-6 space-y-3 text-gray-300">

            <li>
              <strong>Driver Service (Optional):</strong> Customers may choose to add a driver during booking.
              A fixed charge of ₹600 per day will be applied. Driver availability depends on confirmation.
            </li>

            <li>
              <strong>Security Deposit:</strong> A refundable security deposit is required at the time of booking.
              The amount will be shown before payment.
            </li>

            <li>
              <strong>Refund Policy:</strong> The deposit will be refunded after vehicle inspection if no damage,
              delay, or violations occur. Applicable charges will be deducted if necessary.
            </li>

            <li>
              <strong>Additional Charges:</strong> Late returns, extra usage, or traffic fines may result in
              extra charges and may be adjusted from the deposit.
            </li>

            <li>
              <strong>Responsibility:</strong> The customer remains responsible for the vehicle during the
              rental period, even when a driver is hired.
            </li>

          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-500">5. Prohibited Uses</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>Illegal activities or misuse.</li>
            <li>Racing or reckless driving.</li>
            <li>Unauthorized sharing of vehicle.</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-500">6. Liability</h2>
          <p className="text-gray-300">
            Rentora is not responsible for damages or accidents during rental.
            Users are fully responsible for penalties or misuse.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-500">7. Account Suspension</h2>
          <p className="text-gray-300">
            We may suspend accounts for violations or misuse of services.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-500">8. Updates</h2>
          <p className="text-gray-300">
            Terms may change over time. Continued use means acceptance.
          </p>
        </section>

        {/* Contact */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3 text-yellow-500">
            8. Contact Us
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-yellow-500" />
              <a href="mailto:info@rentora.com" className="hover:underline">
                info@rentora.com
              </a>
            </div>

          <div className="flex items-center gap-2">
            <Phone size={16} className="text-yellow-500" />
            <a href="tel:+919876543220" className="hover:underline">
              +91 98765 43220
            </a>
          </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default TermsOfService;