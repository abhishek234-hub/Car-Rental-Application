import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50/60 via-amber-50/40 via-orange-50/20 to-orange-100/40 dark:from-slate-955 dark:via-slate-900 dark:via-orange-950/20 dark:to-amber-955/20 text-slate-800 dark:text-slate-100">

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-amber-300/20 dark:bg-amber-500/10 blur-[150px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-300/20 dark:bg-orange-500/10 blur-[150px] rounded-full pointer-events-none animate-float-delayed"></div>

      {/* Content */}
      <div className="relative z-10 px-6 lg:px-20 pt-36 pb-20">

        {/* Top Section */}
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
              About DriveGo
            </span>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight text-slate-900 dark:text-slate-50 tracking-tight mt-2">
              Reliable Rides <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Everyday Value
              </span>
            </h1>

            <p className="text-slate-655 dark:text-slate-350 text-lg leading-8 mt-6 font-semibold">
              DriveGo is dedicated to providing high-quality, fuel-efficient, and reliable everyday vehicles at rates that fit your budget. Whether it's a hatchback for city errands, a premium sedan for a business trip, or an SUV for a weekend getaway, we have you covered.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 mt-10">
              <Link to="/cars">
                <button className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-md cursor-pointer">
                  Explore Fleet
                </button>
              </Link>

              <Link to="/services">
                <button className="px-6 py-3.5 rounded-2xl border border-white/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-800/60 transition-all duration-300 font-bold cursor-pointer animate-float">
                  Our Services
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Right Stats */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="grid grid-cols-2 gap-8 [perspective:1000px]"
          >
            {[
              { num: "500+", label: "Economy Fleet", grad: "from-orange-400 to-orange-600" },
              { num: "10K+", label: "Happy Customers", grad: "from-orange-500 to-amber-550" },
              { num: "24/7", label: "Helpdesk Support", grad: "from-amber-500 to-orange-400" },
              { num: "100%", label: "Secure Bookings", grad: "from-emerald-500 to-teal-600" }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-[0_12px_28px_rgba(0,0,0,0.015)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.12)] hover:bg-white/70 dark:hover:bg-slate-800/65 [transform-style:preserve-3d] hover:[transform:rotateX(8deg)_rotateY(-8deg)_translateZ(10px)] hover:-translate-y-1 transition-all duration-500 ease-out cursor-pointer"
              >
                <h1 className={`text-4xl lg:text-5xl font-black bg-gradient-to-r ${stat.grad} bg-clip-text text-transparent [transform:translateZ(15px)]`}>
                  {stat.num}
                </h1>
                <p className="text-slate-655 dark:text-slate-400 mt-4 font-bold text-sm [transform:translateZ(12px)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default About;