import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaSun, FaMoon, FaUserCircle, FaCalendarCheck, FaCar, FaTimesCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, theme, toggleTheme } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Explore Cars", path: "/cars" },
    { name: "Buy Cars", path: "/buy" },
    { name: "Booking", path: "/booking" },
    { name: "Support", path: "/support" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  if (user) {
    // Add Dashboard path based on user role dynamically
    navLinks.push({
      name: "Dashboard",
      path: user.role === "admin" ? "/admin" : "/dashboard",
    });
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border-b border-white/60 dark:border-slate-900/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/20">
              D
            </div>

            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              Drive<span className="text-orange-500">Go</span>
            </h1>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -1 }}
                className="relative group"
              >
                <Link
                  to={link.path}
                  className="text-slate-750 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-305 text-[16px] font-semibold"
                >
                  {link.name}
                </Link>

                <span className="absolute left-0 -bottom-1.5 w-0 h-[2.5px] bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </motion.div>
            ))}
          </div>

          {/* Right Buttons (Glass style) */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center shadow-sm transition-all duration-300 cursor-pointer"
              title="Toggle Day/Night Mode"
            >
              {theme === "dark" ? (
                <FaSun className="text-amber-500 animate-spin-slow text-lg" />
              ) : (
                <FaMoon className="text-orange-600 text-lg" />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-orange-600 dark:text-orange-400 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center justify-center shadow-sm transition-all duration-300 cursor-pointer relative"
                  title="Your Account"
                >
                  <FaUserCircle className="text-xl" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      {/* Click outside overlay */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setDropdownOpen(false)}
                      ></div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2.5 w-48 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-2 shadow-xl z-50 text-xs font-bold text-slate-700 dark:text-slate-350"
                      >
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-900 mb-1.5 text-left">
                          <p className="text-[9px] text-slate-450 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                          <p className="text-xs text-slate-900 dark:text-slate-100 font-extrabold truncate">{user.name}</p>
                        </div>

                        <Link
                          to={user.role === "admin" ? "/admin" : "/dashboard"}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 hover:bg-orange-500 hover:text-white rounded-xl transition-all text-left"
                        >
                          <FaCalendarCheck className="text-sm" />
                          My Bookings
                        </Link>

                        <Link
                          to={user.role === "admin" ? "/admin" : "/dashboard"}
                          onClick={() => {
                            setDropdownOpen(false);
                            setTimeout(() => {
                              const el = document.getElementById("purchases-section");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }, 300);
                          }}
                          className="flex items-center gap-2 px-3 py-2.5 hover:bg-orange-500 hover:text-white rounded-xl transition-all text-left"
                        >
                          <FaCar className="text-sm" />
                          My Purchased Cars
                        </Link>

                        <div className="h-[1px] bg-slate-100 dark:bg-slate-900 my-1.5"></div>

                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all cursor-pointer font-bold"
                        >
                          <FaTimesCircle className="text-sm" />
                          Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-5 py-2.5 rounded-xl border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 text-sm font-bold shadow-sm cursor-pointer">
                    Login
                  </button>
                </Link>

                <Link to="/register">
                  <button className="px-5 py-2.5 rounded-xl border border-orange-200/50 dark:border-slate-800 bg-orange-50 dark:bg-slate-900 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-slate-800 transition-all duration-300 text-sm font-bold shadow-sm cursor-pointer">
                    Sign Up
                  </button>
                </Link>
              </>
            )}

            <Link to="/cars">
              <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md shadow-orange-500/20 hover:scale-105 hover:shadow-lg transition-all duration-300 text-sm font-bold cursor-pointer">
                Book Now
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Theme Toggle Button for Mobile */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl border border-slate-205 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-700 dark:text-slate-350 flex items-center justify-center shadow-sm cursor-pointer"
            >
              {theme === "dark" ? (
                <FaSun className="text-amber-500 text-lg" />
              ) : (
                <FaMoon className="text-orange-600 text-lg" />
              )}
            </button>
            
            <button
              className="text-slate-800 dark:text-slate-100 text-3xl cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-900"
        >
          <div className="flex flex-col px-6 py-6 gap-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="text-slate-800 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 text-[17px] font-bold"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="text-slate-800 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 text-[17px] font-bold"
                  onClick={() => setMenuOpen(false)}
                >
                  My Bookings
                </Link>
                
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="text-slate-800 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 text-[17px] font-bold"
                  onClick={() => {
                    setMenuOpen(false);
                    setTimeout(() => {
                      const el = document.getElementById("purchases-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }, 300);
                  }}
                >
                  My Purchased Cars
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="mt-2 w-full py-3 rounded-xl border border-red-205 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-bold cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3 mt-2">
                <Link to="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                  <button className="w-full py-3 rounded-xl border border-white dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 font-bold text-center">
                    Login
                  </button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setMenuOpen(false)}>
                  <button className="w-full py-3 rounded-xl bg-orange-50 dark:bg-slate-900 text-orange-600 dark:text-orange-300 font-bold text-center">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}

            <Link to="/cars" className="w-full" onClick={() => setMenuOpen(false)}>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/20">
                Book Now
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;