import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  FaCar,
  FaCalendarCheck,
  FaHourglassHalf,
  FaUserCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTimesCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaLocationArrow
} from "react-icons/fa";

import LiveMapTracker from "../Components/LiveMapTracker";

const UserDashboard = () => {
  const { user, token, loading: authLoading, API_URL } = useAuth();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackingBookingId, setTrackingBookingId] = useState(null);

  const [purchases, setPurchases] = useState([]);
  const [purchasesLoading, setPurchasesLoading] = useState(true);
  const [purchasesError, setPurchasesError] = useState("");

  // Cancellation Modal State
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!authLoading) {
      if (!token) {
        navigate("/login");
      } else if (user && user.role === "admin") {
        navigate("/admin");
      }
    }
  }, [token, user, authLoading, navigate]);

  const fetchMyBookings = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/bookings/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      } else {
        setError(data.message || "Failed to load bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMyPurchases = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/purchases/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setPurchases(data.purchases);
        } else {
          setPurchasesError(data.message || "Failed to load purchases");
        }
      } catch (err) {
        console.error("Error fetching purchases:", err);
        setPurchasesError("Unable to connect to server");
      } finally {
        setPurchasesLoading(false);
      }
    };

    fetchMyBookings();
    fetchMyPurchases();
  }, [API_URL, token]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-955 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-orange-400 font-black text-xs tracking-widest uppercase animate-pulse">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role === "admin") {
    return null;
  }

  // Calculations
  const totalBooked = bookings.length;
  const activeRentals = bookings.filter((b) => b.status === "accepted" && (!b.cancellation || !b.cancellation.requested)).length;
  const pendingApprovals = bookings.filter((b) => b.status === "pending").length;

  const getStatusBadge = (status, isCancelled) => {
    if (isCancelled) {
      return "bg-rose-100 dark:bg-rose-955/40 text-rose-800 dark:text-rose-350 border-rose-250/60 dark:border-rose-900/50";
    }
    switch (status) {
      case "accepted":
        return "bg-emerald-100 dark:bg-emerald-955/40 text-emerald-800 dark:text-emerald-300 border-emerald-250/60 dark:border-emerald-900/50";
      case "rejected":
        return "bg-rose-100 dark:bg-rose-955/40 text-rose-800 dark:text-rose-350 border-rose-250/60 dark:border-rose-900/50";
      default:
        return "bg-amber-100 dark:bg-amber-955/40 text-amber-800 dark:text-amber-300 border-amber-250/60 dark:border-amber-900/50";
    }
  };

  const calculateDays = (start, end) => {
    const diffTime = Math.abs(new Date(end) - new Date(start));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancellingBookingId) return;

    setCancelling(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/bookings/${cancellingBookingId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: cancelReason }),
      });
      const data = await response.json();
      if (data.success) {
        setCancellingBookingId(null);
        setCancelReason("");
        fetchMyBookings();
      } else {
        alert(data.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert("Server error occurred.");
    } finally {
      setCancelling(false);
    }
  };

  const activeTrackingCar = bookings.find((b) => b._id === trackingBookingId)?.car?.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/60 via-amber-50/40 via-orange-50/20 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:via-orange-950/20 dark:to-amber-950/20 text-slate-800 dark:text-slate-100 px-6 lg:px-20 pt-36 pb-20 relative overflow-hidden transition-colors duration-300">
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-300/20 dark:bg-amber-900/10 blur-[150px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-300/25 dark:bg-orange-900/10 blur-[150px] rounded-full pointer-events-none animate-float-delayed"></div>

      {/* Heading */}
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-5 max-w-7xl mx-auto">
        <div>
          <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
            Client Center
          </span>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-1">User Dashboard</h1>
          <p className="text-slate-550 dark:text-slate-400 font-semibold text-sm mt-1">Welcome back to RentX portal</p>
        </div>

        {user && (
          <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/80 dark:border-slate-800/80 shadow-sm">
            <FaUserCircle className="text-3xl text-orange-500" />
            <div>
              <h1 className="font-extrabold text-slate-855 dark:text-slate-100 text-sm">{user.name}</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize font-bold tracking-widest">{user.role} Account</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="relative z-10 grid md:grid-cols-3 gap-8 mt-16 max-w-7xl mx-auto [perspective:1200px]">
        <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-805/60 rounded-3xl p-8 shadow-[0_12px_28px_rgba(0,0,0,0.015)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.08)] [transform-style:preserve-3d] hover:[transform:rotateX(8deg)_rotateY(-8deg)_translateZ(10px)] hover:-translate-y-1 transition-all duration-500 ease-out cursor-pointer">
          <div className="[transform:translateZ(15px)]">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-850 flex items-center justify-center text-orange-500 text-xl shadow-sm animate-float">
              <FaCar />
            </div>
            <h1 className="text-4xl font-black text-slate-905 dark:text-slate-50 mt-6">{totalBooked}</h1>
            <p className="text-slate-655 dark:text-slate-400 mt-2 font-bold text-sm">Total Bookings</p>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-805/60 rounded-3xl p-8 shadow-[0_12px_28px_rgba(0,0,0,0.015)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.08)] [transform-style:preserve-3d] hover:[transform:rotateX(8deg)_rotateY(-8deg)_translateZ(10px)] hover:-translate-y-1 transition-all duration-500 ease-out cursor-pointer">
          <div className="[transform:translateZ(15px)]">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-850 flex items-center justify-center text-emerald-500 text-xl shadow-sm animate-float-delayed">
              <FaCalendarCheck />
            </div>
            <h1 className="text-4xl font-black text-slate-905 dark:text-slate-50 mt-6">{activeRentals}</h1>
            <p className="text-slate-655 dark:text-slate-400 mt-2 font-bold text-sm">Active Rentals</p>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-805/60 rounded-3xl p-8 shadow-[0_12px_28px_rgba(0,0,0,0.015)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.08)] [transform-style:preserve-3d] hover:[transform:rotateX(8deg)_rotateY(-8deg)_translateZ(10px)] hover:-translate-y-1 transition-all duration-500 ease-out cursor-pointer">
          <div className="[transform:translateZ(15px)]">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-850 flex items-center justify-center text-amber-500 text-xl shadow-sm animate-float">
              <FaHourglassHalf />
            </div>
            <h1 className="text-4xl font-black text-slate-905 dark:text-slate-50 mt-6">{pendingApprovals}</h1>
            <p className="text-slate-655 dark:text-slate-400 mt-2 font-bold text-sm">Pending Approvals</p>
          </div>
        </div>
      </div>

      {/* Live Map Tracking Panel */}
      <AnimatePresence>
        {trackingBookingId && (
          <div className="relative z-10 mt-16 max-w-7xl mx-auto">
            <LiveMapTracker
              booking={bookings.find((b) => b._id === trackingBookingId)}
              onClose={() => setTrackingBookingId(null)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Booking History Section */}
      <div className="relative z-10 mt-20 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black mb-10 text-slate-900 dark:text-slate-50 tracking-tight">Your Booking History</h2>

        {loading ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-10 font-bold animate-pulse">Loading history logs...</p>
        ) : error ? (
          <p className="text-rose-500 text-center py-10 font-bold">{error}</p>
        ) : bookings.length === 0 ? (
          <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-12 text-center shadow-sm backdrop-blur-md">
            <p className="text-slate-600 dark:text-slate-300 text-lg mb-6 font-bold">You haven't booked any rides yet.</p>
            <Link to="/cars">
              <button className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20 hover:scale-105 transition-all duration-300">
                Explore Cars
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 [perspective:1200px]">
            {bookings.map((booking) => {
              const days = calculateDays(booking.pickupDate, booking.returnDate);
              const totalCost = days * (booking.car?.price || 0);
              const isCancelled = booking.cancellation && booking.cancellation.requested;

              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-[0_10px_25px_rgba(0,0,0,0.01)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.06)] [transform-style:preserve-3d] hover:[transform:rotateX(2deg)_rotateY(-2deg)_translateZ(8px)] transition-all duration-500 ease-out cursor-pointer relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-400"></div>

                  <div className="flex gap-6 items-center flex-wrap [transform:translateZ(10px)]">
                    {booking.car?.image && (
                      <div className="relative w-28 h-20 rounded-2xl overflow-hidden bg-white/50 dark:bg-slate-955/50 border border-white/50 dark:border-slate-800/50 flex items-center justify-center p-1.5 shadow-sm">
                        <img
                          src={booking.car.image}
                          alt={booking.car.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-black text-slate-850 dark:text-slate-50 font-sans">
                        {booking.car?.name || "Deleted Vehicle"}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2.5 text-xs text-slate-500 dark:text-slate-400 font-bold">
                        <div className="flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-orange-500" />
                          <span>{booking.pickupLocation}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-orange-500" />
                          <span>
                            {new Date(booking.pickupDate).toLocaleDateString()} ({booking.pickupTime || "10:00"}) to{" "}
                            {new Date(booking.returnDate).toLocaleDateString()} ({booking.returnTime || "18:00"}) ({days} {days === 1 ? "day" : "days"})
                          </span>
                        </div>
                      </div>

                      {/* Refund Tracking Stage Bar if Cancelled */}
                      {isCancelled && (
                        <div className="mt-4 p-4.5 bg-slate-100/40 dark:bg-slate-950/40 border border-slate-205 dark:border-slate-800 rounded-2xl max-w-sm space-y-3">
                          <div className="flex items-center gap-1.5 text-xs font-black text-rose-500 uppercase tracking-wider">
                            <FaInfoCircle /> Refund Amount: ₹{booking.cancellation.refundAmount.toLocaleString()}
                          </div>
                          
                          {/* Stepper tracking */}
                          <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-400 tracking-wider">
                            <span className={booking.cancellation.refundStatus === "Initiated" || booking.cancellation.refundStatus === "Processing" || booking.cancellation.refundStatus === "Completed" ? "text-orange-600 dark:text-orange-400" : ""}>• Initiated</span>
                            <span className={booking.cancellation.refundStatus === "Processing" || booking.cancellation.refundStatus === "Completed" ? "text-orange-600 dark:text-orange-400" : ""}>• Processing</span>
                            <span className={booking.cancellation.refundStatus === "Completed" ? "text-emerald-500" : ""}>• Completed</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-400 to-orange-655 rounded-full transition-all duration-500"
                              style={{ 
                                width: booking.cancellation.refundStatus === "Completed" ? "100%" : booking.cancellation.refundStatus === "Processing" ? "66%" : "33%" 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full lg:w-auto gap-6 border-t border-slate-200/50 dark:border-slate-800/50 pt-6 lg:pt-0 lg:border-none [transform:translateZ(12px)]">
                    <div>
                      <p className="text-[10px] text-slate-455 dark:text-slate-500 uppercase tracking-widest font-black">Total Cost</p>
                      <p className="text-2xl font-black text-orange-600 dark:text-orange-450 mt-0.5">
                        ₹{totalCost.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">₹{booking.car?.price || 0}/day</p>
                    </div>

                    <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto">
                      <span className={`px-5 py-2.5 rounded-2xl text-center text-xs font-black capitalize border shadow-sm ${getStatusBadge(booking.status, isCancelled)}`}>
                        {isCancelled ? "Cancelled" : booking.status}
                      </span>
                      
                      {/* Track Ride button for accepted bookings */}
                      {booking.status === "accepted" && !isCancelled && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTrackingBookingId(
                              trackingBookingId === booking._id ? null : booking._id
                            );
                            window.scrollTo({ top: 320, behavior: "smooth" });
                          }}
                          className={`w-full px-5 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 shadow-sm cursor-pointer ${
                            trackingBookingId === booking._id
                              ? "bg-slate-800 dark:bg-slate-950 text-white hover:bg-slate-700 dark:hover:bg-slate-900 border dark:border-slate-800"
                              : "bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:shadow-md hover:scale-105"
                          }`}
                        >
                          {trackingBookingId === booking._id ? "Close Tracker" : "Track Live Ride"}
                        </button>
                      )}

                      {/* Cancel Booking Button */}
                      {!isCancelled && booking.status !== "rejected" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCancellingBookingId(booking._id);
                          }}
                          className="w-full px-5 py-2.5 rounded-2xl text-xs font-black border border-rose-200 dark:border-rose-900/50 bg-rose-500/5 text-rose-500 dark:text-rose-455 hover:bg-rose-500/10 hover:scale-[1.02] transition cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancellation Reason Dialog Modal */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-7 shadow-2xl relative">
            <button
              onClick={() => setCancellingBookingId(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 text-lg cursor-pointer outline-none"
            >
              <FaTimesCircle />
            </button>

            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight mb-2">Request Cancellation</h3>
            <p className="text-slate-500 dark:text-slate-450 text-xs font-semibold leading-relaxed mb-6">
              Please write a reason. Eligibility: Cancel 24 hrs prior for 100% refund, same-day cancellations qualify for 50% refund.
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <textarea
                placeholder="Reason for cancellation (optional)..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows="3"
                className="w-full bg-slate-55 dark:bg-slate-950/40 border border-slate-202 dark:border-slate-800/80 rounded-2xl px-4 py-3 outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-orange-500 text-xs font-semibold text-slate-800 dark:text-slate-100"
              />

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingBookingId(null)}
                  className="flex-1 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-355 font-bold rounded-xl text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {cancelling ? "Processing..." : "Confirm Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purchases History Section */}
      <div className="relative z-10 mt-20 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black mb-10 text-slate-900 dark:text-slate-50 tracking-tight">Your Car Purchases</h2>

        {purchasesLoading ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-10 font-bold animate-pulse">Loading purchase history logs...</p>
        ) : purchasesError ? (
          <p className="text-rose-500 text-center py-10 font-bold">{purchasesError}</p>
        ) : purchases.length === 0 ? (
          <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-12 text-center shadow-sm backdrop-blur-md">
            <p className="text-slate-655 dark:text-slate-300 text-lg mb-6 font-bold">You haven't purchased any cars yet.</p>
            <Link to="/buy">
              <button className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20 hover:scale-105 transition-all duration-300">
                Explore Buy Cars
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 [perspective:1200px]">
            {purchases.map((purchase) => (
              <motion.div
                key={purchase._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-[0_10px_25px_rgba(0,0,0,0.01)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.06)] [transform-style:preserve-3d] hover:[transform:rotateX(3deg)_rotateY(-3deg)_translateZ(8px)] transition-all duration-500 ease-out cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400"></div>

                <div className="flex gap-6 items-center flex-wrap [transform:translateZ(10px)]">
                  {purchase.car?.image && (
                    <div className="relative w-28 h-20 rounded-2xl overflow-hidden bg-white/50 dark:bg-slate-955/50 border border-white/50 dark:border-slate-800/50 flex items-center justify-center p-1.5 shadow-sm">
                      <img
                        src={purchase.car.image}
                        alt={purchase.car.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-black text-slate-855 dark:text-slate-50 font-sans">
                      {purchase.car?.name || "Deleted Vehicle"}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-2.5 text-xs text-slate-500 dark:text-slate-400 font-bold">
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-emerald-500" />
                        <span>
                          Purchased on: {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-550 font-mono">
                        <span>Invoice ID: {purchase._id.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col sm:items-center lg:items-end justify-between w-full lg:w-auto gap-6 border-t border-slate-200/50 dark:border-slate-800/50 pt-6 lg:pt-0 lg:border-none [transform:translateZ(12px)]">
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">Purchase Amount</p>
                    <p className="text-2xl font-black text-emerald-650 dark:text-emerald-400 mt-0.5">
                      ₹{purchase.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto">
                    <span className="px-5 py-2.5 rounded-2xl text-center text-xs font-black capitalize border bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-355 border-emerald-250/60 dark:border-emerald-900/50 block shadow-sm">
                      Owned
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;