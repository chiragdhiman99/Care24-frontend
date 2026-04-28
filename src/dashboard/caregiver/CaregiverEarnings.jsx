import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMe } from "../../services/AuthService";
import { getbookingsByCaregiverId } from "../../services/bookingservice";
import {
  BarChart,
  PieChart,
  Pie,
  Bar,
  XAxis,
  YAxis,
  Legend,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const COLORS = ["#1a5c47", "#3b82f6", "#f87171", "#f59e0b"];

export default function CaregiverEarnings() {
  const [activeFilter, setActiveFilter] = useState("This Month");
  const [Bookings, setBookings] = useState([]);
  const [caregiverId, setCaregiverId] = useState(null);
  const [activeDay, setActiveDay] = useState(3);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    getMe().then((data) => setCaregiverId(data.caregiverId));
  }, []);

  useEffect(() => {
    if (!caregiverId) return;
    getbookingsByCaregiverId(caregiverId).then((data) => setBookings(data));
  }, [caregiverId]);

  const filteredBookings = Bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const now = new Date();

    if (activeFilter === "This Week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return bookingDate >= oneWeekAgo;
    } else if (activeFilter === "This Month") {
      return (
        bookingDate.getMonth() === now.getMonth() &&
        bookingDate.getFullYear() === now.getFullYear()
      );
    } else if (activeFilter === "Last Month") {
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const year =
        now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return (
        bookingDate.getMonth() === lastMonth &&
        bookingDate.getFullYear() === year
      );
    }
    return true;
  });

  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const today = new Date();
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(today.getDate() - i);
    last7Days.push({
      day: days[day.getDay()],
      date: day.toLocaleDateString("en-CA"),
      earned: 0,
    });
  }

  const statusCount = {
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    pending: 0,
  };

  Bookings.forEach((booking) => {
    statusCount[booking.status]++;
  });

  const DONUT_DATA = [
    { name: "Confirmed", value: statusCount.confirmed },
    { name: "Cancelled", value: statusCount.cancelled },
    { name: "Completed", value: statusCount.completed },
    { name: "Pending", value: statusCount.pending },
  ];
  Bookings.forEach((booking) => {
    const createdDate = booking.createdAt.split("T")[0];
    const match = last7Days.find((d) => d.date === createdDate);
    if (match && booking.paymentStatus === "paid") {
      match.earned += booking.totalAmount;
    }
  });

  const filterTotal = filteredBookings.reduce(
    (sum, b) => sum + b.totalAmount,
    0,
  );
  const sessionCount = Bookings.length;
  const TotalMins = Bookings.reduce((sum, booking) => {
    const val = parseInt(booking.duration);
    if (booking.duration.includes("min")) return sum + val;
    if (booking.duration.includes("hour")) return sum + val * 60;
    if (booking.duration.includes("day")) return sum + val * 24 * 60;
    if (booking.duration.includes("week")) return sum + val * 7 * 24 * 60;
    return sum;
  }, 0);
  const HoursWorked = Math.floor(TotalMins / 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-[#f5f3ee] px-4 md:px-7 py-8 -mt-10 
 text-[#1a1a1a] font-sans"
    >
      <div className="flex gap-2 mb-4 flex-wrap">
        {["This Week", "This Month", "Last Month", "All Time"].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border-none cursor-pointer transition-all duration-200
              ${activeFilter === f ? "bg-[#1a5c47] text-white shadow-md" : "bg-white text-[#555] shadow-sm"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
        <div className="bg-[#1a5c47] rounded-2xl p-5 shadow-lg text-white">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-white/60 mb-2">
            Total Earned
          </div>
          <div className="text-2xl font-extrabold tracking-tight text-white">
            ₹{filterTotal.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-white/50 mt-1">{activeFilter}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[#aaa] mb-2">
            Sessions Done
          </div>
          <div className="text-2xl font-extrabold tracking-tight text-[#1a1a1a]">
            {sessionCount}
          </div>
          <div className="text-[11px] text-[#bbb] mt-1">sessions</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[#aaa] mb-2">
            Hours Worked
          </div>
          <div className="text-2xl font-extrabold tracking-tight text-[#1a1a1a]">
            {HoursWorked}
          </div>
          <div className="text-[11px] text-[#bbb] mt-1">hrs total</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#aaa] mb-4">
            Last 7 Days
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={last7Days}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#aaa" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis />
              <Tooltip
                cursor={false}
                formatter={(val) => [`₹${val}`, "Earned"]}
                contentStyle={{
                  borderRadius: 10,
                  border: "none",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="earned" fill="#1a5c47" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#aaa] mb-4">
            Booking Status
          </div>
          {DONUT_DATA.every((d) => d.value === 0) ? (
            <div className="flex flex-col items-center justify-center h-[220px] gap-2">
              <p className="text-sm font-medium text-gray-400">
                No booking data yet
              </p>
              <p className="text-xs text-gray-300">
                Your bookings will appear here
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={DONUT_DATA}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {DONUT_DATA.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val, name) => [val, name]} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  verticalAlign="bottom"
                  formatter={(value) => (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      {value}
                    </span>
                  )}
                />{" "}
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm mt-4">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#aaa] mb-4">
          Recent Transactions
        </div>
        <div className="flex flex-col gap-3">
          {Bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <p className="text-sm font-medium text-gray-500">
                No transactions yet
              </p>
              <p className="text-xs text-gray-400">
                Your completed bookings will appear here
              </p>
            </div>
          ) : (
            Bookings.sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
              .map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-start sm:items-center justify-between p-4 rounded-2xl bg-[#f9f9f9] hover:bg-[#f0f0f0] transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a5c47] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {booking.patientName
                        ?.split(" ")
                        .slice(0, 2)
                        .map((w) => w[0]?.toUpperCase())
                        .join("")}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1a1a1a]">
                        {booking.patientName}
                      </div>
                      <div className="text-[11px] text-[#aaa] mt-0.5">
                        {booking.date} • {booking.serviceType} •{" "}
                        {booking.duration}
                      </div>
                      <div className="text-[11px] text-[#aaa]">
                        {booking.paymentMethod} • {booking.bookingId}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <div className="text-sm font-extrabold text-[#1a5c47]">
                      ₹{booking.totalAmount}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full
            ${booking.status === "completed" ? "bg-green-100 text-green-600" : ""}
            ${booking.status === "cancelled" ? "bg-red-100 text-red-500" : ""}
            ${booking.status === "confirmed" ? "bg-blue-100 text-blue-500" : ""}
            ${booking.status === "pending" ? "bg-yellow-100 text-yellow-600" : ""}
          `}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
