import { motion } from "framer-motion";
import { FaCarSide } from "react-icons/fa";

const SplashLoader = ({ onComplete }) => {
  // Exhaust smoke puffs count
  const smokePuffs = Array.from({ length: 6 });

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 3.5, duration: 0.5 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* Main Animation Container */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-lg h-60">
        
        {/* Exhaust Smoke Puffs (Relative to Center, trailing to the right) */}
        <div className="absolute flex items-center justify-center z-0" style={{ transform: "translate(40px, 12px)" }}>
          {smokePuffs.map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.6, 0.8, 0],
                scale: [0.3, 1.2, 2.2, 3.5],
                x: [0, 60 + i * 20], // Drifts to the right
                y: [0, -10 - (i % 2) * 8],
              }}
              transition={{
                delay: 0.8 + i * 0.15,
                duration: 1.2,
                repeat: 2,
                ease: "easeOut"
              }}
              className="absolute w-4 h-4 rounded-full bg-slate-655/20 blur-[2px] dark:bg-slate-400/10"
            />
          ))}
        </div>

        {/* Animated Car Wrapper (Translates horizontally across the screen from Left to Right) */}
        <motion.div
          initial={{ x: "-120vw" }}
          animate={{
            x: ["-120vw", "0vw", "0vw", "120vw"]
          }}
          transition={{
            times: [0, 0.3, 0.75, 1],
            duration: 3.5,
            ease: "easeInOut"
          }}
          className="relative z-10 text-orange-500 dark:text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]"
        >
          {/* Inner Graphic Container (Normal orientation facing left) */}
          <div className="relative inline-block">
            <FaCarSide className="text-7xl" />
            
            {/* Wheel Spinning Effect */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-[9px] bottom-[2px] w-[14px] h-[14px] rounded-full border-2 border-dashed border-slate-700 bg-slate-900"
            />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              className="absolute right-[11px] bottom-[2px] w-[14px] h-[14px] rounded-full border-2 border-dashed border-slate-700 bg-slate-900"
            />
          </div>
        </motion.div>

        {/* Text Container: Scales up larger ("bada hote hue") as it disappears ("gaayab ho jaye") */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1.15, 2.8]
          }}
          transition={{
            times: [0, 0.25, 0.8, 1],
            delay: 0.8,
            duration: 2.5,
            ease: "easeInOut"
          }}
          className="absolute bottom-4 flex flex-col items-center justify-center pointer-events-none"
        >
          {/* Brand Name */}
          <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent tracking-widest uppercase drop-shadow-[0_5px_15px_rgba(249,115,22,0.2)]">
            DriveGo
          </h1>

          {/* Subtitle */}
          <p className="text-xs font-bold text-slate-450 uppercase tracking-[0.4em] mt-2 pl-[0.4em]">
            Car Rental
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default SplashLoader;
