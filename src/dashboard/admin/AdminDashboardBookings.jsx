import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllBookings } from "../../services/bookingservice";

function BookingDetailModal({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-[#0b7d6e] rounded-t-2xl">
          <div>
            <h2 className="text-white font-medium text-base">
              Booking Details
            </h2>
            <p className="text-white/70 text-xs mt-0.5">{booking.bookingId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white text-lg cursor-pointer hover:opacity-70"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">
                Patient
              </p>
              <p className="text-sm font-medium text-gray-800">
                {booking.patientName}
              </p>
              <p className="text-xs text-gray-400 mt-1">{booking.userEmail}</p>
              <p className="text-xs text-gray-500 mt-1">
                Age: {booking.patientAge} · {booking.patientGender}
              </p>
              {booking.notes && (
                <p className="text-xs text-gray-400 mt-1 italic">
                  "{booking.notes}"
                </p>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">
                Caregiver
              </p>
              <p className="text-sm font-medium text-gray-800">
                {booking.caregiverName}
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <span className="text-yellow-400">★</span>{" "}
                {booking.caregiverRating} · {booking.caregiverExperience} yrs
                exp
              </p>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide font-medium">
              Service
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Service Type", value: booking.serviceType },
                { label: "Duration", value: booking.duration },
                {
                  label: "Date",
                  value: new Date(booking.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }),
                },
                {
                  label: "Start Time",
                  value: new Date(booking.startTime).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  ),
                },
                { label: "Address", value: booking.address },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm text-gray-800 font-medium mt-0.5">
                    {item.value || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide font-medium">
              Payment
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400">Amount</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">
                  ₹{booking.totalAmount}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Method</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">
                  {booking.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Payment Status</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                    booking.paymentStatus === "paid"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {booking.paymentStatus}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400">Booking Status</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                    booking.status === "confirmed"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : booking.status === "pending"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : booking.status === "completed"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminDashboardBookings() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const Items_Per_Page = 5;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllBookings();
      setBookings(data);
    };
    fetchData();
  }, []);

  const filtered = bookings.filter((b) => {
    if (activeTab === "all") return true;
    return b.status === activeTab;
  });

  const TotalPages = Math.ceil(filtered.length / Items_Per_Page);
  const startIndex = (currentPage - 1) * Items_Per_Page;
  const endIndex = startIndex + Items_Per_Page;
  const currentItems = filtered.slice(startIndex, endIndex);

  const countOf = (status) =>
    bookings.filter((b) => b.status === status).length;

  const tabs = [
    { key: "all", label: "All", count: bookings.length },
    { key: "pending", label: "Pending", count: countOf("pending") },
    { key: "confirmed", label: "Confirmed", count: countOf("confirmed") },
    { key: "completed", label: "Completed", count: countOf("completed") },
    { key: "cancelled", label: "Cancelled", count: countOf("cancelled") },
  ];

  const statusStyle = {
    confirmed: "bg-green-50 text-green-700 border border-green-200",
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    completed: "bg-blue-50 text-blue-700 border border-blue-200",
    cancelled: "bg-red-50 text-red-600 border border-red-200",
  };

  return (
    <motion.div
      className="p-2 sm:p-6 -mt-5"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setCurrentPage(1);
            }}
            className={`px-4 py-1.5 rounded-lg text-sm border transition cursor-pointer flex items-center gap-2 ${
              activeTab === tab.key
                ? "bg-[#0b7d6e] text-white border-[#0b7d6e]"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-medium">Patient</th>
              <th className="text-left px-4 py-3 font-medium">Caregiver</th>
              <th className="text-left px-4 py-3 font-medium">Service</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-left px-4 py-3 font-medium">Amount</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((b, i) => (
              <tr
                key={b._id}
                className={`border-b border-gray-50 hover:bg-gray-50 transition ${i === currentItems.length - 1 ? "border-none" : ""}`}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800 text-sm">
                    {b.patientName}
                  </p>
                  <p className="text-xs text-gray-400">{b.userEmail}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800 text-sm">
                    {b.caregiverName}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    {b.caregiverRating}
                  </p>
                </td>
                <td className="px-4 py-3 text-gray-600">{b.serviceType}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(b.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  ₹{b.totalAmount}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle[b.status] || "bg-gray-100 text-gray-500"}`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-gray-400 text-sm"
                >
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 border-t border-gray-100 gap-2">
        <p className="text-xs text-gray-400">
          Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of{" "}
          {filtered.length} bookings
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50 disabled:opacity-40"
          >
            ←
          </button>
          {Array.from({ length: TotalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 text-xs rounded-lg border cursor-pointer ${
                currentPage === i + 1
                  ? "bg-[#0b7d6e] text-white border-[#0b7d6e]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === TotalPages}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50 disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>

      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </motion.div>
  );
}
