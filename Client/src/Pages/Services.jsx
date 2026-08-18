import {
  FaCar,
  FaShieldAlt,
  FaClock,
  FaHeadset,
  FaMoneyBillWave,
  FaMapMarkedAlt,
} from "react-icons/fa";

const services = [
  {
    icon: <FaCar className="text-orange-500" />,
    title: "Verified Fleet",
    desc: "Drive fully-maintained everyday hatchbacks, sedans, and SUVs with absolute comfort.",
  },
  {
    icon: <FaShieldAlt className="text-orange-500" />,
    title: "Full Insurance",
    desc: "All cars come with comprehensive insurance for a secure and worry-free ride.",
  },
  {
    icon: <FaClock className="text-amber-500" />,
    title: "24/7 Availability",
    desc: "Book your budget car anytime using our quick and easy online rental portal.",
  },
  {
    icon: <FaHeadset className="text-teal-500" />,
    title: "Customer Support",
    desc: "Dedicated support team available 24/7 to assist with your bookings and road help.",
  },
  {
    icon: <FaMoneyBillWave className="text-orange-500" />,
    title: "Affordable Pricing",
    desc: "Get quality cars at budget-friendly, transparent rates with zero hidden charges.",
  },
  {
    icon: <FaMapMarkedAlt className="text-rose-500" />,
    title: "Multiple Locations",
    desc: "Convenient pickups and drops across multiple hubs for complete travel flexibility.",
  },
];

const Services = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50/60 via-amber-50/40 via-orange-50/20 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:via-orange-950/20 dark:to-amber-950/20 text-slate-800 dark:text-slate-100 overflow-hidden px-6 lg:px-20 pt-36 pb-20">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-amber-300/20 dark:bg-amber-500/10 blur-[130px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-orange-300/20 dark:bg-orange-500/10 blur-[130px] rounded-full pointer-events-none animate-float-delayed"></div>

      {/* Heading */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
          Our Services
        </span>

        <h1 className="text-5xl lg:text-6xl font-black leading-tight text-slate-900 dark:text-slate-50 tracking-tight mt-2">
          Services Designed <br />
          <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            For Your Everyday Journeys
          </span>
        </h1>

        <p className="text-slate-655 dark:text-slate-355 mt-6 text-lg font-bold">
          Experience comfort, efficiency, and affordable service options with the RentX car rental platform.
        </p>
      </div>

      {/* Services Grid */}
      <div className="relative z-10 grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-24 [perspective:1000px]">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 shadow-[0_15px_30px_rgba(0,0,0,0.015)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_45px_rgba(249,115,22,0.12)] hover:bg-white/70 dark:hover:bg-slate-800/65 rounded-[35px] p-10 [transform-style:preserve-3d] hover:[transform:rotateX(6deg)_rotateY(-6deg)_translateZ(15px)] hover:-translate-y-3 transition-all duration-500 ease-out cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-850 flex items-center justify-center text-2xl shadow-md border border-slate-100/55 dark:border-slate-800/50 [transform:translateZ(25px)] animate-float">
                {service.icon}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-black mt-8 text-slate-900 dark:text-slate-50 tracking-tight [transform:translateZ(20px)]">
                {service.title}
              </h1>

              {/* Description */}
              <p className="text-slate-500 dark:text-slate-400 leading-8 mt-4 font-semibold [transform:translateZ(15px)] text-sm">
                {service.desc}
              </p>
            </div>

            {/* Button */}
            <div className="[transform:translateZ(20px)] mt-8 pt-4 border-t border-white/50 dark:border-slate-800/50">
              <button className="px-5 py-2.5 rounded-xl border border-white/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 hover:bg-white/70 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-bold text-sm shadow-sm transition-all duration-300 cursor-pointer">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Services;