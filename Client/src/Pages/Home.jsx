import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCar,
  FaArrowRight,
  FaGasPump,
  FaCogs,
  FaUsers,
  FaTag,
  FaCheckCircle,
  FaBolt,
  FaShieldAlt,
  FaCalendarWeek,
  FaHeadphones,
  FaChevronLeft,
  FaChevronRight,
  FaFileUpload,
  FaLocationArrow,
} from "react-icons/fa";

import Herosection from "../Components/Herosection";
import Testimonials from "../Components/Testimonials";
import Footer from "../Components/Footer";

const Home = () => {
  // Everyday Cars Fleet
  const featuredCars = [
    {
      _id: "thar-1",
      name: "Mahindra Thar",
      price: 3500,
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
      fuel: "Diesel",
      transmission: "Manual/Auto",
      seats: 4,
      desc: "Rugged 4x4 off-roader, perfect for adventurous road trips and rough terrains.",
      bg: "from-orange-500/10 via-amber-500/5 to-transparent",
      hoverBg: "hover:bg-orange-50/80 dark:hover:bg-orange-950/30 hover:border-orange-300/60 dark:hover:border-orange-800/50",
      hoverShadow: "hover:shadow-[0_25px_50px_rgba(249,115,22,0.18)]"
    },
    {
      _id: "creta-2",
      name: "Hyundai Creta",
      price: 2800,
      image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=800&auto=format&fit=crop",
      fuel: "Petrol/Diesel",
      transmission: "Automatic",
      seats: 5,
      desc: "Vibrant mid-size SUV packed with premium tech and absolute comfort.",
      bg: "from-orange-500/10 via-amber-500/5 to-transparent",
      hoverBg: "hover:bg-orange-50/80 dark:hover:bg-orange-950/30 hover:border-orange-300/60 dark:hover:border-orange-800/50",
      hoverShadow: "hover:shadow-[0_25px_50px_rgba(249,115,22,0.18)]"
    },
    {
      _id: "swift-3",
      name: "Maruti Suzuki Swift",
      price: 1500,
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop",
      fuel: "Petrol",
      transmission: "Manual",
      seats: 5,
      desc: "Agile, compact hatchback with high mileage. Perfect for navigating city traffic.",
      bg: "from-orange-500/10 via-amber-500/5 to-transparent",
      hoverBg: "hover:bg-orange-50/80 dark:hover:bg-orange-950/30 hover:border-orange-300/60 dark:hover:border-orange-800/50",
      hoverShadow: "hover:shadow-[0_25px_50px_rgba(249,115,22,0.18)]"
    },
    {
      _id: "innova-4",
      name: "Toyota Innova Crysta",
      price: 4000,
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop",
      fuel: "Diesel",
      transmission: "Manual/Auto",
      seats: 7,
      desc: "Spacious multi-purpose vehicle designed for absolute luxury and family road trips.",
      bg: "from-orange-500/10 via-amber-500/5 to-transparent",
      hoverBg: "hover:bg-orange-50/80 dark:hover:bg-orange-950/30 hover:border-orange-300/60 dark:hover:border-orange-800/50",
      hoverShadow: "hover:shadow-[0_25px_50px_rgba(249,115,22,0.18)]"
    },
    {
      _id: "nexon-5",
      name: "Tata Nexon",
      price: 2200,
      image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=800&auto=format&fit=crop",
      fuel: "Petrol/EV",
      transmission: "Manual/AMT",
      seats: 5,
      desc: "Highly-safe compact SUV offering smooth driving dynamics and modern styling.",
      bg: "from-orange-500/10 via-amber-500/5 to-transparent",
      hoverBg: "hover:bg-orange-50/80 dark:hover:bg-orange-950/30 hover:border-orange-300/60 dark:hover:border-orange-800/50",
      hoverShadow: "hover:shadow-[0_25px_50px_rgba(249,115,22,0.18)]"
    }
  ];

  const featuredSaleCars = [
    {
      _id: "sale-xuv700",
      name: "Mahindra XUV700",
      price: 2150000,
      image: "https://images.unsplash.com/photo-1632245889027-e406faaa19ee?q=80&w=800&auto=format&fit=crop",
      fuel: "Petrol/Diesel",
      transmission: "Automatic",
      seats: 7,
      desc: "Premium smart SUV for sale. Loaded with ADAS safety features, panoramic sunroof, and luxury cabin.",
      bg: "from-orange-500/10 via-amber-500/5 to-transparent",
      hoverBg: "hover:bg-orange-50/80 dark:hover:bg-orange-950/30 hover:border-orange-300/60 dark:hover:border-orange-800/50",
      hoverShadow: "hover:shadow-[0_25px_50px_rgba(249,115,22,0.18)]"
    },
    {
      _id: "sale-verna",
      name: "Hyundai Verna",
      price: 1450000,
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop",
      fuel: "Petrol",
      transmission: "Manual/IVT",
      seats: 5,
      desc: "Futuristic sedan for sale. Features a turbo petrol engine, dynamic styling, and absolute comfort.",
      bg: "from-orange-500/10 via-amber-500/5 to-transparent",
      hoverBg: "hover:bg-orange-50/80 dark:hover:bg-orange-950/30 hover:border-orange-300/60 dark:hover:border-orange-800/50",
      hoverShadow: "hover:shadow-[0_25px_50px_rgba(249,115,22,0.18)]"
    },
    {
      _id: "sale-baleno",
      name: "Maruti Suzuki Baleno",
      price: 880000,
      image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800&auto=format&fit=crop",
      fuel: "Petrol/CNG",
      transmission: "Manual/AMT",
      seats: 5,
      desc: "Premium hatchback for sale. High efficiency, comfortable seating, and smart connectivity.",
      bg: "from-orange-500/10 via-amber-500/5 to-transparent",
      hoverBg: "hover:bg-orange-50/80 dark:hover:bg-orange-950/30 hover:border-orange-300/60 dark:hover:border-orange-800/50",
      hoverShadow: "hover:shadow-[0_25px_50px_rgba(249,115,22,0.18)]"
    }
  ];

  // Showcase Slider active index
  const [sliderIndex, setSliderIndex] = useState(0);

  // Search Form State
  const [searchQuery, setSearchQuery] = useState({
    pickupLocation: "",
    dropLocation: "",
    pickupDate: "",
    returnDate: "",
  });

  const [locatingHome, setLocatingHome] = useState(false);

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getMinReturnDateString = () => {
    return searchQuery.pickupDate || getTodayDateString();
  };

  const handlePickupDateChange = (e) => {
    const newPickup = e.target.value;
    setSearchQuery((prev) => {
      const updated = { ...prev, pickupDate: newPickup };
      if (prev.returnDate && new Date(prev.returnDate) < new Date(newPickup)) {
        updated.returnDate = newPickup;
      }
      return updated;
    });
  };

  const handleGetCurrentLocationHome = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocatingHome(true);

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
            setSearchQuery((prev) => ({ ...prev, pickupLocation: displayValue }));
          } else {
            setSearchQuery((prev) => ({ ...prev, pickupLocation: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          }
        } catch (err) {
          console.error("Geocoding error:", err);
          setSearchQuery((prev) => ({ ...prev, pickupLocation: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
        } finally {
          setLocatingHome(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Unable to retrieve your location. Please type manually.");
        setLocatingHome(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const nextSlider = () => {
    setSliderIndex((prev) => (prev + 1) % featuredCars.length);
  };

  const prevSlider = () => {
    setSliderIndex((prev) => (prev - 1 + featuredCars.length) % featuredCars.length);
  };

  return (
    <div className="bg-gradient-to-br from-orange-50/60 via-amber-50/45 via-orange-50/20 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:via-orange-950/20 dark:to-amber-955/20 text-slate-855 dark:text-slate-100 overflow-hidden relative min-h-screen transition-colors duration-300">
      
      {/* Background Animated blobs */}
      <div className="absolute top-1/4 left-1/10 w-[600px] h-[600px] bg-amber-300/20 dark:bg-amber-900/10 blur-[150px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute top-2/3 right-1/10 w-[650px] h-[650px] bg-orange-300/20 dark:bg-orange-900/10 blur-[150px] rounded-full pointer-events-none animate-float-delayed"></div>
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-orange-200/15 dark:bg-orange-900/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Content wrapper */}
      <div className="relative z-10">

        {/* Hero Section */}
        <Herosection />

        {/* Search Widget Section */}
        <section className="px-6 lg:px-24 -mt-16 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[28px] shadow-[0_15px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
              
              {/* Pickup Location */}
              <div className="flex flex-col gap-1.5 lg:border-r border-slate-100 dark:border-slate-800 lg:pr-4">
                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                  Pick-up Location
                </span>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="New York, USA"
                    value={searchQuery.pickupLocation}
                    onChange={(e) => setSearchQuery({ ...searchQuery, pickupLocation: e.target.value })}
                    className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 font-extrabold text-sm outline-none focus:ring-0 py-1 pl-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleGetCurrentLocationHome}
                    disabled={locatingHome}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600 transition disabled:opacity-50 cursor-pointer"
                    title="Use Current Location"
                  >
                    <FaLocationArrow className={locatingHome ? "animate-spin text-xs" : "text-xs"} />
                  </button>
                </div>
              </div>

              {/* Dropoff Location */}
              <div className="flex flex-col gap-1.5 lg:border-r border-slate-100 dark:border-slate-800 lg:px-4">
                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                  Drop-off Location
                </span>
                <input
                  type="text"
                  placeholder="Los Angeles, USA"
                  value={searchQuery.dropLocation}
                  onChange={(e) => setSearchQuery({ ...searchQuery, dropLocation: e.target.value })}
                  className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 font-extrabold text-sm outline-none focus:ring-0 py-1 pl-1"
                  required
                />
              </div>

              {/* Pickup Date */}
              <div className="flex flex-col gap-1.5 lg:border-r border-slate-100 dark:border-slate-800 lg:px-4">
                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                  Pick-up Date
                </span>
                <input
                  type="date"
                  value={searchQuery.pickupDate}
                  min={getTodayDateString()}
                  onChange={handlePickupDateChange}
                  className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 font-extrabold text-xs outline-none focus:ring-0 py-1 cursor-pointer"
                  required
                />
              </div>

              {/* Return Date */}
              <div className="flex flex-col gap-1.5 lg:border-r border-slate-100 dark:border-slate-800 lg:px-4">
                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                  Drop-off Date
                </span>
                <input
                  type="date"
                  value={searchQuery.returnDate}
                  min={getMinReturnDateString()}
                  onChange={(e) => setSearchQuery({ ...searchQuery, returnDate: e.target.value })}
                  className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 font-extrabold text-xs outline-none focus:ring-0 py-1 cursor-pointer"
                  required
                />
              </div>

              {/* Search Submit */}
              <div className="w-full">
                <Link to="/cars" state={{ searchParams: searchQuery }}>
                  <button className="w-full py-4 rounded-2xl bg-[#F97316] hover:bg-orange-600 text-white font-black text-sm transition duration-300 shadow-md shadow-orange-500/10 cursor-pointer flex items-center justify-center gap-2">
                    Search Cars
                  </button>
                </Link>
              </div>

            </div>
          </motion.div>
        </section>

        {/* Featured Cars Section */}
        <section className="py-24 px-6 lg:px-20 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                  Handpicked Fleet
                </span>
                <h1 className="text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-2">
                  Featured Cars
                </h1>
              </div>

              <Link to="/cars">
                <button className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 cursor-pointer shadow-sm">
                  View All Cars
                </button>
              </Link>
            </div>

            {/* Car Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 [perspective:1200px]">
              {featuredCars.map((car, idx) => (
                <div
                  key={idx}
                  className={`bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[35px] border border-white/60 dark:border-slate-800/60 p-7 flex flex-col justify-between min-h-[500px] shadow-[0_15px_35px_rgba(0,0,0,0.015)] ${car.hoverBg} ${car.hoverShadow} [transform-style:preserve-3d] hover:[transform:rotateX(6deg)_rotateY(-6deg)_translateZ(20px)] hover:-translate-y-3 transition-all duration-500 ease-out cursor-pointer relative overflow-hidden group`}
                >
                  
                  {/* Subtle Card Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${car.bg} opacity-50 group-hover:opacity-100 transition-opacity duration-550 pointer-events-none`}></div>

                  {/* Car Image + 3D Shadow Container */}
                  <div className="relative w-full h-48 flex items-center justify-center mb-4 z-10 [transform-style:preserve-3d] overflow-hidden rounded-2xl">
                    
                    {/* Ground Shadow */}
                    <div className="absolute bottom-2 w-[85%] h-5 bg-radial-shadow opacity-50 blur-[6px] rounded-full pointer-events-none group-hover:scale-90 transition-transform duration-500"></div>

                    {/* Slightly Tilted Image */}
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] group-hover:scale-105 [transform:translateZ(25px)] transition-all duration-500 select-none"
                    />
                  </div>

                  {/* Car Details */}
                  <div className="z-10 [transform:translateZ(20px)] mt-4">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-50">{car.name}</h2>
                    <p className="text-slate-550 dark:text-slate-400 text-sm font-semibold mt-2 leading-relaxed">
                      {car.desc}
                    </p>

                    {/* Specs Tags */}
                    <div className="grid grid-cols-3 gap-2 mt-5 text-[11px] font-bold text-slate-655 dark:text-slate-350">
                      <div className="flex items-center gap-1.5 justify-center py-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-slate-800/50">
                        <FaGasPump className="text-orange-500 text-[13px]" />
                        <span>{car.fuel}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-center py-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-slate-800/50">
                        <FaCogs className="text-orange-500 text-[13px]" />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-center py-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-slate-800/50">
                        <FaUsers className="text-orange-500 text-[13px]" />
                        <span>{car.seats} Seats</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Button */}
                  <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/50 dark:border-slate-800/50 z-10 [transform:translateZ(25px)]">
                    <div>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-extrabold uppercase tracking-widest">Daily Rent</p>
                      <p className="text-2xl font-black text-orange-600">₹{car.price.toLocaleString()}</p>
                    </div>

                    <Link to="/booking" state={{ carId: car._id, carName: car.name }}>
                      <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-550 to-orange-500 hover:from-orange-400 hover:to-orange-400 text-white font-bold text-sm shadow-md shadow-orange-500/15 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
                        Book Now
                      </button>
                    </Link>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Featured Cars for Sale Section */}
        <section className="py-24 px-6 lg:px-20 relative bg-white/5 dark:bg-slate-950/5 backdrop-blur-sm border-t border-white/20 dark:border-slate-900/40">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                  Own Your Ride
                </span>
                <h1 className="text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-2 font-sans">
                  Featured Cars for Sale
                </h1>
              </div>

              <Link to="/buy">
                <button className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 cursor-pointer shadow-sm">
                  View Marketplace
                </button>
              </Link>
            </div>            {/* Car Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 [perspective:1200px]">
              {featuredSaleCars.map((car, idx) => (
                <div
                  key={idx}
                  className={`bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[35px] border border-white/60 dark:border-slate-800/60 p-7 flex flex-col justify-between min-h-[500px] shadow-[0_15px_35px_rgba(0,0,0,0.015)] ${car.hoverBg} ${car.hoverShadow} [transform-style:preserve-3d] hover:[transform:rotateX(6deg)_rotateY(-6deg)_translateZ(20px)] hover:-translate-y-3 transition-all duration-500 ease-out cursor-pointer relative overflow-hidden group`}
                >
                  
                  {/* Subtle Card Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${car.bg} opacity-50 group-hover:opacity-100 transition-opacity duration-550 pointer-events-none`}></div>

                  {/* Car Image + 3D Shadow Container */}
                  <div className="relative w-full h-48 flex items-center justify-center mb-4 z-10 [transform-style:preserve-3d] overflow-hidden rounded-2xl">
                    
                    {/* Ground Shadow */}
                    <div className="absolute bottom-2 w-[85%] h-5 bg-radial-shadow opacity-50 blur-[6px] rounded-full pointer-events-none group-hover:scale-90 transition-transform duration-500"></div>

                    {/* Slightly Tilted Image */}
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] group-hover:scale-105 [transform:translateZ(25px)] transition-all duration-500 select-none"
                    />
                  </div>

                  {/* Car Details */}
                  <div className="z-10 [transform:translateZ(20px)] mt-4">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-50">{car.name}</h2>
                    <p className="text-slate-550 dark:text-slate-400 text-sm font-semibold mt-2 leading-relaxed">
                      {car.desc}
                    </p>

                    {/* Specs Tags */}
                    <div className="grid grid-cols-3 gap-2 mt-5 text-[11px] font-bold text-slate-650 dark:text-slate-350">
                      <div className="flex items-center gap-1.5 justify-center py-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-slate-800/50">
                        <FaGasPump className="text-orange-500 text-[13px]" />
                        <span>{car.fuel}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-center py-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-slate-800/50">
                        <FaCogs className="text-orange-500 text-[13px]" />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-center py-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-slate-800/50">
                        <FaUsers className="text-orange-500 text-[13px]" />
                        <span>{car.seats} Seats</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Button */}
                  <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/50 dark:border-slate-800/50 z-10 [transform:translateZ(25px)]">
                    <div>
                      <p className="text-slate-450 dark:text-slate-500 text-[10px] font-extrabold uppercase tracking-widest">Full Price</p>
                      <p className="text-2xl font-black text-orange-600">₹{car.price.toLocaleString()}</p>
                    </div>

                    <Link to="/buy">
                      <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-550 to-orange-500 hover:from-orange-400 hover:to-orange-400 text-white font-bold text-sm shadow-md shadow-orange-500/15 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
                        Buy Now
                      </button>
                    </Link>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>
        <section className="py-20 px-6 lg:px-24 relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight font-sans">
                Why Choose Us?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  title: "Best Prices", 
                  desc: "Competitive prices on every booking", 
                  icon: <FaTag className="text-[#F97316]" />,
                },
                { 
                  title: "Wide Range of Cars", 
                  desc: "Choose from a variety of vehicles", 
                  icon: <FaCar className="text-[#F97316]" />,
                },
                { 
                  title: "Easy Booking", 
                  desc: "Book your car in just a few clicks", 
                  icon: <FaCheckCircle className="text-[#F97316]" />,
                },
                { 
                  title: "24/7 Support", 
                  desc: "We are here to help you anytime", 
                  icon: <FaHeadphones className="text-[#F97316]" />,
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-transparent p-6 rounded-2xl transition-all duration-305 flex flex-col items-center text-center space-y-4"
                >
                  {/* Peach rounded background container for icon */}
                  <div className="w-16 h-16 rounded-2xl bg-[#FFF1EB] dark:bg-orange-950/20 flex items-center justify-center text-2xl shadow-sm">
                    {item.icon}
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed max-w-[200px]">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* Special Section: Interactive Car Showcase Slider */}
        <section className="py-24 px-6 lg:px-20 relative">
          <div className="max-w-6xl mx-auto">
                     <div className="text-center mb-16">
              <span className="text-xs font-black text-orange-650 dark:text-orange-400 uppercase tracking-widest">
                Interactive Arena
              </span>
              <h1 className="text-5xl font-black text-slate-900 dark:text-slate-50 mt-2">
                3D Spotlight Arena
              </h1>
              <p className="text-slate-600 dark:text-slate-200 text-md font-bold mt-3">
                Swipe and explore our everyday models in 3D perspective
              </p>
            </div>

            {/* Slider Deck */}
            <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 rounded-[40px] p-8 lg:p-12 shadow-[0_20px_45px_rgba(0,0,0,0.02)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.15)] flex flex-col lg:flex-row items-center justify-between gap-12 [perspective:1200px]">
              
              {/* Left Slider Arrow */}
              <button
                onClick={prevSlider}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-705 dark:text-slate-300 shadow-md hover:bg-white dark:hover:bg-slate-900 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 z-20 cursor-pointer"
              >
                <FaChevronLeft />
              </button>

              {/* Right Slider Arrow */}
              <button
                onClick={nextSlider}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-705 dark:text-slate-300 shadow-md hover:bg-white dark:hover:bg-slate-900 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 z-20 cursor-pointer"
              >
                <FaChevronRight />
              </button>

              {/* Slider Image Arena (3D Float) */}
              <div className="w-full lg:w-[45%] flex flex-col justify-center items-center relative [transform-style:preserve-3d]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={sliderIndex}
                    initial={{ opacity: 0, scale: 0.85, rotateY: 30 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.85, rotateY: -30 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full flex flex-col items-center justify-center py-10 animate-float"
                  >
                    
                    {/* Ground Shadow */}
                    <div className="absolute bottom-6 w-[80%] h-6 bg-radial-shadow opacity-70 blur-[7px] rounded-full pointer-events-none"></div>

                    <img
                      src={featuredCars[sliderIndex].image}
                      alt={featuredCars[sliderIndex].name}
                      className="w-full max-h-[220px] object-cover drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] [transform:translateZ(30px)] hover:[transform:rotateX(8deg)_rotateY(-12deg)_translateZ(60px)] transition-transform duration-500 select-none cursor-grab"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider Specifications Arena */}
              <div className="w-full lg:w-[50%]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={sliderIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                      Spotlight Spec
                    </span>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-slate-50 mt-2">
                      {featuredCars[sliderIndex].name}
                    </h2>
                    <p className="text-slate-555 dark:text-slate-400 font-semibold mt-4 leading-relaxed text-sm lg:text-base">
                      {featuredCars[sliderIndex].desc}
                    </p>

                    {/* Spec Indicators */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-slate-800/50">
                        <FaGasPump className="text-orange-500 text-lg" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fuel Type</p>
                          <p className="text-sm font-extrabold text-slate-800 dark:text-slate-205">{featuredCars[sliderIndex].fuel}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-slate-800/50">
                        <FaCogs className="text-orange-500 text-lg" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Transmission</p>
                          <p className="text-sm font-extrabold text-slate-800 dark:text-slate-205">{featuredCars[sliderIndex].transmission}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-slate-800/50">
                        <FaUsers className="text-orange-500 text-lg" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Seating Capacity</p>
                          <p className="text-sm font-extrabold text-slate-800 dark:text-slate-205">{featuredCars[sliderIndex].seats} Persons</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-slate-800/50">
                        <span className="text-orange-500 text-lg font-black">₹</span>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Rent Price</p>
                          <p className="text-sm font-extrabold text-slate-800 dark:text-slate-205">₹{featuredCars[sliderIndex].price}/day</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center gap-5">
                      <Link to="/booking" state={{ carId: featuredCars[sliderIndex]._id, carName: featuredCars[sliderIndex].name }}>
                        <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/20 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer">
                          Proceed to Book
                        </button>
                      </Link>

                      <div className="text-slate-400 dark:text-slate-550 text-xs font-bold">
                        *Instant approval & online payment
                      </div>
                    </div>

                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

          </div>
        </section>

        {/* Booking Process Steps Section */}
        <section className="py-24 px-6 lg:px-20 relative">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-20">
              <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                Seamless Path
              </span>
              <h1 className="text-5xl font-black text-slate-900 dark:text-slate-50 mt-2">
                Booking Process
              </h1>
              <p className="text-slate-600 dark:text-slate-200 text-md font-bold mt-3">
                Get behind the wheel in 4 basic steps
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  step: "01", 
                  title: "Choose Car", 
                  desc: "Browse our standard verified economy cars and select your perfect match.", 
                  icon: <FaCar className="text-orange-500 group-hover:text-white transition-colors duration-300" />,
                  hoverCard: "hover:bg-orange-500/10 dark:hover:bg-orange-500/20 hover:border-orange-400/50 dark:hover:border-orange-400/80 hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)] dark:hover:shadow-[0_25px_50px_rgba(249,115,22,0.35)]",
                  hoverIconContainer: "group-hover:bg-orange-500 group-hover:border-orange-400 group-hover:shadow-[0_8px_20px_rgba(249,115,22,0.3)] dark:group-hover:shadow-[0_12px_24px_rgba(249,115,22,0.5)]",
                  hoverStepNumber: "group-hover:text-orange-500/20 dark:group-hover:text-orange-400/30"
                },
                { 
                  step: "02", 
                  title: "Select Date", 
                  desc: "Pick your start/return dates and lock in the rental availability.", 
                  icon: <FaCalendarWeek className="text-orange-500 group-hover:text-white transition-colors duration-300" />,
                  hoverCard: "hover:bg-orange-500/10 dark:hover:bg-orange-500/20 hover:border-orange-400/50 dark:hover:border-orange-400/80 hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)] dark:hover:shadow-[0_25px_50px_rgba(249,115,22,0.35)]",
                  hoverIconContainer: "group-hover:bg-orange-500 group-hover:border-orange-400 group-hover:shadow-[0_8px_20px_rgba(249,115,22,0.3)] dark:group-hover:shadow-[0_12px_24px_rgba(249,115,22,0.5)]",
                  hoverStepNumber: "group-hover:text-orange-500/20 dark:group-hover:text-orange-400/30"
                },
                { 
                  step: "03", 
                  title: "Upload License", 
                  desc: "Quickly verify your identity by uploading your driver’s license.", 
                  icon: <FaFileUpload className="text-orange-500 group-hover:text-white transition-colors duration-300" />,
                  hoverCard: "hover:bg-orange-500/10 dark:hover:bg-orange-500/20 hover:border-orange-400/50 dark:hover:border-orange-400/80 hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)] dark:hover:shadow-[0_25px_50px_rgba(249,115,22,0.35)]",
                  hoverIconContainer: "group-hover:bg-orange-500 group-hover:border-orange-400 group-hover:shadow-[0_8px_20px_rgba(249,115,22,0.3)] dark:group-hover:shadow-[0_12px_24px_rgba(249,115,22,0.5)]",
                  hoverStepNumber: "group-hover:text-orange-500/20 dark:group-hover:text-orange-400/30"
                },
                { 
                  step: "04", 
                  title: "Confirm Booking", 
                  desc: "Make online payment and receive an instant booking voucher.", 
                  icon: <FaCheckCircle className="text-orange-500 group-hover:text-white transition-colors duration-300" />,
                  hoverCard: "hover:bg-orange-500/10 dark:hover:bg-orange-500/20 hover:border-orange-400/50 dark:hover:border-orange-400/80 hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)] dark:hover:shadow-[0_25px_50px_rgba(249,115,22,0.35)]",
                  hoverIconContainer: "group-hover:bg-orange-500 group-hover:border-orange-400 group-hover:shadow-[0_8px_20px_rgba(249,115,22,0.3)] dark:group-hover:shadow-[0_12px_24px_rgba(249,115,22,0.5)]",
                  hoverStepNumber: "group-hover:text-orange-500/20 dark:group-hover:text-orange-400/30"
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  className={`bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 p-8 rounded-[30px] relative shadow-[0_10px_25px_rgba(0,0,0,0.01)] transition-all duration-300 cursor-pointer group ${item.hoverCard}`}
                >
                  <span className={`absolute top-6 right-6 text-4xl font-black text-slate-205/80 dark:text-slate-800/20 tracking-tighter transition-colors duration-300 ${item.hoverStepNumber}`}>
                    {item.step}
                  </span>

                  <div className={`w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 mb-6 text-xl transition-all duration-300 ${item.hoverIconContainer}`}>
                    {item.icon}
                  </div>

                  <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-slate-950 dark:group-hover:text-white group-hover:translate-x-1 transition-all duration-300">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-200 text-sm font-semibold mt-3 leading-relaxed transition-colors duration-300 group-hover:text-slate-700 dark:group-hover:text-white">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* Contact Preview Section */}
        <section className="py-24 px-6 lg:px-20 [perspective:1200px]">
          <motion.div
            whileHover={{ rotateX: 2, rotateY: -2, translateZ: 10 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto text-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[40px] p-16 border border-white/70 dark:border-slate-800/70 shadow-[0_20px_45px_rgba(0,0,0,0.02)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_60px_rgba(249,115,22,0.08)] [transform-style:preserve-3d] transition-all duration-500 cursor-pointer"
          >
            <h1 className="text-5xl font-black text-slate-900 dark:text-slate-50 [transform:translateZ(20px)] tracking-tight">
              Ready to Hit the Road?
            </h1>

            <p className="text-slate-655 dark:text-slate-300 mt-6 text-lg font-bold max-w-2xl mx-auto [transform:translateZ(15px)] leading-relaxed">
              If you have any questions or require custom corporate or long-term rental rates, our support desk is always here.
            </p>

            <div className="[transform:translateZ(25px)] flex justify-center gap-4 mt-10 flex-wrap">
              <Link to="/contact">
                <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/20 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  Get in Touch
                </button>
              </Link>
              <Link to="/cars">
                <button className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 shadow-sm cursor-pointer">
                  Explore Fleet
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <Footer />

      </div>
    </div>
  );
};

export default Home;