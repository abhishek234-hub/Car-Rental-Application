import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  FaCar,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaPlus,
  FaTrash,
  FaCheck,
  FaTimes,
  FaHourglassHalf,
  FaLocationArrow,
  FaTicketAlt,
  FaInfoCircle,
  FaWrench,
  FaEdit
} from "react-icons/fa";

import LiveMapTracker from "../Components/LiveMapTracker";

const AdminDashboard = () => {
  const { user, token, loading: authLoading, API_URL } = useAuth();
  const navigate = useNavigate();

  // State
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTrackBookingId, setActiveTrackBookingId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Form State for Adding Car
  const [carName, setCarName] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [carImage, setCarImage] = useState("");
  const [carDescription, setCarDescription] = useState("");
  const [carPurpose, setCarPurpose] = useState("rent");
  const [addingCar, setAddingCar] = useState(false);

  // Edit Car States
  const [editingCar, setEditingCar] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPurpose, setEditPurpose] = useState("rent");
  const [updatingCar, setUpdatingCar] = useState(false);

  const handleEditClick = (car) => {
    setEditingCar(car);
    setEditName(car.name);
    setEditPrice(car.price);
    setEditImage(car.image);
    setEditDescription(car.description);
    setEditPurpose(car.purpose || "rent");
  };

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading) {
      if (!token) {
        navigate("/login");
      } else if (user && user.role !== "admin") {
        navigate("/dashboard");
      }
    }
  }, [token, user, authLoading, navigate]);

  // Fetch all cars, bookings, purchases, and support tickets
  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);

      // Fetch Cars
      const carsRes = await fetch(`${API_URL}/cars`);
      const carsData = await carsRes.json();

      // Fetch Bookings (Admin only)
      const bookingsRes = await fetch(`${API_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const bookingsData = await bookingsRes.json();

      // Fetch Purchases (Admin only)
      const purchasesRes = await fetch(`${API_URL}/purchases`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const purchasesData = await purchasesRes.json();

      // Fetch Support Tickets (Admin only)
      const ticketsRes = await fetch(`${API_URL}/support`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const ticketsData = await ticketsRes.json();

      if (carsData.success) setCars(carsData.cars);
      if (bookingsData.success) setBookings(bookingsData.bookings);
      if (purchasesData.success) setPurchases(purchasesData.purchases);
      if (ticketsData.success) setTickets(ticketsData.tickets);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [API_URL, token]);

  // Add Car
  const handleAddCar = async (e) => {
    e.preventDefault();

    if (!carName || !carPrice || !carImage || !carDescription) {
      alert("Please fill in all fields.");
      return;
    }

    setAddingCar(true);

    try {
      const response = await fetch(`${API_URL}/cars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: carName,
          price: Number(carPrice),
          image: carImage,
          description: carDescription,
          purpose: carPurpose,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCars([...cars, data.car]);
        setCarName("");
        setCarPrice("");
        setCarImage("");
        setCarDescription("");
        setCarPurpose("rent");
        alert("Car added successfully!");
      } else {
        alert(data.message || "Failed to add car.");
      }
    } catch (err) {
      console.error("Error adding car:", err);
      alert("Server error. Please try again.");
    } finally {
      setAddingCar(false);
    }
  };

  // Toggle Availability
  const toggleAvailability = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/cars/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          available: !currentStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCars(
          cars.map((car) =>
            car._id === id ? { ...car, available: !currentStatus } : car
          )
        );
      } else {
        alert(data.message || "Failed to update car availability.");
      }
    } catch (err) {
      console.error("Error updating availability:", err);
    }
  };

  // Delete Car
  const deleteCar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      const response = await fetch(`${API_URL}/cars/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setCars(cars.filter((car) => car._id !== id));
      } else {
        alert(data.message || "Failed to delete car.");
      }
    } catch (err) {
      console.error("Error deleting car:", err);
    }
  };

  // Update Car
  const handleUpdateCar = async (e) => {
    e.preventDefault();
    if (!editName || !editPrice || !editImage || !editDescription) {
      alert("Please fill in all fields.");
      return;
    }
    setUpdatingCar(true);
    try {
      const response = await fetch(`${API_URL}/cars/${editingCar._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          price: Number(editPrice),
          image: editImage,
          description: editDescription,
          purpose: editPurpose,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setCars(cars.map((c) => (c._id === editingCar._id ? data.car : c)));
        setEditingCar(null);
        alert("Car updated successfully!");
      } else {
        alert(data.message || "Failed to update car.");
      }
    } catch (err) {
      console.error("Error updating car:", err);
      alert("Failed to connect to the server.");
    } finally {
      setUpdatingCar(false);
    }
  };

  // Update Booking Status (Accept / Reject)
  const handleBookingAction = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchData();
      } else {
        alert(data.message || "Failed to update booking status.");
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  };

  // Update Refund Status (Admin)
  const handleRefundStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}/refund`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          refundStatus: newStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchData();
      } else {
        alert(data.message || "Failed to update refund status.");
      }
    } catch (err) {
      console.error("Error updating refund status:", err);
    }
  };

  // Update Support Ticket Status (Admin)
  const handleTicketStatusChange = async (ticketId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/support/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchData();
      } else {
        alert(data.message || "Failed to update ticket status.");
      }
    } catch (err) {
      console.error("Error updating ticket status:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-orange-400 font-black text-xs tracking-widest uppercase animate-pulse">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  // Calculations for Stats
  const calculateDays = (start, end) => {
    const diffTime = Math.abs(new Date(end) - new Date(start));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const acceptedBookings = bookings.filter((b) => b.status === "accepted" && (!b.cancellation || !b.cancellation.requested));
  
  const totalRevenue = acceptedBookings.reduce((sum, b) => {
    const days = calculateDays(b.pickupDate, b.returnDate);
    const price = b.car?.price || 0;
    return sum + (days * price);
  }, 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-355 border border-emerald-250/50";
      case "rejected":
        return "bg-rose-100 dark:bg-rose-955/40 text-rose-800 dark:text-rose-355 border border-rose-250/50";
      default:
        return "bg-amber-100 dark:bg-amber-955/40 text-amber-800 dark:text-amber-355 border border-amber-250/50";
    }
  };

  const activeTrackingCar = bookings.find((b) => b._id === activeTrackBookingId)?.car?.name;

  // Master Occupancy Calculations
  const rentCars = cars.filter((c) => c.purpose === "rent");
  const bookedCars = rentCars.filter((c) => !c.available);
  const unbookedCars = rentCars.filter((c) => c.available);
  const bookedPercent = rentCars.length > 0 ? Math.round((bookedCars.length / rentCars.length) * 100) : 0;

  const getRenterInfo = (carId) => {
    const activeBooking = bookings.find((b) => b.car?._id === carId && b.status === "accepted" && (!b.cancellation || !b.cancellation.requested));
    return activeBooking ? `${activeBooking.user?.name || "User"} (${activeBooking.user?.email || ""})` : "Rented Out";
  };

  // New calculation counts
  const cancelledBookings = bookings.filter((b) => b.cancellation && b.cancellation.requested);
  const cancelledBookingsCount = cancelledBookings.length;
  const openTicketsCount = tickets.filter((t) => t.status !== "Resolved").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/60 via-amber-50/40 via-orange-50/20 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:via-orange-950/20 dark:to-amber-950/20 text-slate-800 dark:text-slate-100 px-6 lg:px-20 pt-36 pb-20 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-300/20 dark:bg-amber-900/10 blur-[150px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-300/25 dark:bg-orange-900/10 blur-[150px] rounded-full pointer-events-none animate-float-delayed"></div>

      {/* Heading */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
          Admin Control Center
        </span>
        <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-1">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm mt-1">Manage fleet lists, audit refunds, update support tickets, and approve rental requests</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24 relative z-10">
          <p className="text-xl text-slate-500 dark:text-slate-400 font-bold animate-pulse">Loading dashboard metrics...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 relative z-10 text-rose-500 font-bold">{error}</div>
      ) : (
        <div className="max-w-7xl mx-auto">
          
          {/* Tabs Selector */}
          <div className="relative z-10 flex flex-wrap gap-3 mt-8 bg-white/20 dark:bg-slate-900/20 backdrop-blur-md p-2 rounded-2xl border border-white/40 dark:border-slate-800/45 max-w-5xl">
            {[
              { id: "overview", label: "Overview & Master Status" },
              { id: "bookings", label: `Bookings Queue (${pendingBookings})` },
              { id: "refunds", label: `Refunds Queue (${cancelledBookingsCount})` },
              { id: "tickets", label: `Support Tickets (${openTicketsCount})` },
              { id: "fleet", label: "Manage Fleet Inventory" },
              { id: "sales", label: "Marketplace Sales Logs" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-orange-400 to-orange-655 text-white shadow-md shadow-orange-500/15 scale-105"
                    : "text-slate-605 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-800/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="mt-10">
            
            {/* Overview / Master Status Tab */}
            {activeTab === "overview" && (
              <div className="space-y-12">
                {/* Stats Grid */}
                <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 [perspective:1200px]">
                  <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-850 flex items-center justify-center text-orange-500 text-lg shadow-sm">
                      <FaCar />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-4">{cars.length}</h1>
                    <p className="text-slate-550 dark:text-slate-400 text-xs font-bold mt-1">Total Fleet Cars</p>
                  </div>

                  <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-850 flex items-center justify-center text-orange-500 text-lg shadow-sm">
                      <FaCalendarCheck />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-4">{bookings.length}</h1>
                    <p className="text-slate-550 dark:text-slate-400 text-xs font-bold mt-1">Total Bookings</p>
                  </div>

                  <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-850 flex items-center justify-center text-amber-500 text-lg shadow-sm">
                      <FaHourglassHalf />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-4">{pendingBookings}</h1>
                    <p className="text-slate-550 dark:text-slate-400 text-xs font-bold mt-1">Pending Requests</p>
                  </div>

                  <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-850 flex items-center justify-center text-emerald-500 text-lg shadow-sm">
                      <FaMoneyBillWave />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-4">₹{totalRevenue.toLocaleString()}</h1>
                    <p className="text-slate-550 dark:text-slate-400 text-xs font-bold mt-1">Total Revenue</p>
                  </div>
                </div>

                {/* Master Fleet Status Visualizer */}
                <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 backdrop-blur-xl rounded-[35px] p-8 shadow-sm">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Master Fleet Occupancy</h2>
                  <p className="text-slate-550 dark:text-slate-400 text-sm font-semibold mt-1">Real-time status of rental fleet vehicles</p>

                  <div className="mt-8 space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold text-slate-700 dark:text-slate-300">
                      <span>Booked: <span className="text-orange-600 dark:text-orange-400 font-extrabold">{bookedCars.length}</span> | Unbooked: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{unbookedCars.length}</span></span>
                      <span>Total Rental Cars: {rentCars.length}</span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-850 rounded-full h-4.5 overflow-hidden shadow-inner">
                      <div
                        className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${bookedPercent}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-[11px] font-black text-slate-450 dark:text-slate-500 mt-1">
                      <span>0% Booked</span>
                      <span className="text-orange-600 dark:text-orange-400">{bookedPercent}% of Fleet Booked</span>
                      <span>100% Booked</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10 mt-12 border-t border-slate-200/50 dark:border-slate-800/50 pt-8">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                        Booked Fleet ({bookedCars.length})
                      </h3>

                      {bookedCars.length === 0 ? (
                        <div className="bg-white/20 dark:bg-slate-955/20 border border-white/30 dark:border-slate-800/30 rounded-2xl p-6 text-center text-slate-500 text-xs font-bold">
                          All rental vehicles are currently unbooked.
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                          {bookedCars.map((car) => (
                            <div key={car._id} className="flex items-center gap-4 bg-white/50 dark:bg-slate-955/30 border border-white/50 dark:border-slate-800/40 p-4 rounded-2xl">
                              <img src={car.image} alt={car.name} className="w-16 h-11 object-cover rounded-lg bg-white/40" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-extrabold text-sm text-slate-855 dark:text-slate-100 truncate">{car.name}</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                  Rented To: <span className="text-orange-600 dark:text-orange-400 font-extrabold">{getRenterInfo(car._id)}</span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        Unbooked / Available ({unbookedCars.length})
                      </h3>

                      {unbookedCars.length === 0 ? (
                        <div className="bg-white/20 dark:bg-slate-955/20 border border-white/30 dark:border-slate-800/30 rounded-2xl p-6 text-center text-slate-500 text-xs font-bold">
                          All rental vehicles are booked out.
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                          {unbookedCars.map((car) => (
                            <div key={car._id} className="flex items-center gap-4 bg-white/50 dark:bg-slate-955/30 border border-white/50 dark:border-slate-800/40 p-4 rounded-2xl justify-between">
                              <div className="flex items-center gap-4">
                                <img src={car.image} alt={car.name} className="w-16 h-11 object-cover rounded-lg bg-white/40" />
                                <div>
                                  <h4 className="font-extrabold text-sm text-slate-855 dark:text-slate-100 truncate">{car.name}</h4>
                                  <p className="text-[11px] text-orange-600 dark:text-orange-450 font-extrabold mt-0.5">₹{car.price.toLocaleString()}/day</p>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-355 border border-emerald-250/50 text-[9px] font-black uppercase">Ready</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Queue Tab */}
            {activeTab === "bookings" && (
              <div className="space-y-10">
                <AnimatePresence>
                  {activeTrackBookingId && (
                    <div className="relative z-10">
                      <LiveMapTracker
                        carName={activeTrackingCar}
                        onClose={() => setActiveTrackBookingId(null)}
                      />
                    </div>
                  )}
                </AnimatePresence>

                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-slate-50 tracking-tight">Active Approvals Queue</h2>
                  
                  {bookings.filter(b => !b.cancellation || !b.cancellation.requested).length === 0 ? (
                    <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-10 text-center text-slate-500 dark:text-slate-400 font-bold shadow-sm">
                      No active booking requests submitted yet.
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {bookings.filter(b => !b.cancellation || !b.cancellation.requested).map((booking) => {
                        const days = calculateDays(booking.pickupDate, booking.returnDate);
                        const cost = days * (booking.car?.price || 0);

                        return (
                          <div
                            key={booking._id}
                            className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-400"></div>
                            <div>
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(booking.status)}`}>
                                  {booking.status}
                                </span>
                                <span className="text-xs text-slate-455 font-mono">ID: {booking._id.slice(-8)}</span>
                              </div>
                              <h3 className="text-xl font-black mt-3 text-slate-850 dark:text-slate-50">Car: {booking.car?.name || "Deleted Car"}</h3>
                              <p className="text-slate-600 dark:text-slate-400 text-xs font-bold mt-1">Renter: <span className="font-extrabold text-orange-600 dark:text-orange-400">{booking.user?.name}</span> ({booking.user?.email})</p>
                              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-3 space-y-1">
                                <p>Location: {booking.pickupLocation}</p>
                                <p>Duration: {new Date(booking.pickupDate).toLocaleDateString()} ({booking.pickupTime || "10:00"}) to {new Date(booking.returnDate).toLocaleDateString()} ({booking.returnTime || "18:00"}) ({days} days)</p>
                              </div>
                            </div>

                            <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 w-full lg:w-auto border-t lg:border-none pt-4 lg:pt-0 border-slate-200/50">
                              <div className="text-left lg:text-right">
                                <p className="text-[10px] text-slate-455 dark:text-slate-505 uppercase tracking-widest font-black">Total Cost</p>
                                <p className="text-xl font-black text-orange-655 dark:text-orange-400">₹{cost.toLocaleString()}</p>
                              </div>

                              <div className="flex gap-2">
                                {booking.status === "accepted" && (
                                  <button
                                    onClick={() => {
                                      setActiveTrackBookingId(activeTrackBookingId === booking._id ? null : booking._id);
                                    }}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                                  >
                                    <FaLocationArrow /> Track Live
                                  </button>
                                )}
                                {booking.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => handleBookingAction(booking._id, "accepted")}
                                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                                    >
                                      <FaCheck /> Accept
                                    </button>
                                    <button
                                      onClick={() => handleBookingAction(booking._id, "rejected")}
                                      className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                                    >
                                      <FaTimes /> Reject
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Refunds Queue Tab */}
            {activeTab === "refunds" && (
              <div className="space-y-10">
                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
                    <FaMoneyBillWave className="text-rose-500" />
                    Cancellation & Refunds Audit
                  </h2>

                  {cancelledBookingsCount === 0 ? (
                    <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-10 text-center text-slate-500 dark:text-slate-400 font-bold shadow-sm">
                      No cancellation requests submitted yet.
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {cancelledBookings.map((booking) => {
                        const days = calculateDays(booking.pickupDate, booking.returnDate);
                        const totalCost = days * (booking.car?.price || 0);

                        return (
                          <div
                            key={booking._id}
                            className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 dark:bg-rose-955/40 dark:text-rose-350 border border-rose-250/50">
                                  Cancelled
                                </span>
                                <span className="text-xs text-slate-455 font-mono">Invoice: {booking._id.slice(-8).toUpperCase()}</span>
                              </div>

                              <h3 className="text-xl font-black text-slate-855 dark:text-slate-50">Car: {booking.car?.name || "Deleted Vehicle"}</h3>
                              <p className="text-xs text-slate-550 dark:text-slate-400 font-bold">Renter: <span className="font-extrabold text-orange-600 dark:text-orange-400">{booking.user?.name}</span> ({booking.user?.email})</p>
                              
                              <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-455">
                                <b>Cancellation Reason:</b> {booking.cancellation.reason}
                              </div>

                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold space-y-1">
                                <p>Requested on: {new Date(booking.cancellation.requestDate).toLocaleString()}</p>
                                <p>Original billing cost: ₹{totalCost.toLocaleString()}</p>
                              </div>
                            </div>

                            <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 w-full lg:w-auto border-t lg:border-none pt-4 lg:pt-0 border-slate-200/50">
                              <div className="text-left lg:text-right">
                                <p className="text-[10px] text-slate-455 dark:text-slate-505 uppercase tracking-widest font-black flex items-center gap-1">
                                  <FaInfoCircle /> Refund Amount
                                </p>
                                <p className="text-xl font-black text-emerald-650 dark:text-emerald-400">₹{booking.cancellation.refundAmount.toLocaleString()}</p>
                                <p className="text-[10px] text-slate-455 mt-1 uppercase tracking-wider font-extrabold">Stage: {booking.cancellation.refundStatus}</p>
                              </div>

                              <div className="flex gap-2">
                                {booking.cancellation.refundStatus === "Initiated" && (
                                  <button
                                    onClick={() => handleRefundStatusChange(booking._id, "Processing")}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs transition cursor-pointer"
                                  >
                                    Move to Processing
                                  </button>
                                )}
                                {booking.cancellation.refundStatus === "Processing" && (
                                  <button
                                    onClick={() => handleRefundStatusChange(booking._id, "Completed")}
                                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs transition cursor-pointer"
                                  >
                                    Mark Completed (Disbursed)
                                  </button>
                                )}
                                {booking.cancellation.refundStatus === "Completed" && (
                                  <span className="text-emerald-500 text-xs font-black uppercase flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                                    <FaCheckCircle /> Refund Completed
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Support Tickets Tab */}
            {activeTab === "tickets" && (
              <div className="space-y-10">
                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
                    <FaTicketAlt className="text-orange-500" />
                    Customer Support Tickets
                  </h2>

                  {tickets.length === 0 ? (
                    <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-10 text-center text-slate-500 dark:text-slate-400 font-bold shadow-sm">
                      No support tickets raised yet.
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {tickets.map((ticket) => (
                        <div
                          key={ticket._id}
                          className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-400"></div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-orange-100 text-orange-800 dark:bg-orange-955/40 dark:text-orange-300 border border-orange-255/50">
                                {ticket.category}
                              </span>
                              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${
                                ticket.status === "Resolved"
                                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-355 border border-emerald-250/50"
                                  : ticket.status === "In Progress"
                                  ? "bg-amber-100 dark:bg-amber-955/40 text-amber-800 dark:text-amber-355 border border-amber-250/50"
                                  : "bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-355 border border-orange-255/50"
                              }`}>
                                {ticket.status}
                              </span>
                            </div>

                            <p className="text-slate-800 dark:text-slate-100 font-black text-sm">{ticket.description}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                              Raised By: <span className="font-bold">{ticket.user?.name}</span> ({ticket.user?.email}) on {new Date(ticket.createdAt).toLocaleString()}
                            </p>
                          </div>

                          <div className="shrink-0">
                            {ticket.status === "Open" && (
                              <button
                                onClick={() => handleTicketStatusChange(ticket._id, "In Progress")}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs transition cursor-pointer"
                              >
                                Mark In Progress
                              </button>
                            )}
                            {ticket.status === "In Progress" && (
                              <button
                                onClick={() => handleTicketStatusChange(ticket._id, "Resolved")}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs transition cursor-pointer"
                              >
                                Resolve & Close Ticket
                              </button>
                            )}
                            {ticket.status === "Resolved" && (
                              <span className="text-emerald-500 text-xs font-black uppercase flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                                <FaCheckCircle /> Resolved
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Manage Fleet Inventory Tab */}
            {activeTab === "fleet" && (
              <div className="space-y-16">
                <div className="relative z-10">
                  <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-805/60 backdrop-blur-xl rounded-[35px] p-8 shadow-sm">
                    <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-slate-50 tracking-tight">Add New Car to Fleet</h2>

                    <form onSubmit={handleAddCar} className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Car Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Tata Nexon"
                            value={carName}
                            onChange={(e) => setCarName(e.target.value)}
                            className="bg-white/50 dark:bg-slate-950/40 border border-slate-200/85 dark:border-slate-800/60 rounded-2xl px-5 py-3.5 outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-855 dark:text-slate-100 font-semibold text-sm shadow-sm"
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Listing Type</label>
                          <select
                            value={carPurpose}
                            onChange={(e) => setCarPurpose(e.target.value)}
                            className="bg-white/50 dark:bg-slate-955/40 border border-slate-200/85 dark:border-slate-805/60 rounded-2xl px-5 py-3.5 outline-none focus:bg-white dark:focus:bg-slate-905 text-slate-855 dark:text-slate-100 font-semibold text-sm shadow-sm cursor-pointer"
                          >
                            <option value="rent" className="dark:bg-slate-900 dark:text-white">For Rent</option>
                            <option value="sale" className="dark:bg-slate-900 dark:text-white">For Sale</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                            {carPurpose === "sale" ? "Purchase Price (₹)" : "Price per Day (₹)"}
                          </label>
                          <input
                            type="number"
                            placeholder={carPurpose === "sale" ? "e.g. 850000" : "e.g. 2200"}
                            value={carPrice}
                            onChange={(e) => setCarPrice(e.target.value)}
                            className="bg-white/50 dark:bg-slate-950/40 border border-slate-200/85 dark:border-slate-800/60 rounded-2xl px-5 py-3.5 outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-855 dark:text-slate-100 font-semibold text-sm shadow-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Image URL</label>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={carImage}
                          onChange={(e) => setCarImage(e.target.value)}
                          className="bg-white/50 dark:bg-slate-955/45 border border-slate-200/85 dark:border-slate-800/60 rounded-2xl px-5 py-3.5 outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-855 dark:text-slate-100 font-semibold text-sm shadow-sm"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Description</label>
                        <textarea
                          placeholder="Describe mileage parameters, fuel constraints, transmission comfort..."
                          value={carDescription}
                          onChange={(e) => setCarDescription(e.target.value)}
                          rows="3"
                          className="bg-white/50 dark:bg-slate-955/40 border border-slate-200/85 dark:border-slate-800/60 rounded-2xl px-5 py-3.5 outline-none focus:bg-white dark:focus:bg-slate-905 text-slate-855 dark:text-slate-100 resize-none font-semibold text-sm shadow-sm"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={addingCar}
                        className="px-8 py-3.5 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition text-white font-bold text-sm shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
                      >
                        <FaPlus />
                        {addingCar ? "Adding Car..." : "Add Car to Fleet"}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-slate-50 tracking-tight">Manage Fleet Inventory</h2>

                  <div className="grid gap-6">
                    {cars.length === 0 ? (
                      <p className="text-slate-555 dark:text-slate-400 font-bold">No cars currently configured in fleet inventory.</p>
                    ) : (
                      cars.map((car) => (
                        <div
                          key={car._id}
                          className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-805/60 rounded-3xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-400"></div>

                          <div className="flex items-center gap-6 w-full lg:w-auto">
                            <div className="w-24 h-16 rounded-xl overflow-hidden bg-white/50 dark:bg-slate-955/50 border border-white/50 dark:border-slate-800/50 flex items-center justify-center p-1 shadow-sm">
                              <img
                                src={car.image}
                                alt={car.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-black text-slate-855 dark:text-slate-55">{car.name}</h3>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                                  car.purpose === "sale"
                                    ? "bg-amber-100 dark:bg-amber-955/40 text-amber-800 dark:text-amber-355 border-amber-250/60"
                                    : "bg-orange-100 dark:bg-orange-955/40 text-orange-800 dark:text-orange-300 border border-orange-200"
                                }`}>
                                  {car.purpose === "sale" ? "Sale" : "Rent"}
                                </span>
                              </div>
                              <p className="text-orange-600 dark:text-orange-400 font-black text-sm mt-0.5">
                                  ₹{car.price.toLocaleString()}{car.purpose === "sale" ? "" : "/day"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-5 w-full lg:w-auto justify-between lg:justify-end">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${
                              car.available
                                ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-355 border-emerald-250/60"
                                : "bg-rose-100 dark:bg-rose-955/40 text-rose-800 dark:text-rose-355 border-rose-250/60"
                            }`}>
                              {car.available ? "Available" : (car.purpose === "sale" ? "Sold" : "Rented")}
                            </span>

                            <div className="flex gap-2">
                              <button
                                onClick={() => toggleAvailability(car._id, car.available)}
                                className="px-4 py-2 bg-white dark:bg-slate-855 hover:bg-slate-55/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition text-xs font-bold shadow-sm cursor-pointer"
                              >
                                Change Status
                              </button>
                              <button
                                onClick={() => handleEditClick(car)}
                                className="p-3 bg-white dark:bg-slate-855 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-orange-500 rounded-xl transition cursor-pointer shadow-sm"
                                title="Edit Car Details"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => deleteCar(car._id)}
                                className="p-3 bg-white dark:bg-slate-855 hover:bg-rose-50 border border-slate-205 text-rose-500 dark:text-rose-455 rounded-xl transition cursor-pointer shadow-sm"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Sales Logs Tab */}
            {activeTab === "sales" && (
              <div className="space-y-10">
                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-slate-50 tracking-tight">Fleet Sales History</h2>

                  {purchases.length === 0 ? (
                    <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-10 text-center text-slate-500 dark:text-slate-400 font-bold shadow-sm">
                      No car sales completed yet.
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {purchases.map((purchase) => (
                        <div
                          key={purchase._id}
                          className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400"></div>

                          <div>
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase border bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-350 border-emerald-255/60">
                                Paid & Sold
                              </span>
                              <span className="text-xs text-slate-455 font-mono">Invoice: {purchase._id.slice(-8).toUpperCase()}</span>
                            </div>

                            <h3 className="text-xl font-black mt-3 text-slate-855 dark:text-slate-55">Vehicle: {purchase.car?.name || "Deleted Vehicle"}</h3>
                            <p className="text-slate-655 dark:text-slate-400 text-xs font-bold mt-1">Buyer: <span className="font-extrabold text-emerald-650">{purchase.user?.name}</span> ({purchase.user?.email})</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-3">Transaction Date: {new Date(purchase.purchaseDate).toLocaleString()}</p>
                          </div>

                          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 w-full lg:w-auto border-t lg:border-none pt-4 lg:pt-0 border-slate-200/50">
                            <div className="text-left lg:text-right">
                              <p className="text-[10px] text-slate-450 dark:text-slate-500 uppercase tracking-widest font-black">Sales Price</p>
                              <p className="text-xl font-black text-emerald-600 dark:text-emerald-450 font-sans">₹{purchase.price.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      )}
      {/* Edit Car Modal Overlay */}
      <AnimatePresence>
        {editingCar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-800/80 rounded-[35px] p-8 shadow-2xl relative"
            >
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-6 tracking-tight">Edit Vehicle Details</h2>
              <form onSubmit={handleUpdateCar} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Car Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-white/50 dark:bg-slate-955/40 border border-slate-200/80 dark:border-slate-800/60 rounded-xl px-4 py-3 outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold text-xs shadow-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Listing Type</label>
                    <select
                      value={editPurpose}
                      onChange={(e) => setEditPurpose(e.target.value)}
                      className="bg-white/50 dark:bg-slate-955/40 border border-slate-200/80 dark:border-slate-800/60 rounded-xl px-4 py-3 outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold text-xs shadow-sm cursor-pointer"
                    >
                      <option value="rent">For Rent</option>
                      <option value="sale">For Sale</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Price (₹)</label>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="bg-white/50 dark:bg-slate-955/40 border border-slate-200/80 dark:border-slate-800/60 rounded-xl px-4 py-3 outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold text-xs shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Image URL</label>
                  <input
                    type="text"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="bg-white/50 dark:bg-slate-955/40 border border-slate-200/80 dark:border-slate-800/60 rounded-xl px-4 py-3 outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold text-xs shadow-sm"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows="3"
                    className="bg-white/50 dark:bg-slate-955/40 border border-slate-200/80 dark:border-slate-800/60 rounded-xl p-4 outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 resize-none font-semibold text-xs shadow-sm"
                    required
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingCar(null)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingCar}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 hover:scale-[1.02] text-white rounded-xl font-bold text-xs cursor-pointer transition shadow-md shadow-orange-500/20 disabled:opacity-50"
                  >
                    {updatingCar ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;