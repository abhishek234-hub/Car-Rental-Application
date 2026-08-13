import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaGasPump,
  FaCogs,
  FaUsers,
  FaCheckCircle,
  FaShieldAlt,
  FaStar,
  FaTimes,
  FaCalendarAlt,
  FaTools
} from "react-icons/fa";

const fallbackCars = [
  {
    _id: "thar-1",
    name: "Mahindra Thar",
    price: 3500,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
    fuel: "Diesel",
    transmission: "Manual/Auto",
    seats: 4,
    description: "Rugged 4x4 off-roader, perfect for adventurous road trips and rough terrains.",
    available: true
  },
  {
    _id: "creta-2",
    name: "Hyundai Creta",
    price: 2800,
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=800&auto=format&fit=crop",
    fuel: "Petrol/Diesel",
    transmission: "Automatic",
    seats: 5,
    description: "Vibrant mid-size SUV packed with premium tech and absolute comfort.",
    available: true
  },
  {
    _id: "swift-3",
    name: "Maruti Suzuki Swift",
    price: 1500,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop",
    fuel: "Petrol",
    transmission: "Manual",
    seats: 5,
    description: "Agile, compact hatchback with high mileage. Perfect for navigating city traffic.",
    available: true
  },
  {
    _id: "innova-4",
    name: "Toyota Innova Crysta",
    price: 4000,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop",
    fuel: "Diesel",
    transmission: "Manual/Auto",
    seats: 7,
    description: "Spacious multi-purpose vehicle designed for absolute luxury and family road trips.",
    available: true
  },
  {
    _id: "nexon-5",
    name: "Tata Nexon",
    price: 2200,
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=800&auto=format&fit=crop",
    fuel: "Petrol/EV",
    transmission: "Manual/AMT",
    seats: 5,
    description: "Highly-safe compact SUV offering smooth driving dynamics and modern styling.",
    available: true
  }
];

const defaultTrustReports = {
  "Mahindra Thar": {
    rating: "4.9/5 (102 ratings)",
    serviceDate: "15-June-2026",
    maintenance: "Excellent / Full Inspection Certified",
    safetyRating: "4-Star GNCAP Rated",
    safetyFeatures: "Dual Airbags, ABS, ESP, Hill Hold Assist, Roll Cage",
    sanitized: "Yes (Deep Cleaned & Disinfected Today)",
    ownerVerification: "Verified Partner Fleet #TX001",
    mileage: "15.2 km/l certified"
  },
  "Hyundai Creta": {
    rating: "4.8/5 (89 ratings)",
    serviceDate: "20-June-2026",
    maintenance: "Excellent / Full Inspection Certified",
    safetyRating: "5-Star GNCAP Rated",
    safetyFeatures: "6 Airbags, ABS with EBD, ESC, ISOFIX child mounts",
    sanitized: "Yes (Ozone Disinfected Today)",
    ownerVerification: "Verified Partner Fleet #TX002",
    mileage: "16.8 km/l certified"
  },
  "Maruti Suzuki Swift": {
    rating: "4.7/5 (154 ratings)",
    serviceDate: "10-June-2026",
    maintenance: "Excellent / Standard Inspection Certified",
    safetyRating: "4-Star GNCAP Rated",
    safetyFeatures: "Dual Airbags, ABS with EBD, Reverse Parking Sensors",
    sanitized: "Yes (Deep Cleaned Today)",
    ownerVerification: "Verified Partner Fleet #TX003",
    mileage: "22.5 km/l certified"
  },
  "Toyota Innova Crysta": {
    rating: "4.9/5 (210 ratings)",
    serviceDate: "25-June-2026",
    maintenance: "Excellent / Premium Inspection Certified",
    safetyRating: "5-Star GNCAP Rated",
    safetyFeatures: "7 Airbags, Vehicle Stability Control, Hill Assist Control",
    sanitized: "Yes (Ozone Disinfected & Deep Cleaned Today)",
    ownerVerification: "Verified Partner Fleet #TX004",
    mileage: "12.6 km/l certified"
  },
  "Tata Nexon": {
    rating: "4.9/5 (120 ratings)",
    serviceDate: "18-June-2026",
    maintenance: "Excellent / Full Inspection Certified",
    safetyRating: "5-Star GNCAP Rated (Highest Safety)",
    safetyFeatures: "6 Airbags, ESP, ABS with EBD, Traction Control",
    sanitized: "Yes (Ozone Disinfected Today)",
    ownerVerification: "Verified Partner Fleet #TX005",
    mileage: "17.4 km/l certified"
  }
};

