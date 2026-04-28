import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cancelBooking } from "../../services/bookingservice";
import { createReviews } from "../../services/ReviewService";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  ClipboardList,
  CheckCircle,
  Clock,
  CalendarDays,
  Star,
} from "lucide-react";

const filters = ["All", "Confirmed", "Pending", "Cancelled", "Completed"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4 },
  }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

const colors = ["#0D6B5E", "#E8642A", "#2563EB", "#7C3AED", "#0891B2"];

export default function AppointmentsTab({ bookingData, onCancelBooking }) {
  const [active, setActive] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const handleReview = async (userId, caregiverId, rating, review) => {
    const data = await createReviews({
      userId,
      caregiverId,
      rating,
      feedback: review,
    });
    setReviewModal(false);
    setRating(0);
    setReviewText("");
    setSelectedBooking(null);
  };

  const [appointments, setAppointments] = useState(() =>
    (bookingData || [])
      .map((b, i) => ({
        id: b._id,
        caregiver: b.caregiverName ?? "Unknown",
        role: b.serviceType,
        date: b.date,
        time: b.duration,
        status: b.status?.charAt(0).toUpperCase() + b.status?.slice(1),
        initials:
          b.caregiverName
            ?.split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() ?? "C",
        color: colors[i % colors.length],
        raw: b,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
  );

  const filtered = appointments.filter(
    (a) => active === "All" || a.status === active,
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const total = appointments.length;
  const confirmed = appointments.filter((a) => a.status === "Confirmed").length;
  const pending = appointments.filter((a) => a.status === "Pending").length;

  const statusStyle = {
    Confirmed: "bg-emerald-100 text-emerald-600",
    Pending: "bg-orange-100 text-orange-500",
    Cancelled: "bg-red-100 text-red-500",
    Completed: "bg-blue-100 text-blue-500",
  };
  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);

      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a)),
      );

      if (onCancelBooking) onCancelBooking(id);
      toast.success("Booking cancelled successfully.");
      setSelectedBooking(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="relative">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
      >
        {[
          {
            label: "Total Booked",
            value: total,
            icon: <ClipboardList className="w-5 h-5 text-[#0D6B5E]" />,
            color: "#0D6B5E",
            bg: "#E8F5F2",
          },
          {
            label: "Confirmed",
            value: confirmed,
            icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
            color: "#059669",
            bg: "#D1FAE5",
          },
          {
            label: "Pending",
            value: pending,
            icon: <Clock className="w-5 h-5 text-[#E8642A]" />,
            color: "#E8642A",
            bg: "#FEF0E8",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            custom={i}
            className="bg-white rounded-2xl p-4"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  {s.label}
                </p>
                <p className="text-3xl font-bold text-gray-800">{s.value}</p>
              </div>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: s.bg }}
              >
                {s.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => {
              setActive(f);
              setCurrentPage(1);
            }}
            className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
              active === f
                ? "bg-[#0D6B5E] text-white"
                : "bg-white text-gray-500 hover:bg-gray-100"
            }`}
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          >
            {f}
          </button>
        ))}
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3"
      >
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <div className="w-16 h-16 bg-[#E8F5F2] rounded-full flex items-center justify-center mb-4">
              <CalendarDays className="w-8 h-8 text-[#0D6B5E]" />
            </div>
            <p className="text-gray-700 font-semibold text-sm mb-1">
              No Appointments Found
            </p>
            <p className="text-gray-400 text-xs text-center max-w-xs">
              You don't have any {active !== "All" ? active.toLowerCase() : ""}{" "}
              appointments yet.
            </p>
            <button
              onClick={() => navigate("/caregivers")}
              className="mt-5 bg-[#0D6B5E] text-white cursor-pointer text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0a5a4e] transition-colors"
            >
              + Book Appointment
            </button>
          </motion.div>
        ) : (
          paginated.map((a, i) => (
            <motion.div
              key={a.id}
              variants={fadeUp}
              custom={i}
              className="bg-white rounded-2xl p-4 flex items-center gap-4"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                style={{ backgroundColor: a.color }}
              >
                {a.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {a.caregiver}
                </p>
                <p className="text-xs text-gray-400">
                  {a.role} · {a.date} · {a.time}
                </p>
              </div>
              <span
                className={`text-[10px] font-bold px-3 py-1 rounded-full flex-shrink-0 ${statusStyle[a.status]}`}
              >
                {a.status}
              </span>
              <button
                onClick={() => setSelectedBooking(a)}
                className="text-xs text-[#0D6B5E] cursor-pointer font-semibold hover:underline flex-shrink-0"
              >
                View →
              </button>
            </motion.div>
          ))
        )}
      </motion.div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5  cursor-pointer text-xs font-semibold rounded-xl bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 text-xs font-bold cursor-pointer rounded-xl transition-all ${
                currentPage === page
                  ? "bg-[#0D6B5E] text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 cursor-pointer text-xs font-semibold rounded-xl bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          >
            Next →
          </button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 rounded-2xl p-5 flex items-center justify-between gap-4"
        style={{
          background: "linear-gradient(120deg, #0D6B5E, #1a8a7a)",
          boxShadow: "0 8px 24px rgba(13,107,94,0.2)",
        }}
      >
        <div>
          <p className="text-white font-bold text-sm">
            Schedule a new appointment
          </p>
          <p className="text-white/60 text-xs mt-0.5">
            Available slots for this week
          </p>
        </div>
        <button
          onClick={() => navigate("/caregivers")}
          className="bg-white cursor-pointer text-[#0D6B5E] text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#E8642A] hover:text-white transition-colors"
        >
          Book Now
        </button>
      </motion.div>

      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSelectedBooking(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-80 bg-white z-50 flex flex-col"
            style={{ boxShadow: "-8px 0 32px rgba(0,0,0,0.12)" }}
          >
            <div
              className="p-5 flex items-center justify-between"
              style={{
                background: "linear-gradient(120deg, #0D6B5E, #1a8a7a)",
              }}
            >
              <p className="text-white font-bold text-sm">Booking Details</p>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-7 cursor-pointer h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs hover:bg-white/30 transition"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide p-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
                  style={{ backgroundColor: selectedBooking.color }}
                >
                  {selectedBooking.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    {selectedBooking.caregiver}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedBooking.role}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${statusStyle[selectedBooking.status]}`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {[
                { label: "Booking ID", value: selectedBooking.id },
                { label: "Service Type", value: selectedBooking.role },
                { label: "Date", value: selectedBooking.date },
                { label: "Duration", value: selectedBooking.time },
                { label: "Status", value: selectedBooking.status },
                ...(selectedBooking.raw?.address
                  ? [{ label: "Address", value: selectedBooking.raw.address }]
                  : []),
                ...(selectedBooking.raw?.notes
                  ? [{ label: "Notes", value: selectedBooking.raw.notes }]
                  : []),
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {item.value ?? "—"}
                  </p>
                </div>
              ))}

              {(() => {
                const s = selectedBooking.status;
                const config = {
                  Confirmed: {
                    bg: "#E8F5F2",
                    dot: "bg-emerald-500",
                    text: "text-[#0D6B5E]",
                    msg: "Caregiver is Booked & on the way",
                  },
                  Pending: {
                    bg: "#FEF0E8",
                    dot: "bg-orange-400",
                    text: "text-orange-500",
                    msg: "Awaiting Caregiver Confirmation",
                  },
                  Cancelled: {
                    bg: "#FEE2E2",
                    dot: "bg-red-400",
                    text: "text-red-500",
                    msg: "Booking Cancelled",
                  },
                  Completed: {
                    bg: "#EFF6FF",
                    dot: "bg-blue-400",
                    text: "text-blue-500",
                    msg: "Session Completed Successfully",
                  },
                };
                const c = config[s] || config.Confirmed;
                return (
                  <div
                    className="rounded-xl p-3 flex items-center gap-2 mt-1"
                    style={{ backgroundColor: c.bg }}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${c.dot}`}
                    />
                    <p className={`text-xs font-semibold ${c.text}`}>{c.msg}</p>
                  </div>
                );
              })()}
            </div>

            <div className="p-4 border-t border-gray-100">
              {selectedBooking.status === "Cancelled" ? (
                <p className="text-center text-xs text-gray-400 font-semibold py-2">
                  This booking is already cancelled
                </p>
              ) : selectedBooking.status === "Completed" ? (
                <button
                  onClick={() => setReviewModal(true)}
                  className="w-full py-3 cursor-pointer rounded-xl text-sm font-bold bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4" /> Add a Review
                </button>
              ) : (
                <button
                  onClick={() => handleCancel(selectedBooking.id)}
                  className="w-full py-3 rounded-xl text-sm font-bold bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  Cancel Booking
                </button>
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full cursor-pointer mt-2 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reviewModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setReviewModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-white rounded-3xl p-6 w-80 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-gray-800 text-sm">
                  Rate Your Experience
                </p>
                <button
                  onClick={() => setReviewModal(false)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                Booking with{" "}
                <span className="font-semibold text-gray-600">
                  {selectedBooking?.caregiver}
                </span>
              </p>

              <div className="flex gap-2 justify-center mb-5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0D6B5E] transition-colors resize-none mb-4"
              />

              <button
                onClick={() => {
                  handleReview(
                    selectedBooking.raw.userId,
                    selectedBooking.raw.caregiverId,
                    rating,
                    reviewText,
                  );
                }}
                className="w-full cursor-pointer active:scale-95 py-3 rounded-xl text-sm font-bold text-white transition-colors"
                style={{ background: "#0D6B5E" }}
              >
                Submit Review →
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
