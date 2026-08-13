import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  FaCar,
  FaTag,
  FaShoppingCart,
  FaCreditCard,
  FaCheckCircle,
  FaCalendarAlt,
  FaInfoCircle,
  FaChevronRight,
} from "react-icons/fa";

const BuyCars = () => {
  const { user, token, API_URL } = useAuth();
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Simulated Checkout fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const fetchSaleCars = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/cars?purpose=sale`);
      const data = await response.json();
      if (data.success) {
        setCars(data.cars);
      } else {
        setError(data.message || "Failed to load cars for sale.");
      }
    } catch (err) {
      console.error("Error loading cars for sale:", err);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSaleCars();
  }, [fetchSaleCars]);

  const handleBuyClick = (car) => {
    if (!token) {
      navigate("/login", { state: { from: "/buy" } });
      return;
    }
    setSelectedCar(car);
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv) {
      alert("Please fill in card details.");
      return;
    }

    setPurchasing(true);

    try {
      const response = await fetch(`${API_URL}/purchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          carId: selectedCar._id,
          price: selectedCar.price,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPurchaseSuccess(true);
        // Refresh fleet
        fetchSaleCars();
      } else {
        alert(data.message || "Purchase failed.");
      }
    } catch (err) {
      console.error("Purchase error:", err);
      alert("Server connection error.");
    } finally {
      setPurchasing(false);
    }
  };

  const closeCheckoutModal = () => {
    setSelectedCar(null);
    setPurchaseSuccess(false);
    setCardNumber("");
    setExpiry("");
    setCvv("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-55/60 via-amber-50/40 via-orange-50/20 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:via-orange-950/20 dark:to-amber-950/20 text-slate-800 dark:text-slate-100 px-6 lg:px-20 pt-36 pb-20 relative overflow-hidden transition-colors duration-300">
      {/* Glow Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-300/20 dark:bg-amber-900/10 blur-[150px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-300/25 dark:bg-orange-900/10 blur-[150px] rounded-full pointer-events-none animate-float-delayed"></div>

      {/* Page Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest bg-orange-50/80 dark:bg-orange-955/40 px-4 py-1.5 rounded-full border border-orange-200/80 dark:border-orange-900/50 shadow-sm">
          Exclusive Marketplace
        </span>
        <h1 className="text-5xl font-black text-slate-900 dark:text-slate-50 mt-4 tracking-tight leading-tight">
          Own Your Perfect Ride
        </h1>
        <p className="text-slate-655 dark:text-slate-400 text-md font-bold mt-4">
          Browse verified cars available for direct ownership. Fully checked, certified, and ready for you to drive home.
        </p>
      </div>

      {/* Main Showroom Area */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <p className="text-xl text-slate-500 dark:text-slate-400 font-bold animate-pulse">Scanning the fleet marketplace...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-rose-500 font-bold">{error}</div>
        ) : cars.length === 0 ? (
          <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 backdrop-blur-xl rounded-[35px] p-16 text-center shadow-sm max-w-xl mx-auto">
            <p className="text-slate-600 dark:text-slate-305 text-lg font-bold mb-4">No cars currently listed for sale.</p>
            <p className="text-slate-450 dark:text-slate-505 text-sm font-semibold">Check back later or explore our rentals instead.</p>
            <button
              onClick={() => navigate("/cars")}
              className="mt-6 px-8 py-3.5 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 hover:scale-105 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition duration-300 cursor-pointer"
            >
              Explore Rentals
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:1200px]">
            {cars.map((car) => (
              <motion.div
                key={car._id}
                whileHover={{ y: -8 }}
                className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 backdrop-blur-md rounded-[35px] p-8 shadow-[0_12px_28px_rgba(0,0,0,0.01)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_45px_rgba(249,115,22,0.12)] hover:bg-white/70 dark:hover:bg-slate-800/65 hover:border-orange-300/60 dark:hover:border-orange-800/50 [transform-style:preserve-3d] hover:[transform:rotateX(6deg)_rotateY(-6deg)_translateZ(15px)] transition-all duration-500 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Status Badge */}
                  <div className="flex justify-between items-center mb-6">
                    <span className={`px-4.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      car.available
                        ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-350 border-emerald-250/60 dark:border-emerald-900/50"
                        : "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-355 border-rose-250/60 dark:border-rose-900/50"
                    }`}>
                      {car.available ? "Available" : "Sold"}
                    </span>
                    <span className="text-slate-350 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest font-mono">
                      Stock No: {car._id.slice(-6)}
                    </span>
                  </div>

                  {/* 3D Car Image container */}
                  <div className="relative w-full h-44 flex items-center justify-center mb-6 [transform-style:preserve-3d] overflow-hidden rounded-2xl">
                    <div className="absolute w-[85%] h-5 bg-radial-shadow opacity-60 blur-[6px] rounded-full bottom-2 pointer-events-none group-hover:scale-95 transition-transform duration-500"></div>
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.12)] group-hover:scale-108 group-hover:-translate-y-2 [transform:translateZ(25px)] transition-all duration-500 select-none"
                    />
                  </div>

                  {/* Info */}
                  <h3 className="text-2xl font-black text-slate-850 dark:text-slate-50 group-hover:translate-x-1 transition-transform duration-300">
                    {car.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mt-3 leading-relaxed">
                    {car.description}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-white/50 dark:border-slate-800/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-505 tracking-wider">Purchase Price</span>
                    <h2 className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-0.5">₹{car.price.toLocaleString()}</h2>
                  </div>

                  {car.available ? (
                    <button
                      onClick={() => handleBuyClick(car)}
                      className="px-6 py-3.5 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white font-bold text-sm rounded-2xl shadow-md shadow-orange-500/20 hover:scale-105 hover:shadow-lg transition duration-300 cursor-pointer"
                    >
                      Buy Now
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-6 py-3.5 bg-slate-205 dark:bg-slate-850 border border-slate-350 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold text-sm rounded-2xl cursor-not-allowed"
                    >
                      Sold Out
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {selectedCar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/90 dark:bg-slate-900/90 border border-white/80 dark:border-slate-800/85 backdrop-blur-2xl rounded-[35px] max-w-lg w-full p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className="absolute -top-20 -left-20 w-44 h-44 bg-orange-400/20 blur-3xl rounded-full"></div>

              {/* Close Button */}
              <button
                onClick={closeCheckoutModal}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-655 dark:text-slate-350 hover:bg-slate-205 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100 transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>

              {!purchaseSuccess ? (
                <>
                  <div className="mb-6">
                    <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">Secure Checkout</span>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-slate-55 mt-1">Car Purchase Order</h2>
                  </div>

                  {/* Summary card */}
                  <div className="bg-white/60 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 p-4.5 rounded-2xl flex items-center gap-4.5 mb-6">
                    <div className="w-20 h-14 bg-white/80 dark:bg-slate-900/80 border border-slate-150 dark:border-slate-805 rounded-xl overflow-hidden flex items-center justify-center p-1">
                      <img src={selectedCar.image} alt={selectedCar.name} className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-850 dark:text-slate-200">{selectedCar.name}</h4>
                      <p className="text-xs text-orange-600 dark:text-orange-400 font-black mt-1">₹{selectedCar.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-wider pl-1">Card Number</label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400"><FaCreditCard /></span>
                        <input
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          maxLength="19"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-white/80 dark:bg-slate-950/80 border border-slate-200/90 dark:border-slate-800/90 rounded-xl py-3 pl-11 pr-4 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-955/50 font-semibold text-sm shadow-sm text-slate-805 dark:text-slate-100"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-wider pl-1">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength="5"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full bg-white/80 dark:bg-slate-950/80 border border-slate-200/90 dark:border-slate-800/90 rounded-xl py-3 px-4.5 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-955/50 font-semibold text-sm shadow-sm text-slate-805 dark:text-slate-100"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-wider pl-1">CVV</label>
                        <input
                          type="password"
                          placeholder="***"
                          maxLength="3"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full bg-white/80 dark:bg-slate-955/80 border border-slate-200/90 dark:border-slate-800/90 rounded-xl py-3 px-4.5 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-955/50 font-semibold text-sm shadow-sm text-slate-805 dark:text-slate-100"
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-955/50 border border-slate-100 dark:border-slate-850 rounded-xl p-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 flex gap-2.5 items-start">
                      <span className="text-orange-500 mt-0.5"><FaInfoCircle /></span>
                      <p>By clicking Purchase, you authorize a sandbox placement simulation. The car will be instantly registered under your ownership list.</p>
                    </div>

                    <button
                      type="submit"
                      disabled={purchasing}
                      className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer disabled:opacity-50"
                    >
                      {purchasing ? "Simulating Payment..." : `Pay ₹${selectedCar.price.toLocaleString()}`}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 flex flex-col items-center">
                  <span className="text-5xl text-emerald-500 mb-4 animate-bounce"><FaCheckCircle /></span>
                  <h2 className="text-3xl font-black text-slate-905 dark:text-slate-50">Purchase Confirmed!</h2>
                  <p className="text-slate-505 dark:text-slate-400 font-semibold mt-3 text-sm leading-relaxed max-w-sm">
                    Congratulations! **{selectedCar.name}** is now officially yours. You can view your purchase log anytime on your user dashboard.
                  </p>

                  <div className="mt-8 flex gap-4 w-full">
                    <button
                      onClick={() => {
                        closeCheckoutModal();
                        navigate("/dashboard");
                      }}
                      className="flex-1 py-3.5 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer hover:shadow-lg transition duration-200"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={closeCheckoutModal}
                      className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-205 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300 font-bold text-sm rounded-xl transition cursor-pointer"
                    >
                      Close Showroom
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuyCars;