const CarCard = ({ car, pickupDate, returnDate }) => {
  const [showTrustModal, setShowTrustModal] = useState(false);

  // Get trust info for this car name or fall back to default thar info
  const trustInfo = defaultTrustReports[car.name] || defaultTrustReports["Mahindra Thar"];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-350 border-emerald-250/60 dark:border-emerald-900/50";
      case "Limited":
        return "bg-amber-100 dark:bg-amber-955/40 text-amber-800 dark:text-amber-350 border border-amber-205 dark:border-amber-900/50";
      default: // Booked
        return "bg-rose-100 dark:bg-rose-955/40 text-rose-800 dark:text-rose-350 border border-rose-205 dark:border-rose-900/50";
    }
  };

  return (
    <>
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[35px] border border-white/60 dark:border-slate-800/60 p-7 flex flex-col justify-between min-h-[500px] shadow-[0_15px_35px_rgba(0,0,0,0.015)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_50px_rgba(249,115,22,0.08)] hover:bg-white/70 dark:hover:bg-slate-800/65 hover:border-orange-300/55 dark:hover:border-orange-500/50 [transform-style:preserve-3d] hover:[transform:rotateX(6deg)_rotateY(-6deg)_translateZ(20px)] hover:-translate-y-3 transition-all duration-500 ease-out cursor-pointer relative overflow-hidden group">
        
        {/* Dynamic Status Glow Overlay */}
        <div className={`absolute top-0 left-0 w-full h-1.5 ${
          car.availabilityStatus === "Available"
            ? "bg-emerald-400"
            : car.availabilityStatus === "Limited"
            ? "bg-amber-400"
            : "bg-rose-400"
        }`}></div>

        {/* Car Image + 3D Shadow Container */}
        <div className="relative w-full h-48 flex items-center justify-center mb-4 z-10 [transform-style:preserve-3d] overflow-hidden rounded-2xl">
          <div className="absolute bottom-2 w-[85%] h-5 bg-radial-shadow opacity-55 blur-[6px] rounded-full pointer-events-none group-hover:scale-90 transition-transform duration-500"></div>

          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] group-hover:scale-105 [transform:translateZ(25px)] transition-all duration-500 select-none"
          />
        </div>

        {/* Car Details */}
        <div className="z-10 [transform:translateZ(20px)] mt-4">
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-50 tracking-tight">{car.name}</h2>
            <span className={`inline-block shrink-0 px-3 py-1 text-[10px] font-black rounded-full border ${getStatusBadge(car.availabilityStatus)}`}>
              {car.availabilityStatus || "Available"}
            </span>
          </div>

          <p className="text-slate-550 dark:text-slate-400 text-sm font-semibold mt-3 leading-relaxed">
            {car.description || "Experience reliable performance and ultimate comfort with this standard daily rental."}
          </p>

          {/* Specs Tags */}
          <div className="grid grid-cols-3 gap-2 mt-5 text-[11px] font-bold text-slate-650 dark:text-slate-300">
            <div className="flex items-center gap-1.5 justify-center py-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-slate-800/50">
              <FaGasPump className="text-orange-500 text-[13px]" />
              <span>{car.fuel || "Petrol"}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center py-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-slate-800/50">
              <FaCogs className="text-orange-500 text-[13px]" />
              <span>{car.transmission || "Manual"}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center py-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-slate-800/50">
              <FaUsers className="text-orange-500 text-[13px]" />
              <span>{(car.seats || 5)} Seats</span>
            </div>
          </div>
        </div>

        {/* Verification and Pricing Bottom section */}
        <div className="mt-6 flex justify-between items-center z-10 [transform:translateZ(20px)] text-xs font-bold text-orange-600 dark:text-orange-400">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTrustModal(true);
            }}
            className="hover:underline flex items-center gap-1 cursor-pointer outline-none pl-1"
          >
            <FaCheckCircle className="text-[11px]" />
            Trust & Safety Report
          </button>
          
          <div className="flex items-center gap-1 pr-1">
            <FaStar className="text-amber-500 text-[11px]" />
            <span>{trustInfo.rating.split(" ")[0]}</span>
          </div>
        </div>

        {/* Pricing and Button */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/50 dark:border-slate-800/50 z-10 [transform:translateZ(25px)]">
          <div>
            <p className="text-slate-450 dark:text-slate-500 text-[10px] font-extrabold uppercase tracking-widest">Daily Rent</p>
            <p className="text-2xl font-black text-orange-600 dark:text-orange-400">₹{(car.price || 1500).toLocaleString()}</p>
          </div>

          {car.availabilityStatus !== "Booked" ? (
            <Link to="/booking" state={{ carId: car._id, carName: car.name, pickupDate, returnDate }}>
              <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-500 text-white font-bold text-sm shadow-md shadow-orange-500/15 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
                Book Now
              </button>
            </Link>
          ) : (
            <button disabled className="px-5 py-3 rounded-2xl bg-slate-200 dark:bg-slate-850 text-slate-400 dark:text-slate-500 font-bold text-sm cursor-not-allowed shadow-inner border border-slate-300/30 dark:border-slate-800/30">
              Booked Out
            </button>
          )}
        </div>

      </div>

      {/* Trust & Safety Report Modal */}
      {showTrustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-7 shadow-2xl relative">
            <button
              onClick={() => setShowTrustModal(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 text-lg cursor-pointer outline-none"
            >
              <FaTimes />
            </button>            <div className="flex items-center gap-3 mb-6">
              <FaShieldAlt className="text-orange-500 text-3xl" />
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">{car.name} Trust Report</h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-wider">100% Sanitized & Verified Asset</span>
              </div>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-350">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <span className="flex items-center gap-2">
                  <FaStar className="text-amber-500" /> Customer Ratings
                </span>
                <span className="font-extrabold text-slate-855 dark:text-slate-100">{trustInfo.rating}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <span className="flex items-center gap-2">
                  <FaCalendarAlt className="text-orange-500" /> Last Service Date
                </span>
                <span className="font-extrabold text-slate-855 dark:text-slate-100">{trustInfo.serviceDate}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <span className="flex items-center gap-2">
                  <FaTools className="text-orange-500" /> Maintenance Status
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{trustInfo.maintenance}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <span className="flex items-center gap-2">
                  <FaShieldAlt className="text-orange-500" /> Safety Crash Test
                </span>
                <span className="font-extrabold text-slate-855 dark:text-slate-100">{trustInfo.safetyRating}</span>
              </div>

              <div className="flex flex-col gap-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <span className="text-slate-450 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider">Active Safety Tech</span>
                <span className="text-slate-800 dark:text-slate-200 font-extrabold">{trustInfo.safetyFeatures}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <span>Sanitized & Disinfected?</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{trustInfo.sanitized}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <span>Certified Mileage</span>
                <span className="font-extrabold text-slate-855 dark:text-slate-100">{trustInfo.mileage}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Partner Owner ID</span>
                <span className="font-extrabold text-slate-855 dark:text-slate-100">{trustInfo.ownerVerification}</span>
              </div>
            </div>

            <button
              onClick={() => setShowTrustModal(false)}
              className="w-full mt-8 py-3.5 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold rounded-2xl shadow-md hover:scale-[1.02] transition cursor-pointer text-xs"
            >
              Close Trust Report
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const Cars = () => {
  const [carsList, setCarsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  
  const { API_URL } = useAuth();

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        let url = `${API_URL}/cars`;
        if (pickupDate && returnDate) {
          url += `?pickupDate=${pickupDate}&returnDate=${returnDate}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        if (data.success && data.cars.length > 0) {
          setCarsList(data.cars);
        } else {
          setCarsList(fallbackCars);
        }
      } catch (err) {
        console.error("Error fetching cars, using fallback:", err);
        setCarsList(fallbackCars);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [API_URL, pickupDate, returnDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/60 via-amber-50/40 via-orange-50/20 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:via-orange-950/20 dark:to-amber-950/20 text-slate-800 dark:text-slate-100 px-6 lg:px-20 pt-36 pb-20 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-300/20 dark:bg-amber-900/10 blur-[150px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-300/25 dark:bg-orange-905/10 blur-[150px] rounded-full pointer-events-none animate-float-delayed"></div>

      <div className="text-center mb-12 relative z-10">
        <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
          Available Fleet
        </span>
        <h1 className="text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-2">
          Explore Our Cars
        </h1>
        <p className="text-slate-555 dark:text-slate-400 text-md font-bold mt-3">
          Select dates to instantly check live availability and prevent double bookings
        </p>
      </div>

      {/* Real-Time Availability Dates Selector */}
      <div className="relative z-10 max-w-4xl mx-auto mb-16 bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 backdrop-blur-xl rounded-[30px] p-6 shadow-sm">
        <h2 className="text-sm font-black text-slate-850 dark:text-slate-100 mb-4 uppercase tracking-widest pl-1">Live Date-Range Availability Filter</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <span className="absolute left-4 top-2 text-[9px] text-orange-600 dark:text-orange-400 font-black uppercase tracking-widest">Pickup Date</span>
            <input
              type="date"
              value={pickupDate}
              min={getTodayDateString()}
              onChange={(e) => {
                const newPickup = e.target.value;
                setPickupDate(newPickup);
                if (returnDate && new Date(returnDate) < new Date(newPickup)) {
                  setReturnDate(newPickup);
                }
              }}
              className="w-full bg-white/50 dark:bg-slate-950/40 border border-slate-200/85 dark:border-slate-800/60 rounded-2xl pt-6 pb-2.5 pl-4 pr-4 outline-none text-slate-850 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 font-semibold text-xs shadow-sm cursor-pointer"
            />
          </div>
          <div className="relative">
            <span className="absolute left-4 top-2 text-[9px] text-orange-600 dark:text-orange-400 font-black uppercase tracking-widest">Return Date</span>
            <input
              type="date"
              value={returnDate}
              min={pickupDate || getTodayDateString()}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full bg-white/50 dark:bg-slate-950/40 border border-slate-200/85 dark:border-slate-800/60 rounded-2xl pt-6 pb-2.5 pl-4 pr-4 outline-none text-slate-850 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 font-semibold text-xs shadow-sm cursor-pointer"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24 relative z-10">
          <p className="text-xl text-slate-505 dark:text-slate-400 font-bold animate-pulse">Loading live fleet availability status...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10 [perspective:1200px]">
          {carsList.map((car) => (
            <CarCard key={car._id} car={car} pickupDate={pickupDate} returnDate={returnDate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Cars;