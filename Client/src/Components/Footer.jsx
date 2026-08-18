import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-white/20 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 border-t border-white/60 dark:border-slate-800/60 overflow-hidden backdrop-blur-md">

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-amber-400/10 dark:bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-orange-400/15 dark:bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-20 pt-24 pb-10">

        {/* Main Grid */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-16 lg:gap-24">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-orange-500/20">
                D
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                Drive<span className="text-orange-500">Go</span>
              </h1>
            </div>

            <p className="text-slate-650 dark:text-slate-350 mt-8 leading-8 font-semibold">
              Premium startup car rental platform designed for modern driving experience, ultimate convenience, and affordable everyday travel.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-8">
              <div className="w-11 h-11 rounded-xl bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-500 hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer border border-white dark:border-slate-800/60">
                <FaFacebookF />
              </div>

              <div className="w-11 h-11 rounded-xl bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-500 hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer border border-white dark:border-slate-800/60">
                <FaInstagram />
              </div>

              <div className="w-11 h-11 rounded-xl bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-500 hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer border border-white dark:border-slate-800/60">
                <FaTwitter />
              </div>

              <div className="w-11 h-11 rounded-xl bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 cursor-pointer border border-white dark:border-slate-800/60">
                <FaYoutube />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:ml-10">
            <h1 className="text-xl font-bold mb-8 text-slate-900 dark:text-slate-100">
              Quick Links
            </h1>

            <div className="flex flex-col gap-5">
              <Link
                to="/"
                className="text-slate-655 dark:text-slate-350 hover:text-orange-600 dark:hover:text-orange-400 hover:translate-x-2 transition-all duration-300 font-bold"
              >
                Home
              </Link>

              <Link
                to="/cars"
                className="text-slate-655 dark:text-slate-350 hover:text-orange-600 dark:hover:text-orange-400 hover:translate-x-2 transition-all duration-300 font-bold"
              >
                Explore Cars
              </Link>

              <Link
                to="/booking"
                className="text-slate-655 dark:text-slate-350 hover:text-orange-600 dark:hover:text-orange-400 hover:translate-x-2 transition-all duration-300 font-bold"
              >
                Booking
              </Link>

              <Link
                to="/about"
                className="text-slate-655 dark:text-slate-350 hover:text-orange-600 dark:hover:text-orange-400 hover:translate-x-2 transition-all duration-300 font-bold"
              >
                About
              </Link>

              <Link
                to="/contact"
                className="text-slate-655 dark:text-slate-350 hover:text-orange-600 dark:hover:text-orange-400 hover:translate-x-2 transition-all duration-300 font-bold"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="lg:ml-10">
            <h1 className="text-xl font-bold mb-8 text-slate-900 dark:text-slate-100">
              Services
            </h1>

            <div className="flex flex-col gap-5 text-slate-650 dark:text-slate-350 font-bold">
              <p className="hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 cursor-pointer">
                Everyday Commute
              </p>

              <p className="hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 cursor-pointer">
                Instant Booking
              </p>

              <p className="hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 cursor-pointer">
                Flexible Rentals
              </p>

              <p className="hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 cursor-pointer">
                24/7 Support
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:ml-10">
            <h1 className="text-xl font-bold mb-8 text-slate-900 dark:text-slate-100">
              Contact Info
            </h1>

            <div className="flex flex-col gap-6">

              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-955/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold border border-orange-200/50 dark:border-orange-900/50">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Location
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    Bhopal, India
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-955/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold border border-orange-200/50 dark:border-orange-900/50">
                  <FaEnvelope />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Email
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    support@drivego.com
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200/50 dark:border-emerald-900/50">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Phone
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    +91 9876543210
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/60 dark:border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-5">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
            © 2026 DriveGo. All Rights Reserved.
          </p>

          <div className="flex gap-8 text-slate-500 dark:text-slate-400 text-sm font-semibold">
            <p className="hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-all duration-300">
              Privacy Policy
            </p>
            <p className="hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-all duration-300">
              Terms & Conditions
            </p>
            <p className="hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-all duration-300">
              Cookies
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;