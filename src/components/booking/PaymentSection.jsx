import { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  Smartphone,
  CreditCard,
  Building2,
  CheckCircle,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";

const PaymentSection = ({}) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const navigate = useNavigate();

  const [selected, setSelected] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const IMAGE_BASE = " https://care24-backend.onrender.com";

  const genbookingid = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const uid = uuidv4().split("-")[0].toUpperCase();
    return `CR24-${date}-${uid}`;
  };

  const handlePay = async () => {
    const { data } = await axios.post("/api/payment/create-order", {
      amount: 500,
    });
    const order = data.order;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Care24",
      description: "Home Care Services",
      order_id: order.id,
      redirect: false,
      theme: {
        color: "#2baf8e",
      },
      handler: async function (response) {
        const { data } = await axios.post("/api/payment/verify-payment", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          userId: bookingdata.userId,
          caregiverId: bookingdata.caregiverId,
          patientAge: bookingdata.patientAge,
          patientGender: bookingdata.patientGender,
          address: bookingdata.address,
          notes: bookingdata.notes,
          toEmail: bookingdata.email,
          patientName: bookingdata.patient,
          caregiverExperience: bookingdata.experience,
          caregiverRating: bookingdata.caregiverRating,
          caregiverReviews: bookingdata.caregiverReviews,
          caregiverAvailable: bookingdata.caregiverAvailable,
          caregiverName: bookingdata.caregiver,
          service: bookingdata.service,
          date: bookingdata.date,
          startTime: bookingdata.startTime,
          duration: bookingdata.duration,
          totalAmount: bookingdata.amount,
          bookingId: genbookingid(),
          method: paymentMethods.find((m) => m.id === selected)?.label,
          transactionId: response.razorpay_payment_id,
        });
        if (data.success) {
          navigate("/payment-confirmation", {
            state: {
              caregiverName: bookingdata.caregiver,
              caregiverEmail: bookingdata.caregiverEmail,
              caregiverLocation: bookingdata.city,
              caregiverExperience: bookingdata.experience,
              caregiverTags: bookingdata.specializations,
              caregiverImage: bookingdata.image,
              caregiverRating: bookingdata.caregiverRating,
              caregiverReviews: bookingdata.caregiverReviews,
              caregiverAvailable: bookingdata.caregiverAvailable,
              bookingId: genbookingid(),
              service: bookingdata.service,
              date: bookingdata.date,
              patientName: bookingdata.patient,
              duration: bookingdata.duration,

              method: paymentMethods.find((m) => m.id === selected)?.label,
              transactionId: response.razorpay_payment_id,
              totalAmount: bookingdata.amount,
            },
          });
        } else {
          alert("Payment Failed ❌");
        }
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const paymentMethods = [
    {
      id: "upi",
      label: "UPI",
      icon: <Smartphone className="w-5 h-5 text-gray-600" />,
    },
    {
      id: "card",
      label: "Credit / Debit Card",
      icon: <CreditCard className="w-5 h-5 text-gray-600" />,
    },
    {
      id: "netbanking",
      label: "Net Banking",
      icon: <Building2 className="w-5 h-5 text-gray-600" />,
    },
  ];

  const location = useLocation();
  const bookingdata = location.state || {};

  return (
    <div className="min-h-screen bg-[#f0f7f5] font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-13 px-4 py-8">
        <button
          onClick={() => navigate("/caregivers")}
          className="flex cursor-pointer items-center gap-1 text-lg text-gray-500 mb-6 hover:text-gray-700 transition-colors"
        >
          <span>‹</span> Back to Caregivers
        </button>

        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          style={{ animation: "fadeUp 0.4s ease forwards" }}
        >
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Complete <span className="text-[#e05c2e]">Payment</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Choose your preferred payment method
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Payment Method
              </p>
              {paymentMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  className={`w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left ${
                    selected === m.id
                      ? "border-[#2baf8e] bg-[#f0faf7]"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span
                    className={`text-sm font-medium ${selected === m.id ? "text-[#2baf8e]" : "text-gray-700"}`}
                  >
                    {m.label}
                  </span>
                  {selected === m.id && (
                    <span className="ml-auto w-4 h-4 rounded-full bg-[#2baf8e] flex items-center justify-center text-white text-xs">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 -mt-2 sm:-mt-11">
            <div className="bg-gradient-to-br from-[#2baf8e] to-[#1a8a6e] rounded-2xl p-5 text-white shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-white/20 border-2 border-white-100 flex items-center justify-center text-xl">
                  <img
                    src={
                      bookingdata.image?.startsWith("http")
                        ? bookingdata.image
                        : `${IMAGE_BASE}${bookingdata.image}`
                    }
                    alt={bookingdata?.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {bookingdata.caregiver}
                  </p>
                  <p className="text-xs text-white/70">
                    Mumbai • 2 yrs experience
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-white/20 rounded-full px-3 py-1">
                  Nursing
                </span>
                <span className="text-xs bg-white/20 rounded-full px-3 py-1">
                  Elderly Care
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Booking Summary
              </p>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Service</span>
                  <span className="font-medium text-gray-800">
                    {bookingdata.service}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span className="font-medium text-gray-800">
                    {bookingdata.date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Patient</span>
                  <span className="font-medium text-gray-800">
                    {bookingdata.patient}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span className="font-medium text-gray-800">
                    {bookingdata.duration}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment method</span>
                  <span className="font-medium text-gray-800">
                    {paymentMethods.find((m) => m.id === selected)?.label ||
                      "N/A"}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span className="text-[#2baf8e] text-base">
                    ₹{bookingdata.amount}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full cursor-pointer bg-[#2baf8e] hover:bg-[#239c7d] active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
            >
              {paying ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                `Pay ₹${bookingdata.amount.toFixed(2)}`
              )}
            </button>

            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Secured by 256-bit SSL
              encryption
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PaymentSection;
