import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  FaCar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCreditCard,
  FaCalendarCheck,
  FaLocationArrow,
  FaUpload,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaFileAlt,
  FaSpinner,
  FaPhone
} from "react-icons/fa";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, API_URL } = useAuth();

  // Step tracker
  const [step, setStep] = useState(1);

  // Selected car state from navigation
  const preSelectedCarId = location.state?.carId || "";
  const preSelectedCarName = location.state?.carName || "";
  const preSelectedPickupDate = location.state?.pickupDate || "";
  const preSelectedReturnDate = location.state?.returnDate || "";

  const [carId, setCarId] = useState(preSelectedCarId);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupDate, setPickupDate] = useState(preSelectedPickupDate);
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState(preSelectedReturnDate);
  const [returnTime, setReturnTime] = useState("18:00");
  
  // New step states
  const [licenseFile, setLicenseFile] = useState(null);
  const [licenseUploading, setLicenseUploading] = useState(false);
  const [agreeCancellation, setAgreeCancellation] = useState(false);

  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data && data.display_name) {
            const addr = data.address;
            const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || "";
            const road = addr.road || addr.suburb || "";
            const displayValue = road && city ? `${road}, ${city}` : data.display_name.split(",").slice(0, 3).join(", ");
            setPickupLocation(displayValue);
          } else {
            setPickupLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (err) {
          console.error("Geocoding error:", err);
          setPickupLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Unable to retrieve your location. Please type manually.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getMinReturnDateString = () => {
    return pickupDate || getTodayDateString();
  };

  const handlePickupDateChange = (e) => {
    const newPickup = e.target.value;
    setPickupDate(newPickup);
    if (returnDate && new Date(returnDate) < new Date(newPickup)) {
      setReturnDate(newPickup);
    }
  };

  // Fetch cars to populate dropdown selection
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`${API_URL}/cars`);
        const data = await response.json();
        if (data.success) {
          const availableCars = data.cars.filter(
            (c) => c.available || c._id === preSelectedCarId
          );
          setCars(availableCars);
          if (!carId && availableCars.length > 0) {
            setCarId(availableCars[0]._id);
          }
        }
      } catch (err) {
        console.error("Error fetching cars list:", err);
      } finally {
        setLoadingCars(false);
      }
    };

    fetchCars();
  }, [API_URL, preSelectedCarId, carId]);

  // Auto-fetch location on mount
  useEffect(() => {
    handleGetCurrentLocation();
  }, []);

  const selectedCar = cars.find((c) => c._id === carId);

  // Calculations for Days and Pricing
  const calculateDays = (start, end) => {
    const diffTime = Math.abs(new Date(end) - new Date(start));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const rentalDays = (pickupDate && returnDate) ? calculateDays(pickupDate, returnDate) : 1;
  const baseRate = selectedCar ? selectedCar.price : 1500;
  const baseTotal = rentalDays * baseRate;
  const taxesGst = Math.round(baseTotal * 0.18); // 18% GST
  const roadsideInsurance = rentalDays * 250; // Rs 250/day insurance
  const securityDepositRefundable = 5000; // Rs 5000 deposit
  const finalPayableAmount = baseTotal + taxesGst + roadsideInsurance;

  // Dynamic route distance mockup based on input strings
  const getRouteEstimate = () => {
    if (!pickupLocation || !dropLocation) return null;
    const textHash = (pickupLocation + dropLocation).length;
    const distance = (textHash * 7) % 115 + 15;
    const travelTimeMinutes = Math.round(distance * 1.6);
    return {
      distance: `${distance} km`,
      time: `${travelTimeMinutes} mins`,
      branch: "RentX Branch Center " + (dropLocation.split(",")[0] || dropLocation),
      instructions: "Carry your physical Driving License. Return vehicle with full fuel tank. 2 hours grace period."
    };
  };

  const routeDetails = getRouteEstimate();

  // Mock license upload trigger
  const handleUploadLicense = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseUploading(true);
      setError("");
      setTimeout(() => {
        setLicenseFile(e.target.files[0]);
        setLicenseUploading(false);
      }, 1500);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!carId || !pickupLocation || !dropLocation || !pickupDate || !returnDate || !phone) {
        setError("Please fill in all location, date, and contact parameters.");
        return;
      }
      const todayStr = getTodayDateString();
      if (pickupDate < todayStr) {
        setError("Pickup date cannot be in the past.");
        return;
      }
      if (returnDate < pickupDate) {
        setError("Return date cannot be before the pickup date.");
        return;
      }
    } else if (step === 2) {
      if (!licenseFile) {
        setError("Please upload a driving license to verify your identity.");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please login to proceed with booking.");
      return;
    }

    if (!agreeCancellation) {
      setError("Please agree to the Cancellation and Refund policies to proceed.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          carId,
          pickupLocation,
          dropLocation,
          phone,
          pickupDate,
          pickupTime,
          returnDate,
          returnTime,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2500);
      } else {
        setError(data.message || "Failed to place booking request.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Server connection failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/60 via-amber-50/40 via-orange-50/20 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:via-orange-950/20 dark:to-amber-950/20 text-slate-800 dark:text-slate-100 px-6 lg:px-20 pt-36 pb-20 relative overflow-hidden transition-colors duration-300">

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-amber-300/20 dark:bg-amber-900/10 blur-[130px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-orange-300/25 dark:bg-orange-900/10 blur-[130px] rounded-full pointer-events-none animate-float-delayed"></div>

      {/* Main Container */}
      <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto [perspective:1200px]">
        
        {/* Left Info Side */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:sticky lg:top-36"
        >
          <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
            Car Rental Booking
          </span>

          <h1 className="text-5xl font-black leading-tight text-slate-900 dark:text-slate-50 tracking-tight mt-2">
            Rent Vehicles <br />
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Without Hassle
            </span>
          </h1>

          <p className="text-slate-555 dark:text-slate-400 text-lg leading-8 mt-6 font-semibold">
            Complete our 3-step fast booking wizard to reserve your vehicle with transparent pricing, instant approvals, and fully refundable deposits.
          </p>

          {/* Stepper Progress Bar */}
          <div className="mt-10 max-w-md bg-white/30 dark:bg-slate-900/30 border border-white/60 dark:border-slate-805/55 p-6 rounded-3xl backdrop-blur-md">
            <h3 className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest pl-1">Booking Steps</h3>
            
            <div className="mt-6 flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${(step - 1) * 50}%` }}
              ></div>

              {[
                { label: "1. Details", s: 1 },
                { label: "2. Verify", s: 2 },
                { label: "3. Confirm", s: 3 }
              ].map((stepObj) => (
                <div key={stepObj.s} className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                    step >= stepObj.s 
                      ? "bg-orange-600 text-white shadow-md shadow-orange-500/20" 
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500"
                  }`}>
                    {stepObj.s}
                  </div>
                  <span className="text-[10px] font-black uppercase mt-2 tracking-wider text-slate-500 dark:text-slate-400">{stepObj.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Stepper Wizard Card */}
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-805/60 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.015)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_45px_rgba(249,115,22,0.08)] [transform-style:preserve-3d] hover:[transform:rotateX(3deg)_rotateY(-3deg)_translateZ(10px)] transition-all duration-500 ease-out cursor-pointer p-8 rounded-[35px] w-full"
        >
          {success ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-250/50 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-6 py-8 rounded-3xl text-center space-y-4 font-bold [transform:translateZ(10px)]">
              <FaCheckCircle className="text-emerald-500 text-5xl mx-auto animate-bounce" />
              <h2 className="text-2xl font-black text-emerald-950 dark:text-emerald-200">Booking Confirmation Received!</h2>
              <p className="text-slate-655 dark:text-slate-400 text-sm">
                Your rental request has been raised successfully. Redirecting you to your user control panel...
              </p>
            </div>
          ) : (
            <div className="[transform:translateZ(12px)]">
              {error && (
                <div className="bg-rose-50 dark:bg-rose-955/30 border border-rose-250/50 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-2xl text-xs text-center font-bold mb-6">
                  {error}
                </div>
              )}

              {/* Step 1: Details and Locations */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">1. Pickup & Location Details</h2>

                  {/* Car Selector */}
                  <div className="relative">
                    <FaCar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 z-10 text-sm" />
                    {loadingCars ? (
                      <select disabled className="w-full bg-white/50 dark:bg-slate-955/50 border border-slate-200/85 dark:border-slate-800/85 rounded-2xl py-4 pl-14 pr-5 outline-none text-slate-450 text-sm">
                        <option>Loading fleet...</option>
                      </select>
                    ) : (
                      <select
                        value={carId}
                        onChange={(e) => setCarId(e.target.value)}
                        className="w-full bg-white/50 dark:bg-slate-955/50 border border-slate-200/85 dark:border-slate-800/85 rounded-2xl py-4 pl-14 pr-5 outline-none text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-955/50 font-semibold text-sm shadow-sm"
                        required
                        disabled={!!preSelectedCarId}
                      >
                        {cars.length === 0 && <option value="">No cars currently available</option>}
                        {cars.map((c) => (
                          <option key={c._id} value={c._id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold">
                            {c.name} (₹{c.price.toLocaleString()}/day)
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Pickup Location */}
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="text"
                      placeholder="Pickup Location (e.g. Noida)"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full bg-white/50 dark:bg-slate-955/50 border border-slate-200/85 dark:border-slate-800/85 rounded-2xl py-4 pl-14 pr-32 outline-none text-slate-850 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-955/50 font-semibold text-sm shadow-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleGetCurrentLocation}
                      disabled={locating}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-50 dark:bg-orange-950/50 border border-orange-200/50 dark:border-orange-900/50 text-orange-600 dark:text-orange-400 text-[11px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl hover:bg-orange-500 hover:text-white transition duration-355 cursor-pointer disabled:opacity-50"
                    >
                      <FaLocationArrow className={locating ? "animate-spin text-[10px]" : "text-[10px]"} />
                      GPS
                    </button>
                  </div>

                  {/* Drop Location */}
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="text"
                      placeholder="Dropoff Location (e.g. Sector 62)"
                      value={dropLocation}
                      onChange={(e) => setDropLocation(e.target.value)}
                      className="w-full bg-white/50 dark:bg-slate-955/50 border border-slate-200/85 dark:border-slate-800/85 rounded-2xl py-4 pl-14 pr-5 outline-none text-slate-850 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-955/50 font-semibold text-sm shadow-sm"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="relative">
                    <FaPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="tel"
                      placeholder="Contact Phone Number (e.g. +919876543210)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/50 dark:bg-slate-955/50 border border-slate-200/85 dark:border-slate-800/85 rounded-2xl py-4 pl-14 pr-5 outline-none text-slate-850 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-955/50 font-semibold text-sm shadow-sm"
                      required
                    />
                  </div>

                  {/* Distance Map Route Mock Details */}
                  {routeDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/60 dark:bg-slate-955/30 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-4 text-xs font-semibold text-slate-650 dark:text-slate-400 space-y-2.5 shadow-inner"
                    >
                      <div className="flex justify-between items-center text-slate-800 dark:text-slate-200 font-extrabold text-[13px]">
                        <span>Interactive Map Estimates</span>
                        <span className="text-orange-600 dark:text-orange-400">{routeDetails.distance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est Travel Time:</span>
                        <span>{routeDetails.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nearest Branch:</span>
                        <span>{routeDetails.branch}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 leading-normal border-t border-slate-200/30 dark:border-slate-800/30 pt-2 font-medium">
                        {routeDetails.instructions}
                      </div>
                    </motion.div>
                  )}

                  {/* Dates Picker Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-5 top-[60%] -translate-y-1/2 text-slate-400 text-sm" />
                      <div className="absolute left-5 top-2 text-[9px] text-orange-600 dark:text-orange-400 font-black uppercase tracking-wider">Pickup Date</div>
                      <input
                        type="date"
                        value={pickupDate}
                        min={getTodayDateString()}
                        onChange={handlePickupDateChange}
                        className="w-full bg-white/50 dark:bg-slate-955/50 border border-slate-200/85 dark:border-slate-800/85 rounded-2xl pt-6 pb-2.5 pl-14 pr-4 outline-none text-slate-850 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 font-semibold text-sm shadow-sm"
                        required
                      />
                    </div>

                    <div className="relative">
                      <FaCalendarCheck className="absolute left-5 top-[60%] -translate-y-1/2 text-slate-400 text-sm" />
                      <div className="absolute left-5 top-2 text-[9px] text-orange-600 dark:text-orange-400 font-black uppercase tracking-wider">Return Date</div>
                      <input
                        type="date"
                        value={returnDate}
                        min={getMinReturnDateString()}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full bg-white/50 dark:bg-slate-955/50 border border-slate-200/85 dark:border-slate-800/85 rounded-2xl pt-6 pb-2.5 pl-14 pr-4 outline-none text-slate-850 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 font-semibold text-sm shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Times Picker Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute left-5 top-2 text-[9px] text-orange-600 dark:text-orange-400 font-black uppercase tracking-wider">Pickup Time</div>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full bg-white/50 dark:bg-slate-955/50 border border-slate-200/85 dark:border-slate-800/85 rounded-2xl pt-6 pb-2.5 pl-5 pr-4 outline-none text-slate-850 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-905 focus:border-orange-500 font-semibold text-sm shadow-sm"
                        required
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute left-5 top-2 text-[9px] text-orange-600 dark:text-orange-400 font-black uppercase tracking-wider">Return Time</div>
                      <input
                        type="time"
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                        className="w-full bg-white/50 dark:bg-slate-955/50 border border-slate-200/85 dark:border-slate-800/85 rounded-2xl pt-6 pb-2.5 pl-5 pr-4 outline-none text-slate-850 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 font-semibold text-sm shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white font-bold text-sm shadow-md hover:scale-[1.02] transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Upload License & Verify <FaArrowRight className="text-xs" />
                  </button>
                </div>
              )}

              {/* Step 2: License Upload */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">2. Verification Documents</h2>

                  <p className="text-slate-550 dark:text-slate-400 text-xs font-semibold leading-relaxed">
                    Upload your valid government-issued Driving License (JPEG, PNG or PDF formats under 5MB). License is sanitized for physical audit.
                  </p>

                  {/* Drag and Drop Mock Area */}
                  <div className="border-2 border-dashed border-slate-200/80 dark:border-slate-805/80 hover:border-orange-400 dark:hover:border-orange-400 rounded-3xl p-8 text-center flex flex-col items-center justify-center bg-white/20 dark:bg-slate-955/20 transition-all duration-300 relative">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleUploadLicense}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />                    {licenseUploading ? (
                      <div className="space-y-3">
                        <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto" />
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Scanning Document Verification...</p>
                      </div>
                    ) : licenseFile ? (
                      <div className="space-y-3">
                        <FaFileAlt className="text-4xl text-orange-500 mx-auto animate-bounce" />
                        <p className="text-sm font-extrabold text-slate-855 dark:text-slate-100">{licenseFile.name}</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-wider flex items-center justify-center gap-1">
                          <FaCheckCircle /> Document Verified
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <FaUpload className="text-3xl text-slate-450 dark:text-slate-500 mx-auto" />
                        <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Select License File</p>
                        <p className="text-[10px] text-slate-455 dark:text-slate-500 font-semibold">or drag and drop here</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 py-3.5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-355 font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/60 transition cursor-pointer"
                    >
                      <FaArrowLeft /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition cursor-pointer"
                    >
                      Payment Review <FaArrowRight />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: transparent Pricing and Final Confirmation */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">3. Review & Payment</h2>

                  {/* transparent pricing calculator breakdown */}
                  <div className="bg-white/60 dark:bg-slate-955/30 border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-6 text-xs font-semibold text-slate-650 dark:text-slate-400 space-y-4 shadow-inner">
                    <div className="flex justify-between border-b border-slate-200/30 dark:border-slate-800/30 pb-2">
                      <span className="text-[13px] text-slate-900 dark:text-slate-200 font-extrabold">{selectedCar ? selectedCar.name : "Vehicle"}</span>
                      <span className="text-slate-900 dark:text-slate-200 font-extrabold">₹{baseRate}/day</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Base Rental Total:</span>
                      <span>₹{baseTotal.toLocaleString()} ({rentalDays} {rentalDays === 1 ? "day" : "days"})</span>
                    </div>

                    <div className="flex justify-between">
                      <span>GST & Tax Charges (18%):</span>
                      <span>₹{taxesGst.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Roadside Injury Insurance (Certified):</span>
                      <span>₹{roadsideInsurance.toLocaleString()} (₹250/day)</span>
                    </div>

                    <div className="flex justify-between text-slate-400 dark:text-slate-550 border-b border-slate-200/30 dark:border-slate-800/30 pb-3">
                      <span>Refundable Security Deposit:</span>
                      <span>₹{securityDepositRefundable.toLocaleString()} (Auto-refunded)</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-905 dark:text-slate-100 font-black text-lg pt-1">
                      <span>Final Total Cost:</span>
                      <span className="text-orange-600 dark:text-orange-400">₹{finalPayableAmount.toLocaleString()}</span>
                    </div>

                    {/* Policy details */}
                    <div className="text-[10px] text-slate-455 dark:text-slate-500 font-medium leading-normal space-y-1.5 border-t border-slate-200/30 dark:border-slate-800/30 pt-3">
                      <p>• <b>Fuel Policy:</b> Full-to-Full. Return with a full tank to avoid refueling penalties.</p>
                      <p>• <b>Mileage Cap:</b> Unlimited up to 250 km/day. ₹15/km extra afterwards.</p>
                      <p>• <b>Late returns:</b> ₹250 per hour late return fee is charged.</p>
                    </div>
                  </div>

                  {/* Cancellation policy checkboxes */}
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeCancellation}
                        onChange={(e) => setAgreeCancellation(e.target.checked)}
                        className="mt-1 accent-orange-600 rounded cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500 leading-normal font-semibold">
                        I agree to the <b>Cancellation & Refund Policies</b>. Free cancellations (100% refund) are valid up to 24 hrs prior to pickup. Same day cancellations qualify for 50% refund.
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 py-3.5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-355 font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/60 transition cursor-pointer"
                    >
                      <FaArrowLeft /> Back
                    </button>
                    
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !user || !agreeCancellation}
                      className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaCreditCard />
                      {submitting ? "Processing..." : "Confirm & Pay"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default Booking;