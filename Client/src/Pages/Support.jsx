import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaWrench,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaTicketAlt,
  FaPaperPlane,
  FaSpinner,
  FaTimes,
  FaComments
} from "react-icons/fa";

const faqs = [
  {
    question: "What documents are required to rent a vehicle?",
    answer: "You need a valid driving license (uploadable during checkout) and a government-issued photo ID (Aadhar/Passport). Standard age limit is 21+ years."
  },
  {
    question: "How does the fuel policy work?",
    answer: "We follow a Full-to-Full fuel policy. We provide the car with a full tank, and we expect you to return it refueled. Otherwise, refuelling charges will apply."
  },
  {
    question: "Is there a security deposit involved?",
    answer: "Yes, a refundable security deposit of ₹5,000 is authorized during booking. This is refunded fully within 24-48 hours of vehicle return inspection."
  },
  {
    question: "What is your cancellation and refund policy?",
    answer: "Free cancellation (100% refund) is applicable if cancelled 24 hours prior to pickup time. Same-day cancellations qualify for a 50% refund. No refunds are made once the rental start time has elapsed."
  }
];

const Support = () => {
  const { user, token, API_URL } = useAuth();
  
  // State
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [category, setCategory] = useState("General Inquiry");
  const [description, setDescription] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Interactive Chat Simulator State
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hello! Welcome to RentX Live Support. How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);

  // Accordion active state
  const [activeFaq, setActiveFaq] = useState(null);

  // Fetch my tickets
  const fetchTickets = useCallback(async () => {
    if (!token) {
      setLoadingTickets(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/support/my`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  }, [token, API_URL]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTickets();
  }, [fetchTickets]);

  // Submit new ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Please login to submit support tickets.");
      return;
    }
    if (!description.trim()) {
      setError("Please describe your query/issue.");
      return;
    }

    setSubmittingTicket(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ category, description })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Support ticket raised successfully! Our team will respond shortly.");
        setDescription("");
        fetchTickets();
      } else {
        setError(data.message || "Failed to raise ticket.");
      }
    } catch (err) {
      console.error("Ticket submission error:", err);
      setError("Connection to server failed.");
    } finally {
      setSubmittingTicket(false);
    }
  };

  // Chat message send handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setBotTyping(true);

    // Mock bot response
    setTimeout(() => {
      let reply = "I understand you need assistance. One of our support representatives is being connected to you.";
      const query = userMsg.text.toLowerCase();
      
      if (query.includes("cancel") || query.includes("refund")) {
        reply = "To cancel your booking and track your refund status, please visit your User Dashboard and click 'Cancel Booking'.";
      } else if (query.includes("accident") || query.includes("emergency") || query.includes("breakdown")) {
        reply = "🚨 Emergency assistance request registered! Please stay safe near the vehicle. Call our emergency response desk directly at +91 99999-88888.";
      } else if (query.includes("towing") || query.includes("tire") || query.includes("puncture")) {
        reply = "🛠️ Roadside assistance request acknowledged. Please verify your GPS location so we can dispatch towing support to your coordinates.";
      } else if (query.includes("price") || query.includes("hidden") || query.includes("tax")) {
        reply = "Our pricing is 100% transparent. During checkout, we calculate daily rent, 18% GST, and Rs 250/day insurance. No hidden fees apply!";
      }

      setChatMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setBotTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/60 via-amber-50/40 via-orange-50/20 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:via-orange-950/20 dark:to-amber-955/20 text-slate-800 dark:text-slate-100 px-6 lg:px-20 pt-36 pb-20 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-300/20 dark:bg-amber-900/10 blur-[150px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-300/25 dark:bg-orange-900/10 blur-[150px] rounded-full pointer-events-none animate-float-delayed"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-16 relative z-10">
          <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
            RentX Support Hub
          </span>
          <h1 className="text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-2">
            Customer Support Center
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-md font-bold mt-3 max-w-2xl mx-auto">
            Get 24/7 roadside assistance, emergency support, resolve billing queries, or message our live assistants instantly.
          </p>
        </div>

        {/* Live Chat Floating Button */}
        <button
          onClick={() => setShowLiveChat(true)}
          className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white p-5 rounded-full shadow-lg shadow-orange-500/20 hover:scale-110 transition cursor-pointer flex items-center justify-center text-2xl"
          title="Open Live Chat"
        >
          <FaComments />
        </button>

        {/* Support Options Grid */}
        <div className="relative z-10 grid md:grid-cols-2 lg:grid-cols-4 gap-8 [perspective:1200px]">
          {/* Card 1: Phone Support */}
          <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-955/50 flex items-center justify-center text-orange-500 dark:text-orange-400 text-lg shadow-sm mb-4">
              <FaPhoneAlt />
            </div>
            <h2 className="text-lg font-black text-slate-855 dark:text-slate-100">Call Support</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-2">Talk to our customer service desk directly for instant queries.</p>
            <p className="text-orange-600 dark:text-orange-400 font-black text-sm mt-4">+91 99999-77777</p>
          </div>

          {/* Card 2: WhatsApp Chat */}
          <a
            href="https://wa.me/919999977777"
            target="_blank"
            rel="noreferrer"
            className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm hover:-translate-y-1.5 transition-all duration-300 block"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-500 dark:text-emerald-400 text-lg shadow-sm mb-4">
              <FaWhatsapp />
            </div>
            <h2 className="text-lg font-black text-slate-850 dark:text-slate-100">WhatsApp Support</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-2">Ping us on WhatsApp. Our bots and agents respond within seconds.</p>
            <p className="text-emerald-600 dark:text-emerald-400 font-black text-sm mt-4">Chat on WhatsApp</p>
          </a>

          {/* Card 3: Roadside Assistance */}
          <div
            onClick={() => {
              setCategory("Vehicle Issue");
              setDescription("Need Roadside Assistance: Please dispatch support to my location.");
              // Scroll to ticket form
              window.scrollTo({ top: 900, behavior: "smooth" });
            }}
            className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-955/50 flex items-center justify-center text-amber-500 dark:text-amber-400 text-lg shadow-sm mb-4">
              <FaWrench />
            </div>
            <h2 className="text-lg font-black text-slate-850 dark:text-slate-100">Roadside Support</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-2">Flat tire, battery jumpstart, towing, or mechanical issues on road.</p>
            <p className="text-amber-500 dark:text-amber-400 font-black text-xs uppercase tracking-wider mt-4">Request Assistance</p>
          </div>

          {/* Card 4: Emergency Desk */}
          <div className="bg-rose-50/30 dark:bg-rose-955/10 border border-rose-100/50 dark:border-rose-950/20 rounded-3xl p-6 shadow-sm hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-500 dark:text-rose-455 text-lg shadow-sm mb-4">
              <FaExclamationTriangle />
            </div>
            <h2 className="text-lg font-black text-slate-855 dark:text-rose-300">Emergency Support</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-2">24/7 helpline for accidents, vehicle security hazards, or break-ins.</p>
            <p className="text-rose-500 dark:text-rose-455 font-black text-sm mt-4">+91 99999-88888</p>
          </div>
        </div>

        {/* Ticket Submission & History Layout */}
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 mt-20">
          
          {/* Raise Support Ticket Form */}
          <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-[35px] p-8 shadow-sm backdrop-blur-md">
            <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
              <FaTicketAlt className="text-orange-500 text-xl" />
              Raise Support Ticket
            </h2>

            {error && (
              <div className="bg-rose-50 dark:bg-rose-955/30 border border-rose-250/50 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-2xl text-xs text-center font-bold mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-250/50 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-2xl text-xs text-center font-bold mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Ticket Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200/85 dark:border-slate-800/60 rounded-2xl px-5 py-3.5 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-955/50 text-slate-855 dark:text-slate-100 font-semibold text-sm shadow-sm cursor-pointer"
                >
                  <option value="General Inquiry" className="dark:bg-slate-900 dark:text-white">General Inquiry</option>
                  <option value="Billing & Refund" className="dark:bg-slate-900 dark:text-white">Billing & Refund</option>
                  <option value="Vehicle Issue" className="dark:bg-slate-900 dark:text-white">Vehicle Issue / Roadside Assist</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Describe Issue</label>
                <textarea
                  placeholder="Explain your problem clearly. Add booking ID, vehicle name, or coordinates if requesting towing..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200/85 dark:border-slate-800/60 rounded-2xl px-5 py-3.5 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-955/50 text-slate-855 dark:text-slate-100 resize-none font-semibold text-sm shadow-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingTicket || !user}
                className="px-8 py-3.5 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition text-white font-bold text-sm shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
              >
                {submittingTicket ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                {submittingTicket ? "Raising Ticket..." : "Submit Ticket"}
              </button>
            </form>
          </div>

          {/* Ticket History */}
          <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-[35px] p-8 shadow-sm backdrop-blur-md flex flex-col">
            <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-slate-50 tracking-tight">Your Support History</h2>

            {!user ? (
              <div className="flex-1 flex items-center justify-center text-center text-slate-500 font-bold">
                Please login to view raised tickets.
              </div>
            ) : loadingTickets ? (
              <p className="text-slate-550 dark:text-slate-400 font-bold animate-pulse text-center py-20">Loading tickets...</p>
            ) : tickets.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center text-slate-500 font-bold">
                No past tickets raised yet.
              </div>
            ) : (
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                {tickets.map((t) => (
                  <div key={t._id} className="bg-white/50 dark:bg-slate-955/30 border border-white/50 dark:border-slate-800/40 p-4 rounded-2xl">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider">{t.category}</span>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${
                        t.status === "Resolved"
                           ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-355 border-emerald-250/50"
                          : t.status === "In Progress"
                          ? "bg-amber-100 dark:bg-amber-955/40 text-amber-800 dark:text-amber-355 border-amber-250/50"
                          : "bg-orange-100 dark:bg-orange-950/40 text-orange-850 dark:text-orange-355 border-orange-250/50"
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-slate-655 dark:text-slate-300 text-xs font-semibold mt-3">{t.description}</p>
                    <p className="text-[10px] text-slate-400 mt-3 font-bold font-mono">Raised: {new Date(t.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* FAQs Section */}
        <div className="relative z-10 mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-8 text-slate-900 dark:text-slate-50 tracking-tight text-center flex items-center justify-center gap-2">
            <FaQuestionCircle className="text-orange-500" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-2xl overflow-hidden transition-all duration-305"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4.5 font-extrabold text-sm text-slate-850 dark:text-slate-100 flex justify-between items-center cursor-pointer outline-none"
                >
                  <span>{faq.question}</span>
                  <span className="text-orange-500 font-bold text-lg">{activeFaq === i ? "−" : "+"}</span>
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-5 pt-1 border-t border-slate-205/40 dark:border-slate-800/40 text-xs text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Live Chat Modal Simulator Overlay */}
      <AnimatePresence>
        {showLiveChat && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-8 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full sm:w-[400px] h-[550px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 px-6 py-4.5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg font-black uppercase text-orange-200">R</div>
                  <div>
                    <h3 className="font-extrabold text-sm leading-none">RentX Assistant</h3>
                    <span className="text-[10px] text-orange-200 font-bold">Online • Responds Instantly</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowLiveChat(false)}
                  className="text-white hover:text-orange-200 transition text-lg cursor-pointer outline-none"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4.5 bg-slate-50 dark:bg-slate-950/30">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs font-semibold ${
                      msg.sender === "user"
                        ? "bg-orange-600 text-white rounded-tr-none"
                        : "bg-white dark:bg-slate-850 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {botTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-850 border border-slate-205 dark:border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-400 font-bold animate-pulse shadow-sm">
                      RentX Assistant is typing...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-105 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-100 dark:bg-slate-955/50 border border-slate-200/50 dark:border-slate-800/80 rounded-xl px-4 py-3 outline-none focus:bg-white dark:focus:bg-slate-955 focus:border-orange-500 text-xs font-semibold text-slate-800 dark:text-slate-100"
                />
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center"
                >
                  <FaPaperPlane className="text-xs" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Support;
