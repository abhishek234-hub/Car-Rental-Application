import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailed = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/60 via-amber-50/40 via-orange-50/20 to-orange-100/40 flex items-center justify-center px-6 pt-20">

      <div className="max-w-lg w-full bg-white/40 backdrop-blur-xl rounded-[40px] p-12 border border-white/60 text-center shadow-[0_15px_35px_rgba(0,0,0,0.015)]">

        <FaTimesCircle className="text-8xl text-rose-500 mx-auto drop-shadow-md animate-bounce" />

        <h1 className="text-4xl font-black text-slate-900 mt-8">
          Payment Failed
        </h1>

        <p className="text-slate-650 mt-6 leading-8 font-semibold">
          Something went wrong while processing your payment. Please try again or contact support.
        </p>

        <Link to="/booking">
          <button className="mt-10 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-md shadow-rose-500/20 hover:scale-105 transition-all duration-300 cursor-pointer">
            Try Again
          </button>
        </Link>

      </div>

    </div>
  );
};

export default PaymentFailed;