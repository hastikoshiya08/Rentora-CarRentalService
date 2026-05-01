// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BookingPage from "./pages/BookingPage";
import SearchResultsPage from "./components/SearchResultsPage";
import ProfilePage from "./pages/ProfilePage";
import MyBookings from "./pages/MyBookings";
import AdminLayout from "./pages/admin/AdminLayout";
import RegisterAdmin from "./pages/admin/RegisterAdmin";
import AddVariants from "./pages/admin/AddVariants";
import Variants from "./pages/admin/Variants";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminCustomers from "./pages/admin/AdminCustomers";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import AdminRegister from "./pages/AdminRegister";
import AdminLogin from "./pages/AdminLogin";
import PaymentPage from "./pages/PaymentPage";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import ContactUs from "./components/ContactUs"
import About from "./pages/About";
import Cars from "./pages/Cars";
import ResetPassword from "./pages/ResetPassword";
import UserHome from "./pages/UserHome";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<> <LoginModal /> <Home /></>} />
        <Route path="/register" element={<><RegisterModal /> <Home /> </>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/contact-us" element={<><ContactUs /> <Home /></>} />
        <Route path="/about" element={<About />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
          <Route path="/mybookings" element={<MyBookings />} />
   
        <Route
          path="/user/UserHome"
          element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          }
        />

        {/* Protected routes */}
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchResultsPage />
          </ProtectedRoute>

        } />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <h1 className="text-2xl font-bold text-yellow-500 mb-4">Contact Submissions</h1>
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />

        <Route path="/admin/register" element={<><AdminRegister /> <Home /></>} />
        <Route path="/admin/login" element={<><AdminLogin /> <Home /></>} />
        {/* Admin ProtectedRoute */}

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="newregister" element={<RegisterAdmin />} />
          <Route path="add-variants" element={<AddVariants />} />
          <Route path="variants" element={<Variants />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="customers" element={<AdminCustomers />} />
           <Route path="mybookings" element={<MyBookings />} />
        </Route>
        
        {/* <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="newregister" element={<RegisterAdmin />} />
          <Route path="add-variants" element={<AddVariants />} />
          <Route path="variants" element={<Variants />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="customers" element={<AdminCustomers />} />
        </Route> */}
        
      </Routes>
    </>
  );
}

export default App;
