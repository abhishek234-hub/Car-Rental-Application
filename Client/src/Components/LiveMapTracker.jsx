import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import {
  FaTimes,
  FaLocationArrow,
  FaGasPump,
  FaClock,
  FaRoute,
  FaTachometerAlt,
  FaPhone
} from "react-icons/fa";

const LiveMapTracker = ({ booking, onClose }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const [speed, setSpeed] = useState(55);
  const [fuel, setFuel] = useState(78);
  const [eta, setEta] = useState(15);
  const [distance, setDistance] = useState(8.2);
  const [locating, setLocating] = useState(true);

  const carName = booking?.car?.name || "Your Car";
  const pickupLocation = booking?.pickupLocation || "Pickup Point";
  const dropLocation = booking?.dropLocation || "Dropoff Point";

  // Bhopal coordinates default fallbacks
  const bhopalCenter = [23.25993, 77.41262];
  const bhopalDropoff = [23.28456, 77.45612];

  // Geocoding helper using Nominatim
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (err) {
      console.error("Geocoding failed for:", address, err);
    }
    return null;
  };

  useEffect(() => {
    let animationInterval = null;
    let mapInstance = null;

    const setupMap = async () => {
      setLocating(true);

      // Geocode both points
      let pickupCoords = await geocodeAddress(pickupLocation);
      let dropoffCoords = await geocodeAddress(dropLocation);

      // Fallback if geocoding fails or returns null
      if (!pickupCoords) pickupCoords = bhopalCenter;
      if (!dropoffCoords) dropoffCoords = bhopalDropoff;

      setLocating(false);

      if (!mapContainerRef.current) return;

      // Initialize map instance
      mapInstance = L.map(mapContainerRef.current, {
        zoomControl: false
      }).setView(pickupCoords, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance);

      // Add Zoom control at bottom right
      L.control.zoom({ position: "bottomright" }).addTo(mapInstance);

      mapInstanceRef.current = mapInstance;

      // Pickup Marker (Green Pin with Pulse effect)
      L.marker(pickupCoords, {
        icon: L.divIcon({
          html: `
            <div class="relative flex items-center justify-center">
              <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-md"></span>
            </div>
          `,
          className: "custom-pin",
          iconSize: [24, 24]
        })
      }).addTo(mapInstance).bindPopup(`<b>Pickup:</b> ${pickupLocation}`).openPopup();

      // Dropoff Marker (Red Pin)
      L.marker(dropoffCoords, {
        icon: L.divIcon({
          html: `
            <div class="relative flex items-center justify-center">
              <span class="inline-flex rounded-full h-4 w-4 bg-rose-600 border-2 border-white shadow-md"></span>
            </div>
          `,
          className: "custom-pin",
          iconSize: [16, 16]
        })
      }).addTo(mapInstance).bindPopup(`<b>Dropoff:</b> ${dropLocation}`);

      // Draw Route Line
      const routeLine = L.polyline([pickupCoords, dropoffCoords], {
        color: "#f97316",
        weight: 5,
        opacity: 0.7,
        dashArray: "10, 10"
      }).addTo(mapInstance);

      // Fit bounds to show the whole route
      mapInstance.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

      // Animate Car marker along the route line
      const carIcon = L.divIcon({
        html: `
          <div class="bg-orange-500 p-2.5 rounded-full border-2 border-white text-white shadow-xl flex items-center justify-center scale-110">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M496 384c0 17.7-14.3 32-32 32h-32c-17.7 0-32-14.3-32-32v-32H112v32c0 17.7-14.3 32-32 32H48c-17.7 0-32-14.3-32-32v-96l24-96h400l24 96v96zm-416-64c13.3 0 24-10.7 24-24s-10.7-24-24-24-24 10.7-24 24 10.7 24 24 24zm352 0c13.3 0 24-10.7 24-24s-10.7-24-24-24-24 10.7-24 24 10.7 24 24 24zm-288-96h192l-16-64H184l-16 64z"></path>
            </svg>
          </div>
        `,
        className: "custom-car-pin",
        iconSize: [36, 36]
      });

      const carMarker = L.marker(pickupCoords, { icon: carIcon }).addTo(mapInstance);

      // Calculate initial mock route values
      const latDiff = Math.abs(pickupCoords[0] - dropoffCoords[0]);
      const lngDiff = Math.abs(pickupCoords[1] - dropoffCoords[1]);
      // Estimate approximate distance in km (rough calculation)
      const approxDistance = Math.max(2.5, Math.round((latDiff + lngDiff) * 85 * 10) / 10);
      const approxEta = Math.round(approxDistance * 1.8);

      let fraction = 0;

      animationInterval = setInterval(() => {
        fraction += 0.005; // Segment increments
        if (fraction > 1) {
          fraction = 0; // Restart path
          setFuel(78);
        }

        // Interpolate coordinates
        const currentLat = pickupCoords[0] + (dropoffCoords[0] - pickupCoords[0]) * fraction;
        const currentLng = pickupCoords[1] + (dropoffCoords[1] - pickupCoords[1]) * fraction;
        const nextPos = [currentLat, currentLng];

        carMarker.setLatLng(nextPos);

        // Keep map centered on the car dynamically
        if (fraction > 0.05 && fraction < 0.95) {
          mapInstance.panTo(nextPos, { animate: true, duration: 0.5 });
        }

        // Telemetry stats update
        setDistance(Math.max(0.1, parseFloat(((1 - fraction) * approxDistance).toFixed(1))));
        setEta(Math.max(1, Math.round((1 - fraction) * approxEta)));
        setSpeed(Math.round(45 + Math.random() * 15));
        setFuel((prev) => Math.max(5, parseFloat((prev - 0.03).toFixed(2))));
      }, 300);
    };

    setupMap();

    return () => {
      if (animationInterval) clearInterval(animationInterval);
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [pickupLocation, dropLocation]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full bg-white/40 border border-white/60 backdrop-blur-xl rounded-[40px] p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden [perspective:1200px]"
    >
      {/* Header bar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live GPS Tracking
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">
            Track {carName}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/80 border border-slate-205 text-slate-650 flex items-center justify-center hover:bg-white hover:text-rose-500 hover:scale-105 transition-all duration-300 shadow-sm cursor-pointer"
        >
          <FaTimes />
        </button>
      </div>

      {/* Map + Telemetry Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Leaflet Map Arena */}
        <div className="flex-1 bg-orange-50/10 border border-white/80 rounded-[30px] overflow-hidden relative shadow-inner h-[400px] z-0">
          {locating && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-black text-orange-500 uppercase tracking-widest animate-pulse">Locating route & geocoding...</p>
            </div>
          )}
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Current Landmark Bubble overlay */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-205/50 shadow-sm flex items-center gap-2 z-[400]">
            <FaLocationArrow className="text-orange-500 text-xs animate-pulse" />
            <span className="text-[11px] font-black text-slate-700 tracking-tight uppercase">
              Route: Active Navigation
            </span>
          </div>
        </div>

        {/* Telemetry Stats Panel */}
        <div className="w-full lg:w-[300px] flex flex-col gap-4">
          
          {/* Status Block */}
          <div className="bg-white/50 border border-slate-200/60 rounded-3xl p-5 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VEHICLE STATE</p>
            <div className="flex items-center gap-2.5 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-lg font-black text-slate-855">ON ROAD</span>
            </div>
            
            {booking?.phone && (
              <div className="mt-3 flex items-center gap-2 font-semibold text-xs text-slate-600">
                <FaPhone className="text-orange-500 text-[10px]" />
                <span>Alerts sent to: <b>{booking.phone}</b></span>
              </div>
            )}
            
            <p className="text-[11px] text-slate-500 font-bold mt-3 leading-relaxed">
              Your rental vehicle has departed pickup point and is en route.
            </p>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Speedometer */}
            <div className="bg-white/50 border border-slate-200/60 rounded-3xl p-4 shadow-sm flex flex-col justify-between h-28">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
                <FaTachometerAlt className="text-sm" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-455">Speed</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">{speed} <span className="text-[10px] font-bold">km/h</span></p>
              </div>
            </div>

            {/* Fuel gauge */}
            <div className="bg-white/50 border border-slate-200/60 rounded-3xl p-4 shadow-sm flex flex-col justify-between h-28">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                <FaGasPump className="text-sm" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Fuel Level</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">{fuel.toFixed(0)}%</p>
              </div>
            </div>

            {/* Clock Timer */}
            <div className="bg-white/50 border border-slate-200/60 rounded-3xl p-4 shadow-sm flex flex-col justify-between h-28">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                <FaClock className="text-sm" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">ETA</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">{eta} <span className="text-[10px] font-bold">mins</span></p>
              </div>
            </div>

            {/* Odometer */}
            <div className="bg-white/50 border border-slate-200/60 rounded-3xl p-4 shadow-sm flex flex-col justify-between h-28">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-500">
                <FaRoute className="text-sm" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Remaining</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">{distance} <span className="text-[10px] font-bold">km</span></p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default LiveMapTracker;
