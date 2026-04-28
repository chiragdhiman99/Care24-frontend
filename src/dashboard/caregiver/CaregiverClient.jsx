import { useEffect, useState } from "react";
import {
  getbookingsByCaregiverId,
  cancelBooking,
} from "../../services/bookingservice";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const statusColors = {
  confirmed: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  completed: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-600",
};

const typeColors = {
  Hourly: "bg-blue-50 text-blue-700",
  Daily: "bg-purple-50 text-purple-700",
  Weekly: "bg-pink-50 text-pink-700",
  Monthly: "bg-teal-50 text-teal-700",
};

const avatarColors = [
  "bg-[#e6f4ee] text-[#0D6B5E]",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
];

const formatSession = (dateStr, startTime) => {
  if (!dateStr) return "N/A";
  const date = new Date(startTime || dateStr);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const time = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return isToday ? `Today, ${time}` : `${dateStr}, ${time}`;
};

export default function MyClients({ setActiveTab, caregiverId }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!caregiverId) return;
    const fetchClients = async () => {
      try {
        const data = await getbookingsByCaregiverId(caregiverId);
        setBookings(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, [caregiverId]);

  const filtered = bookings.filter((b) => {
    const matchSearch = b.patientName
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter = filter === "All" || b.status === filter.toLowerCase();
    return matchSearch && matchFilter;
  });



  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId, {
        cancelledBy: "caregiver",
        reason: cancelReason,
      });
      const data = await getbookingsByCaregiverId(caregiverId);
      setBookings(data);
      toast.success("Booking cancelled successfully.");
      setShowCancelModal(false);
      setCancelReason("");
      setSelected(null);
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <div className="p-6 space-y-5 -mt-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full sm:w-64 outline-none focus:border-[#0D6B5E] transition"
        />
      </div>

      
      <div className="flex gap-2 flex-wrap">
        {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-medium transition-all ${
              filter === f
                ? "bg-[#0D6B5E] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500">
                No bookings found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {filter !== "All"
                  ? `No ${filter.toLowerCase()} bookings yet`
                  : "No clients yet"}
              </p>
            </div>
          ) : (
            filtered.map((b, i) => (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                onClick={() => setSelected(b)}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md hover:border-[#0D6B5E]/20 transition-all duration-200"
              >
                
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold text-base flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}
                  >
                    {b.patientName
                      ?.split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate capitalize">
                      {b.patientName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {b.patientAge} yrs · {b.address || "N/A"}
                    </p>
                  </div>

                  <div className="grid ">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize flex-shrink-0 ${statusColors[b.status] || "bg-gray-100 text-gray-500"}`}
                    >
                      {b.status}
                    </span>
                    <span className="underline text-[12px] mt-2 ml-2">
                      view more
                    </span>
                  </div>
                </div>

                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">
                    {b.serviceType}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      b.paymentStatus === "paid"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {b.paymentStatus === "paid" ? (
                      <span className="flex items-center gap-1">
                        <Check size={11} /> Paid
                      </span>
                    ) : (
                      "Unpaid"
                    )}
                  </span>
                </div>

                
                <div className="flex items-center justify-between text-sm border-t border-gray-50 pt-3">
                  <div className="text-center">
                    <p className="font-semibold text-gray-800">
                      ₹{b.totalAmount}
                    </p>
                    <p className="text-xs text-gray-400">Amount</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Session</p>
                    <p className="text-xs font-medium text-[#0D6B5E]">
                      {formatSession(b.date, b.startTime)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/30 z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl p-6 overflow-y-auto scrollbar-hide"
            >
              <button
                onClick={() => setSelected(null)}
                className="mb-5 cursor-pointer text-gray-400 hover:text-gray-700 text-sm flex items-center gap-1"
              >
                ← Back
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#e6f4ee] text-[#0D6B5E] flex items-center justify-center font-bold text-xl">
                  {selected.patientName
                    ?.split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase() || "?"}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 capitalize">
                    {selected.patientName}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {selected.patientAge} yrs · {selected.patientGender}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Booking ID", value: selected.bookingId },
                  { label: "Address", value: selected.address || "N/A" },
                  { label: "Service Type", value: selected.serviceType },
                  { label: "Duration", value: selected.duration },
                  { label: "Status", value: selected.status },
                  { label: "Payment", value: selected.paymentStatus },
                  { label: "Amount", value: `₹${selected.totalAmount}` },
                  {
                    label: "Session",
                    value: formatSession(selected.date, selected.startTime),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center py-2 border-b border-gray-50"
                  >
                    <span className="text-sm text-gray-400">{item.label}</span>
                    <span className="text-sm font-medium text-gray-800 capitalize">
                      {item.value}
                    </span>
                  </div>
                ))}

                {selected.notes && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-400 mb-1">Notes</p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">
                      {selected.notes}
                    </p>
                  </div>
                )}
                {selected.status === "confirmed" && (
                  <>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="w-full mt-2 cursor-pointer border border-red-200 text-red-600 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition"
                    >
                      Cancel Booking
                    </button>

                    {showCancelModal && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
                      >
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                          <h3 className="text-base font-semibold text-gray-800 mb-1">
                            Cancel Booking
                          </h3>
                          <p className="text-xs text-gray-400 mb-4">
                            {selected.patientName} · {selected.date}
                          </p>

                          <p className="text-sm text-gray-600 mb-3">
                            Select a reason
                          </p>

                          <div className="flex flex-col gap-2 mb-4">
                            {[
                              "Personal emergency",
                              "Patient unresponsive",
                              "Scheduling conflict",
                              "Other",
                            ].map((reason) => (
                              <label
                                key={reason}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition ${
                                  cancelReason === reason
                                    ? "border-red-400 bg-red-50"
                                    : "border-gray-100 hover:border-gray-300"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="cancelReason"
                                  value={reason}
                                  checked={cancelReason === reason}
                                  onChange={() => setCancelReason(reason)}
                                  className="accent-red-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {reason}
                                </span>
                              </label>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setShowCancelModal(false);
                                setCancelReason("");
                              }}
                              className="flex-1 cursor-pointer py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition"
                            >
                              Go back
                            </button>
                            <button
                              disabled={!cancelReason}
                              onClick={() => handleCancelBooking(selected._id)}
                              className="flex-1 cursor-pointer py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-40"
                            >
                              Confirm cancel
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
                <button
                  onClick={() => setActiveTab("messages")}
                  className="w-full cursor-pointer  bg-[#0D6B5E] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#0a5a4e] transition"
                >
                  Message Client
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

