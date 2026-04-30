import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import { useLocation } from "react-router";
import Receipt from "./Reciept";
import { usePDF } from "react-to-pdf";
import { Bell, Download, Home, MapPin } from "lucide-react";

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  const { state } = useLocation();
  const bookingid = state?.bookingid;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { toPDF, targetRef } = usePDF({
    filename: `Care24-Receipt-${state?.bookingId}.pdf`,
  });

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const fadeUp = animate
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-6";

  return (
    <div className="min-h-screen bg-[#f0f4f1] font-sans">
      <style>{`
    @keyframes popIn {
      0% { transform: scale(0) rotate(-10deg); opacity: 0; }
      70% { transform: scale(1.15) rotate(3deg); }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes checkDraw {
      from { stroke-dashoffset: 60; }
      to { stroke-dashoffset: 0; }
    }
    .check-circle { animation: popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }
    .check-path {
      stroke-dasharray: 60;
      stroke-dashoffset: 60;
      animation: checkDraw 0.5s ease 0.7s forwards;
    }
  `}</style>

      <Navbar />

      <div className="max-w-5xl mt-17 mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col items-center text-center">
          <div className="check-circle w-24 h-24 rounded-full bg-gradient-to-br from-[#1a7a4a] to-[#2baf8e] flex items-center justify-center shadow-lg mb-5">
            <svg width="46" height="46" viewBox="0 0 52 52" fill="none">
              <path
                className="check-path"
                d="M10 26l12 12 20-20"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className={`transition-all duration-500 delay-300 ${fadeUp}`}>
            <h1 className="text-3xl font-bold text-[#1a3a1a] mb-2">
              Payment Successful!
            </h1>
            <p className="text-sm text-[#7a9a80] mb-5 leading-relaxed">
              Your booking is confirmed.
              <br />` {state?.caregiverName} will contact you shortly.
            </p>
          </div>

          <div
            className={`transition-all duration-500 delay-[400ms] ${fadeUp} bg-white border border-dashed border-[#9ec9b0] rounded-xl px-5 py-3 flex items-center gap-3 mb-4`}
          >
            <span className="text-xs text-gray-400">Booking ID</span>
            <span className="text-sm font-bold text-[#1a7a4a] tracking-wide">
              {state?.bookingId}
            </span>
          </div>

          <div
            className={`transition-all duration-500 delay-500 ${fadeUp} bg-[#fff8f0] border border-[#f5d5b0] rounded-xl p-4 flex items-center gap-3 mb-6 text-left w-full max-w-sm`}
          >
            <Bell className="w-5 h-5 text-[#a05a20]" />{" "}
            <p className="text-xs text-[#a05a20] leading-relaxed">
              Caregiver will contact you at least <strong>30 mins</strong>{" "}
              before the appointment.
            </p>
          </div>

          <div
            className={`transition-all duration-500 delay-[600ms] ${fadeUp} flex gap-3 w-full max-w-sm`}
          >
            <button
              onClick={toPDF}
              className="flex-1 cursor-pointer active:scale-95 bg-white text-[#1a7a4a] border border-[#1a7a4a] py-3 rounded-xl text-sm font-semibold hover:bg-[#f0faf3] transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Receipt
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 cursor-pointer active:scale-95 bg-gradient-to-br from-[#1a7a4a] to-[#2baf8e] text-white py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" /> Dashboard
            </button>
          </div>
        </div>

        <div
          className={`transition-all -mt-4 duration-500 delay-[350ms] ${fadeUp} bg-white rounded-2xl border border-[#e0ebe2] shadow-md overflow-hidden`}
        >
          <div className="bg-gradient-to-br from-[#1a7a4a] to-[#2baf8e] p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white/20 border border-white/30 overflow-hidden">
                <img
                  src={
                    state?.caregiverImage?.startsWith("http")
                      ? state?.caregiverImage
                      : `https://care24-backend.onrender.com${state?.caregiverImage}`
                  }
                  alt="Caregiver"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {state?.caregiverName}
                </p>
                <p className="text-xs text-white/75 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {state?.caregiverLocation} •{" "}
                  {state?.caregiverExperience} yrs exp
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-end">
              {state?.caregiverTags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/20 text-white text-xs px-3 py-0.5 rounded-full border border-white/25"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2">
              Booking Details
            </p>
            {[
              { k: "Service", v: state?.service },
              { k: "Date", v: state?.date },
              { k: "Patient", v: state?.patientName },
              { k: "Duration", v: state?.duration },
            ].map(({ k, v }) => (
              <div
                key={k}
                className="flex justify-between py-2 border-b border-gray-100 text-sm"
              >
                <span className="text-gray-400">{k}</span>
                <span className="font-semibold text-[#1a3a1a]">{v}</span>
              </div>
            ))}

            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-4 mb-2">
              Payment Details
            </p>
            {[
              { k: "Method", v: state?.method },
              { k: "Transaction ID", v: state?.transactionId },
            ].map(({ k, v }) => (
              <div
                key={k}
                className="flex justify-between py-2 border-b border-gray-100 text-sm"
              >
                <span className="text-gray-400">{k}</span>
                <span className="font-semibold text-[#1a3a1a]">{v}</span>
              </div>
            ))}

            <div className="flex justify-between items-center mt-3 pt-3 border-t-2 border-[#e8f0e9]">
              <span className="text-sm font-bold text-[#1a3a1a]">
                Total Paid
              </span>
              <span className="text-2xl font-bold text-[#1a7a4a]">
                ₹{state?.totalAmount}
              </span>
            </div>

            <div className="mt-3 bg-[#f0faf3] border border-[#c3e6ce] rounded-lg px-3 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#1a7a4a] ring-2 ring-[#1a7a4a]/20" />
              <span className="text-xs font-semibold text-[#1a7a4a]">
                Payment Verified & Booking Confirmed
              </span>
            </div>
          </div>
        </div>
      </div>
      <Receipt state={state} receiptRef={targetRef} />
    </div>
  );
};

export default PaymentConfirmation;
