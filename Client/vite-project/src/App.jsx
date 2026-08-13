import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./Components/Navbar";
import SplashLoader from "./Components/SplashLoader";

// Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import About from "./Pages/About";
import Booking from "./Pages/Booking";
import Cars from "./Pages/Cars";
import BuyCars from "./Pages/BuyCars";
import Contact from "./Pages/Contact";
import PaymentFailed from "./Pages/PaymentFailed";
import PaymentSuccess from "./Pages/PaymentSucess";
import Register from "./Pages/Register";
import Services from "./Pages/Services";
import Support from "./Pages/Support";
import UserDashboard from "./Pages/UserDashboard";
import AdminDashboard from "./Pages/AdminDashboard";

const App = () => {
  const [showSplash, setShowSplash] = useState(
    !sessionStorage.getItem("splashPlayed")
  );

  const handleSplashComplete = () => {
    sessionStorage.setItem("splashPlayed", "true");
    setShowSplash(false);
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashLoader onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Navbar */}
          <Navbar />

          {/* Routes */}
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Cars */}
            <Route path="/cars" element={<Cars />} />
            <Route path="/buy" element={<BuyCars />} />

            {/* Other Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/support" element={<Support />} />

            {/* Booking */}
            <Route path="/booking" element={<Booking />} />

            {/* User Dashboard */}
            <Route path="/dashboard" element={<UserDashboard />} />

            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Payment */}
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
          </Routes>
        </motion.div>
      )}
    </>
  );
};

export default App;