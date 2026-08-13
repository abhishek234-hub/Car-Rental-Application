import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 pt-36 pb-32 overflow-hidden bg-[#FCFAF6] dark:bg-slate-950 transition-colors duration-300">
      
      {/* Peach/Orange curved background shape behind the car */}
      <div className="absolute right-[-120px] top-[10%] w-[600px] h-[550px] bg-[#FFEAE0]/70 dark:bg-orange-955/15 rounded-full filter blur-[60px] -z-10 pointer-events-none"></div>
      <div className="absolute left-[-200px] top-[20%] w-[450px] h-[450px] bg-orange-100/30 dark:bg-orange-955/5 rounded-full filter blur-[80px] -z-10 pointer-events-none"></div>

      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl z-10 space-y-6"
      >
        <h1 className="text-5xl md:text-6.5xl lg:text-7xl font-extrabold leading-[1.1] text-[#111827] dark:text-slate-50 tracking-tight font-sans">
          Find the Perfect <br />
          <span className="text-[#F97316]">Car</span> for Your Journey
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
          Explore from a wide range of vehicles and book your perfect car online.
        </p>
      </motion.div>

      {/* Right Side: White SUV */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="relative flex items-center justify-center mt-12 lg:mt-0 z-10 w-full lg:w-[48%]"
      >
        <img
          src="/premium_white_suv.jpg"
          alt="DriveGo Premium White SUV"
          className="w-full max-w-[560px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)] select-none"
        />
      </motion.div>

    </section>
  );
};

export default HeroSection;