import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Contact = () => {
  const { user, API_URL } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill name and email if user is logged in
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.name || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setMessage("");
      } else {
        setError(data.message || "Failed to submit inquiry.");
      }
    } catch (err) {
      console.error("Contact submit error:", err);
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/60 via-amber-50/40 via-orange-50/20 to-orange-100/40 dark:from-slate-955 dark:via-slate-900 dark:via-orange-950/20 dark:to-amber-955/20 flex items-center justify-center px-6 pt-36 pb-20 text-slate-800 dark:text-slate-100 [perspective:1200px] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-amber-300/20 dark:bg-amber-500/10 blur-[120px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-300/25 dark:bg-orange-500/10 blur-[120px] rounded-full pointer-events-none animate-float-delayed"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 backdrop-blur-xl rounded-[35px] p-10 shadow-[0_15px_35px_rgba(0,0,0,0.015)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_45px_rgba(249,115,22,0.12)] hover:bg-white/70 dark:hover:bg-slate-800/65 [transform-style:preserve-3d] hover:[transform:rotateX(4deg)_rotateY(-4deg)_translateZ(15px)] transition-all duration-500 ease-out cursor-pointer relative z-10"
      >
        <div className="text-center mb-8 [transform:translateZ(20px)]">
          <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
            Get in Touch
          </span>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-1">
            Contact Support
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mt-2">
            Ask questions, leave feedback, or inquire about custom plans
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 [transform:translateZ(15px)]">
          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-250/50 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-355 px-4 py-3.5 rounded-2xl text-sm font-semibold flex items-center gap-2 justify-center shadow-sm">
              <FaCheckCircle className="text-emerald-500 text-base" />
              Your message was sent! Check your inbox for confirmation.
            </div>
          )}

          {error && (
            <div className="bg-rose-50 dark:bg-rose-955/30 border border-rose-250/50 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 px-4 py-3.5 rounded-2xl text-sm font-semibold flex items-center gap-2 justify-center shadow-sm">
              <FaExclamationCircle className="text-rose-500 text-base" />
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/60 text-slate-855 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-955/50 font-semibold transition-all text-sm shadow-sm"
            required
            disabled={loading}
          />

          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/60 text-slate-855 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-955/50 font-semibold transition-all text-sm shadow-sm"
            required
            disabled={loading}
          />

          <textarea
            rows="5"
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/60 text-slate-855 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-955/50 font-semibold resize-none transition-all text-sm shadow-sm"
            required
            disabled={loading}
          ></textarea>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane className={loading ? "animate-pulse" : ""} />
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;