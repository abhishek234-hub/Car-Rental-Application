import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/60 via-amber-50/40 via-orange-50/20 to-orange-100/40 flex items-center justify-center px-6 pt-20">

      <div className="max-w-lg w-full bg-white/40 backdrop-blur-xl rounded-[40px] p-12 border border-white/60 text-center shadow-[0_15px_35px_rgba(0,0,0,0.015)]">

        <FaCheckCircle className="text-8xl text-emerald-500 mx-auto drop-shadow-md animate-bounce" />

        <h1 className="text-4xl font-black text-slate-900 mt-8">
          Payment Success
        </h1>

        <p className="text-slate-650 mt-6 leading-8 font-semibold">
          Your payment has been completed successfully. Your car booking is now pending admin approval.
        </p>

        <Link to="/dashboard">
          <button className="mt-10 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-md shadow-emerald-500/20 hover:scale-105 transition-all duration-300 cursor-pointer">
            Go To Dashboard
          </button>
        </Link>

      </div>

    </div>
  );
};

export default PaymentSuccess;