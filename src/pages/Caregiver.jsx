import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCaregivers } from "../services/CaregiverService";
import { useNavigate } from "react-router";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { io } from "socket.io-client";
import { Search } from "lucide-react";

const socket = io(" https://care24-backend.onrender.com");

const FILTERS = [
  "all",
  "nursing",
  "physiotherapy",
  "elderly_care",
  "post_hospital",
];

const formatSpec = (s) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

const getBadge = (caregiver) => {
  if (caregiver.rating >= 4.8)
    return { label: "★ Top Rated", className: "bg-amber-100 text-amber-700" };
  if (caregiver.totalReviews >= 50)
    return { label: "Most Booked", className: "bg-teal-100 text-teal-700" };
  if (caregiver.experience <= 2)
    return { label: "New", className: "bg-blue-100 text-blue-700" };
  return null;
};

const CaregiverCard = ({ caregiver, index }) => {
  const IMAGE_BASE = " https://care24-backend.onrender.com";
  const navigate = useNavigate();
  const badge = getBadge(caregiver);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      onClick={() => {
        if (caregiver.status === "booked") return;
        navigate(`/caregiver/${caregiver._id}`);
      }}
      className={`group ${caregiver.status === "booked" ? "cursor-not-allowed" : "cursor-pointer"} bg-white rounded-2xl border border-gray-100 overflow-hidden hover:-translate-y-1.5 hover:shadow-lg hover:shadow-teal-100 hover:border-teal-400 transition-all duration-250`}
    >
      <div className="relative h-52 bg-teal-50 overflow-hidden">
        <img
          src={
            caregiver.image?.startsWith("http")
              ? caregiver.image
              : `${IMAGE_BASE}${caregiver.image}`
          }
          loading="lazy" decoding="async"
          alt={caregiver.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-teal-50 text-teal-600 text-4xl font-semibold">${getInitials(caregiver.name)}</div>`;
          }}
        />

        {badge && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-medium px-2.5 py-1 rounded-full ${badge.className}`}
          >
            {badge.label}
          </span>
        )}

        <span
          className={`absolute top-3 right-3 flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium ${
            caregiver.status === "booked"
              ? "bg-white text-red-400"
              : caregiver.available
                ? "bg-white text-teal-700"
                : "bg-white text-gray-400"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              caregiver.status === "booked"
                ? "bg-red-400"
                : caregiver.available
                  ? "bg-teal-500"
                  : "bg-gray-400"
            }`}
          />
          {caregiver.status === "booked"
            ? "Booked"
            : caregiver.available
              ? "Available"
              : "Busy"}
        </span>
      </div>

      <div className="p-4">
        <div className="mb-1">
          <h3 className="text-[15px] font-semibold text-gray-900">
            {caregiver.name}
          </h3>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {caregiver.city} &nbsp;•&nbsp; {caregiver.experience} yrs exp
          </p>
        </div>

        <div className="flex flex-wrap gap-1 my-3">
          {caregiver.specializations.map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 border border-gray-100"
            >
              {formatSpec(s)}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center py-3 border-t border-gray-100 mb-3">
          <span className="text-[13px] font-medium text-gray-800 flex items-center gap-1">
            <span className="text-amber-400">★</span>
            {caregiver.rating}
            <span className="text-gray-400 font-normal text-[12px]">
              ({caregiver.totalReviews})
            </span>
          </span>
          <span className="text-[13px] text-gray-500">
            ₹<strong className="text-gray-900">{caregiver.hourlyRate}</strong>
            /hr
          </span>
        </div>

        <button
          onClick={(e) => {
            if (caregiver.status === "booked") return;
            e.stopPropagation();
            navigate(`/caregiver/${caregiver._id}`);
          }}
          className={`w-full py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer ${
            caregiver.status === "booked"
              ? "bg-red-100 text-red-400 cursor-not-allowed"
              : caregiver.available
                ? "bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.98]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          disabled={caregiver.status === "booked" || !caregiver.available}
        >
          {caregiver.status === "booked"
            ? "Booked"
            : caregiver.available
              ? "Book Now"
              : "Unavailable"}
        </button>
      </div>
    </motion.div>
  );
};

const Caregivers = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCaregivers()
      .then(setCaregivers)
      .finally(() => setLoading(false));

    socket.on("bookingStatus", (data) => {
      setCaregivers((prev) =>
        prev.map((c) =>
          c._id === data.caregiverId
            ? { ...c, status: data.status, available: data.available }
            : c,
        ),
      );
    });

    return () => {
      socket.off("caregiverStatusUpdate");
    };
  }, []);

  const filtered = caregivers
    .filter((c) => c.verificationStatus === "active")
    .filter((c) =>
      activeFilter === "all" ? true : c.specializations.includes(activeFilter),
    )
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase()),
    );

  if (loading)
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading caregivers...</p>
        </div>
      </div>
    );

  return (
    <>
      <Navbar />

      <div className="pt-24 min-h-screen px-6 max-w-7xl mx-auto pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Find Your <span style={{ color: "#d85a30" }}>Caregiver</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
              Verified professionals across India
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: "Caregivers", value: "500+" },
              { label: "Families", value: "10k+" },
              { label: "★ 4.9", value: "Avg Rating" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-1.5 bg-teal-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full"
              >
                <span className="text-xs sm:text-sm font-semibold text-teal-700">
                  {s.label}
                </span>
                <span className="text-[10px] sm:text-xs text-teal-500">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-400 bg-white"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full cursor-pointer text-[13px] border transition-all whitespace-nowrap ${
                  activeFilter === f
                    ? "bg-teal-600 text-white border-teal-600"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {formatSpec(f === "all" ? "All" : f)}
              </button>
            ))}
          </div>

          <span className="text-[12px] text-gray-400 whitespace-nowrap ml-auto">
            {filtered.length} found
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="flex justify-center -mt-2"><Search className="w-4 h-4" /></p>
            <p className="text-sm">
              No caregivers found. Try a different search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((c, i) => (
              <CaregiverCard key={c._id} caregiver={c} index={i} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Caregivers;
