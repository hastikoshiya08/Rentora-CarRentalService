//PaymentPage.js

import generateInvoice from "../utils/generateInvoice";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PaymentPage = () => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    console.log("RAZORPAY KEY:", razorpayKey);
    
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [bookingType, setBookingType] = useState("day");
    const [variant, setVariant] = useState(null);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const stateDriver = location.state?.withDriver;
    const [withDriver, setWithDriver] = useState(false);
    const DRIVER_CHARGE = 600;
    const securityDeposit = location.state?.securityDeposit || 0;

    useEffect(() => {
        const stateVariant = location.state?.variant;
        const stateFrom = location.state?.fromDate;
        const stateTo = location.state?.toDate;
        const statePrice = location.state?.totalPrice;

        const savedVariant = JSON.parse(localStorage.getItem("selectedVariant"));

        if (!stateVariant && !savedVariant) {
            navigate("/search");
            return;
        }

        const finalVariant = stateVariant || savedVariant;

        if (!finalVariant._id) {
            alert("Invalid variant data.");
            navigate("/search");
            return;
        }

        setVariant(finalVariant);
        setFromDate(stateFrom || localStorage.getItem("fromDate"));
        setToDate(stateTo || localStorage.getItem("toDate"));
        setTotalPrice(statePrice || Number(localStorage.getItem("totalPrice")));
        setWithDriver(stateDriver || false);

        setBookingType(location.state?.bookingType || "day");
    }, [location.state, navigate]);

    const handlePayment = async () => {
        if (!user || !variant) {
            alert("Missing data.");
            return;
        }

    try {
    const { data: order } = await axios.post(
        `${API_URL}/payment/create-order`,
       { amount: (totalPrice + securityDeposit) * 100 }
    );

    const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Rentora",
        description: `${variant.company} ${variant.name} Booking`,
        order_id: order.id,

        handler: async function (response) {
            try {
                // Only ONE verify call
                const { data: booking } = await axios.post(
                    `${API_URL}/payment/verify`,
                    {
                        userId: user._id,
                        variantId: variant._id,
                        fromDate: fromDate || null,
                        toDate: toDate || null,
                        totalPrice,
                        withDriver,
                        paymentId: response.razorpay_payment_id,
                    }
                    
                );

    const handleInvoice = (b) => {
    const bookingData = {
        id: b.paymentId,
        customer: b.user?.name,

        //  ADD THIS
        phone: b.user?.phone || "N/A",
        email: b.user?.email || "N/A",

        carVariant: `${b.variant?.company} ${b.variant?.name}`,
        fromDate: b.fromDate,
        toDate: b.toDate,

        totalDays:
        Math.ceil(
            (new Date(b.toDate) - new Date(b.fromDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1,

        price: b.totalPrice,
        paymentStatus: b.paymentStatus,

        //  ADD THIS
        approvalStatus: b.approvalStatus || "Pending",

        bookingTime: new Date(b.createdAt).toLocaleString(),
    };

    generateInvoice(bookingData);
    };

    alert("Booking Successful!");

    navigate("/mybookings");

    } catch (error) {
            console.error(error);
            alert("Payment verification failed");
        }
    },
     theme: { color: "#eab308" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    } catch (err) {
        console.error(err);
        alert("Payment failed.");
    }
    }

    if (!variant) return null;

    const totalDays =
        Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)) + 1;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
        };

        const formatDateTime = (date) => {
        return new Date(date).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
        };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4 py-10">

            <div className="bg-white/5 backdrop-blur-md border border-yellow-500/20 shadow-xl rounded-2xl w-full max-w-lg p-8">

                {/* Heading */}
                <h2 className="text-3xl font-bold text-center text-yellow-500 mb-6">
                    Complete Your <span className="text-yellow-500">Payment</span>
                </h2>

                {/* Info Boxes */}
                <div className="space-y-3">

                {/* CAR */}
                <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl">
                    <span className="text-gray-400 text-sm">Car</span>
                    <span className="text-white font-medium">
                    {variant.company} {variant.name}
                    </span>
                </div>

                {/* KM SECTION */}
                {bookingType === "km" && (
                    <>
                    <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl">
                        <span className="text-gray-400 text-sm">Distance</span>
                        <span className="text-white font-medium">
                        {location.state?.kms} KM
                        </span>
                    </div>

                    <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl">
                        <span className="text-gray-400 text-sm">Total KM</span>
                        <span className="text-white font-medium">
                        {location.state?.kms}
                        </span>
                    </div>
                    </>
                )}

                {/* DATE SECTION */}
                {bookingType !== "km" && (
                    <>
                    <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl">
                        <span className="text-gray-400 text-sm">From</span>
                        <span className="text-white font-medium">
                        {bookingType === "hour"
                            ? formatDateTime(fromDate)
                            : formatDate(fromDate)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl">
                        <span className="text-gray-400 text-sm">To</span>
                        <span className="text-white font-medium">
                        {bookingType === "hour"
                            ? formatDateTime(toDate)
                            : formatDate(toDate)}
                        </span>
                    </div>
                    </>
                )}

                {/* DRIVER */}
                {withDriver && (
                    <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl">
                    <span className="text-gray-400 text-sm">Driver</span>
                    <span className="text-white font-medium">₹600</span>
                    </div>
                )}

                {/* PRICE BOX (HIGHLIGHTED) */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-2 space-y-2">
                    
                    <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Car Price</span>
                    <span className="text-white">₹{variant.price}</span>
                    </div>

                    {withDriver && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Driver</span>
                        <span className="text-white">₹600</span>
                    </div>
                    )}

                    <div className="flex justify-between font-semibold text-yellow-400 text-lg pt-2 border-t border-yellow-500/20">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                    </div>
                </div>
            </div>

                {/* EXTRA SECTION */}
                <div className="space-y-3 mt-4">

                <div className="flex justify-between bg-white/5 px-4 py-3 rounded-xl">
                    <span className="text-gray-400 text-sm">Rental Price</span>
                    <span className="text-white">₹{totalPrice}</span>
                </div>

                <div className="flex justify-between bg-white/5 px-4 py-3 rounded-xl">
                    <span className="text-gray-400 text-sm">Security Deposit</span>
                    <span className="text-white">₹{securityDeposit}</span>
                </div>

                <p className="text-xs text-gray-500 px-1">
                    *Security deposit is refundable after trip completion
                </p>

                <div className="flex justify-between bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30 text-white font-semibold">
                    <span>Total Payable:</span>
                    <span>₹{totalPrice + securityDeposit}</span>
                </div>

                </div>

                {/* <div className="flex justify-between bg-white/10 p-4 rounded-lg">
                    <span className="text-white/70">Rental Price:</span>
                    <span className="text-white">₹{totalPrice}</span>
                </div>

                <div className="flex justify-between bg-white/10 p-4 rounded-lg">
                    <span className="text-white/70">Security Deposit(Refundable):</span>
                    <span className="text-white">₹{securityDeposit}</span>
                </div> */}

                {/* Button */}
                <button
                    onClick={handlePayment}
                    className="w-full mt-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold text-lg hover:bg-yellow-400 transition-all duration-300 shadow-lg"
                >
                    Pay Now
                </button>


            </div>

        </div>
    );
};

export default PaymentPage;