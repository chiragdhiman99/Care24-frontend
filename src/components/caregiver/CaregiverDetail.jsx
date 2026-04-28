import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getCaregiverbyId } from "../../services/CaregiverService";
import Navbar from "../common/Navbar";
import { Star, Zap } from "lucide-react";

import {
  IMAGE_BASE,
  formatSpec,
  getInitials,
  maskNumber,
  AboutTab,
  ReviewsTab,
  AvailabilityTab,
} from "./CaregiverDetailHelpers";

const CaregiverDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    getCaregiverbyId(id)
      .then((data) => setCaregiver(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading caregiver...</p>
        </div>
      </div>
    );
  }
  if (!caregiver) return null;

  const number = maskNumber(caregiver?.phone);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/caregivers")}
            className="flex cursor-pointer items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to caregivers
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4"
          >
            <div className="h-28 bg-gradient-to-r from-teal-700 via-teal-500 to-teal-400 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 mb-5">
                <div className="flex items-end gap-4">
                  <div className="w-28 h-28 rounded-2xl z-10 border-4 border-white overflow-hidden bg-teal-50 flex-shrink-0 shadow-md">
                    {!imgError && caregiver.image ? (
                      <img
                        src={
                          caregiver.image?.startsWith("http")
                            ? caregiver.image
                            : `${IMAGE_BASE}${caregiver.image}`
                        }
                        alt={caregiver.name}
                        loading="lazy" decoding="async"
                        className="w-full h-full object-cover object-top"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-teal-700 text-2xl font-medium">
                        {getInitials(caregiver.name)}
                      </div>
                    )}
                  </div>
                  <div className="mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl font-semibold text-gray-900">
                        {caregiver.name}
                      </h1>
                      {caregiver.verified && (
                        <span className="flex items-center gap-1 text-[11px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified
                        </span>
                      )}
                      {caregiver.topRated && (
                        <span className="flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100">
                          <Star className="w-3 h-3" /> Top Rated
                        </span>
                      )}
                      {caregiver.emergencyAvailable && (
                        <span className="text-[11px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Emergency
                        </span>
                      )}
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 ${caregiver.available ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${caregiver.available ? "bg-green-500" : "bg-gray-400"}`}
                        />
                        {caregiver.available ? "Available" : "Busy"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {caregiver.city} &nbsp;•&nbsp; {caregiver.experience} yrs
                      experience
                    </p>
                    {caregiver.title && (
                      <p className="text-sm text-teal-700 font-medium mt-0.5">
                        {caregiver.title}
                      </p>
                    )}
                    {caregiver.tagline && (
                      <p className="text-xs text-gray-400 mt-0.5 italic">
                        {caregiver.tagline}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {caregiver.specializations.map((s) => (
                  <span
                    key={s}
                    className="text-[12px] px-3 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-100"
                  >
                    {formatSpec(s)}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Rating",
                    value: `${caregiver.rating}`,
                    suffix: " ★",
                    accent: "amber",
                  },
                  {
                    label: "Reviews",
                    value: caregiver.totalReviews,
                    suffix: "",
                    accent: "teal",
                  },
                  {
                    label: "Hourly rate",
                    value: `₹${caregiver.hourlyRate}`,
                    suffix: "/hr",
                    accent: "gray",
                  },
                  {
                    label: "Daily rate",
                    value: `₹${caregiver.dailyRate}`,
                    suffix: "/day",
                    accent: "gray",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-gray-50 hover:bg-teal-50 hover:border-teal-200 rounded-xl p-3 text-center border border-gray-100 transition-all duration-200 hover:scale-[1.03] cursor-default"
                  >
                    <p
                      className={`text-lg font-semibold ${stat.accent === "amber" ? "text-amber-500" : stat.accent === "teal" ? "text-teal-600" : "text-gray-900"}`}
                    >
                      {stat.value}
                      <span className="text-sm font-normal text-gray-400">
                        {stat.suffix}
                      </span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4"
          >
            <div className="flex border-b border-gray-100">
              {["about", "reviews", "availability"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3.5 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "text-teal-700 border-b-2 border-teal-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab === "about"
                    ? "About"
                    : tab === "reviews"
                      ? `Reviews (${caregiver.totalReviews})`
                      : "Availability"}
                </button>
              ))}
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === "about" && (
                  <AboutTab caregiver={caregiver} number={number} />
                )}
                {activeTab === "reviews" && (
                  <ReviewsTab caregiver={caregiver} />
                )}
                {activeTab === "availability" && (
                  <AvailabilityTab
                    caregiver={caregiver}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                    selectedSlot={selectedSlot}
                    setSelectedSlot={setSelectedSlot}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-50">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                ₹{caregiver.hourlyRate}
                <span className="text-sm font-normal text-gray-400">/hr</span>
              </p>
              <p className="text-[12px] text-gray-400">
                ₹{caregiver.dailyRate}/day
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/booking/${caregiver._id}`)}
                className="px-6 py-2.5 rounded-xl bg-teal-600 text-white text-sm hover:bg-teal-700 transition-colors cursor-pointer active:scale-[0.98]"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaregiverDetail;
