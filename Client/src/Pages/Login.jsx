import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaFacebookF,
  FaUserCircle,
  FaChevronRight,
  FaTimes,
  FaUserAlt
} from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Google Sign-in simulator state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [useCustomAccount, setUseCustomAccount] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter all fields");
      return;
    }

    setError("");
    setSubmitting(true);

    const result = await login(email, password);

    setSubmitting(false);

    if (result.success) {
      if (result.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(result.message || "Invalid credentials. Please try again.");
    }
  };

  const handleGoogleSelect = async (selectedEmail, selectedName) => {
    setGoogleSubmitting(true);
    setError("");
    
    const result = await loginWithGoogle(
      selectedEmail,
      selectedName,
      `google_${Math.floor(100000 + Math.random() * 900000)}`
    );

    setGoogleSubmitting(false);

    if (result.success) {
      setShowGoogleModal(false);
      if (result.role === "admin" || selectedEmail.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(result.message || "Google Sign-in failed");
      setShowGoogleModal(false);
    }
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleName) return;
    handleGoogleSelect(customGoogleEmail, customGoogleName);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50/60 via-amber-50/40 via-orange-50/20 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:via-orange-950/20 dark:to-amber-955/20 text-slate-850 dark:text-slate-100 [perspective:1200px] transition-colors duration-300">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-amber-300/20 dark:bg-amber-900/10 blur-[120px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-300/25 dark:bg-orange-900/10 blur-[120px] rounded-full pointer-events-none animate-float-delayed"></div>

      {/* Login Box */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.015)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.15)] [transform-style:preserve-3d] hover:[transform:rotateX(4deg)_rotateY(-4deg)_translateZ(10px)] transition-all duration-500 ease-out cursor-pointer p-8 rounded-[35px]"
      >

        {/* Heading */}
        <div className="text-center [transform:translateZ(20px)]">
          <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
            Welcome Back
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-1">
            Sign In
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-semibold">
            Login to continue your car bookings
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5 [transform:translateZ(15px)]">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-955/30 border border-rose-250/50 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-2xl text-sm text-center font-bold">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm" />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/50 dark:bg-slate-955/55 border border-slate-200/85 dark:border-slate-800/85 rounded-2xl py-3.5 pl-14 pr-5 text-slate-850 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-955/50 font-semibold transition-all text-sm shadow-sm"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm" />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/50 dark:bg-slate-955/55 border border-slate-200/85 dark:border-slate-800/85 rounded-2xl py-3.5 pl-14 pr-5 text-slate-850 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-955/50 font-semibold transition-all text-sm shadow-sm"
              required
            />
          </div>

          {/* Remember */}
          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center gap-2 text-slate-650 dark:text-slate-400 font-bold cursor-pointer text-xs">
              <input type="checkbox" className="accent-orange-600 rounded" />
              Remember Me
            </label>

            <p className="text-orange-600 dark:text-orange-400 cursor-pointer hover:text-orange-800 dark:hover:text-orange-305 font-extrabold text-xs">
              Forgot Password?
            </p>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white hover:scale-105 hover:shadow-lg transition-all duration-300 font-bold shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6 [transform:translateZ(12px)]">
          <div className="flex-1 h-[1px] bg-slate-200/85 dark:bg-slate-800/80"></div>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest">
            OR CONTINUE WITH
          </p>
          <div className="flex-1 h-[1px] bg-slate-200/85 dark:bg-slate-800/80"></div>
        </div>

        {/* Social */}
        <div className="flex gap-4 [transform:translateZ(15px)]">
          <button
            type="button"
            onClick={() => {
              setUseCustomAccount(false);
              setShowGoogleModal(true);
            }}
            className="flex-1 py-3.5 rounded-2xl bg-white dark:bg-slate-950 hover:bg-slate-55 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all duration-300 flex items-center justify-center gap-2.5 font-bold text-xs shadow-sm cursor-pointer"
          >
            <FaGoogle className="text-red-500 text-sm animate-pulse" />
            Google
          </button>

          <button
            type="button"
            className="flex-1 py-3.5 rounded-2xl bg-white dark:bg-slate-955 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all duration-300 flex items-center justify-center gap-2.5 font-bold text-xs shadow-sm cursor-pointer"
          >
            <FaFacebookF className="text-blue-600 text-sm" />
            Facebook
          </button>
        </div>

        {/* Register */}
        <p className="text-center text-slate-500 dark:text-slate-400 mt-8 text-sm font-semibold [transform:translateZ(12px)]">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-orange-600 dark:text-orange-400 hover:text-orange-805 dark:hover:text-orange-305 font-black"
          >
            Register
          </Link>
        </p>

      </motion.div>

      {/* Realistic Google Accounts Selector Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-7 shadow-2xl border border-slate-150 dark:border-slate-800 text-slate-800 dark:text-slate-100 relative"
            >
              {/* Close */}
              <button
                onClick={() => setShowGoogleModal(false)}
                className="absolute top-5 right-5 text-slate-400 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-350 cursor-pointer"
              >
                <FaTimes />
              </button>

              {/* Google Brand Logo */}
              <div className="flex justify-center mb-4">
                <svg className="h-7" viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-center text-slate-800 dark:text-slate-100">Sign in with Google</h2>
              <p className="text-center text-xs text-slate-455 dark:text-slate-400 mt-1.5 font-semibold">to continue to <span className="font-bold text-slate-700 dark:text-slate-200">RentX</span></p>              {googleSubmitting ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-bold">Connecting secure session...</p>
                </div>
              ) : (
                /* Custom email input form by default */
                <form onSubmit={handleCustomGoogleSubmit} className="mt-8 space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="Google Account Name"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-202 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 font-bold text-sm shadow-sm"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Email address</label>
                    <input
                      type="email"
                      placeholder="your.email@gmail.com"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-202 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 font-bold text-sm shadow-sm"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowGoogleModal(false)}
                      className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950/40"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold cursor-pointer shadow-md shadow-orange-500/20"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              )}

              <p className="text-[9px] text-slate-400 dark:text-slate-500 text-center mt-8 font-semibold leading-relaxed">
                To continue, Google will share your name, email address, language preference, and profile picture with RentX.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Login;