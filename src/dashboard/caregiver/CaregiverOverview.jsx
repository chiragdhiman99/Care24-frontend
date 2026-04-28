import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getbookingsByCaregiverId } from "../../services/bookingservice";
import {
  updateCaregiverStatus,
  getCaregiverbyId,
} from "../../services/CaregiverService";
import { toast } from "sonner";
import {
  Users,
  CalendarDays,
  IndianRupee,
  Star,
  CalendarX2,
} from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

export default function CaregiverOverview({ caregiverId, onNavigate }) {
  const [greeting, setGreeting] = useState("");
  const [bookings, setBookings] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    if (!caregiverId) return;
    getbookingsByCaregiverId(caregiverId).then((data) => {
      setBookings(data);
    });
  }, [caregiverId]);

  useEffect(() => {}, [caregiverId]);

  const todaySchedule = bookings
    .filter(
      (b) => new Date(b.date).toDateString() === new Date().toDateString(),
    )
    .slice(0, 5);

  const activeClients = [...new Set(bookings.map((b) => b.userId))].length;

  const totalEarnings = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const today = new Date().toDateString();
  const sessionsToday = bookings.filter(
    (b) => new Date(b.date).toDateString() === today,
  ).length;

  const now = new Date();
  const earningsThisMonth = bookings
    .filter((b) => {
      const d = new Date(b.createdAt);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const stats = [
    {
      label: "Active Clients",
      value: activeClients,
      icon: <Users size={20} className="text-[#1a6b4a]" />,
    },
    {
      label: "Sessions Today",
      value: sessionsToday,
      icon: <CalendarDays size={20} className="text-[#1a6b4a]" />,
    },
    {
      label: "Earnings This Month",
      value: `₹${earningsThisMonth.toLocaleString()}`,
      icon: <IndianRupee size={20} className="text-[#1a6b4a]" />,
    },
    {
      label: "Total Earnings",
      value: `₹${totalEarnings.toLocaleString()}`,
      icon: <IndianRupee size={20} className="text-[#1a6b4a]" />,
    },
  ];

  const recentActivity = bookings
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3)
    .map((b) => {
      let text = "";
      if (b.status === "completed")
        text = `Session completed with ${b.patientName}`;
      else if (b.status === "cancelled")
        text = `Booking cancelled for ${b.patientName}`;
      else if (b.status === "confirmed" && b.paymentStatus === "paid")
        text = `Session confirmed with ${b.patientName}`;
      else if (b.paymentStatus === "paid")
        text = `Payment received ₹${b.totalAmount} from ${b.patientName}`;
      else text = `New booking request from ${b.patientName}`;

      const time = new Date(b.updatedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });

      return { text, time };
    });

  const handleToggle = async () => {
    const newstatus = !isAvailable;
    setIsAvailable(newstatus);
    try {
      await updateCaregiverStatus(caregiverId, { available: newstatus });
    } catch (error) {
      setIsAvailable(!newStatus);
      console.error("Status update failed:", error);
    }
  };

  useEffect(() => {
    if (!caregiverId) return;
    getCaregiverbyId(caregiverId).then((data) => {
      setIsAvailable(data.available);
    });
  }, [caregiverId]);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {stat.label}
              </p>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-fit"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">
              Today's Schedule
            </h2>
            <span
              onClick={() => onNavigate("client")}
              className="text-xs text-[#1a6b4a] font-medium cursor-pointer hover:underline"
            >
              View All →
            </span>
          </div>
          <div className="space-y-3">
            {todaySchedule.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <span className="text-3xl">🗓️</span>
                <p className="text-sm font-medium text-gray-600">
                  No sessions today
                </p>
                <p className="text-xs text-gray-400">Enjoy your free day! 🌿</p>
              </div>
            ) : (
              todaySchedule.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#e6f4ee] flex items-center justify-center text-[#1a6b4a] font-semibold text-sm">
                      {item.patientName
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0]?.toUpperCase())
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.patientName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.serviceType} ·{" "}
                        {new Date(item.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      item.status === "confirmed"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-white w-full rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <CalendarX2 size={28} className="text-gray-300" />
                <p className="text-sm font-medium text-gray-500">
                  No recent activity
                </p>
                <p className="text-xs text-gray-400">
                  Your bookings will appear here
                </p>
              </div>
            ) : (
              recentActivity.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#1a6b4a] shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">{item.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">
                Availability Status
              </p>
              <p className="text-xs text-gray-400">
                {isAvailable
                  ? "You are currently available"
                  : "You are currently busy"}
              </p>
            </div>
            <div
              onClick={handleToggle}
              className={`w-11 h-6 rounded-full flex items-center px-1 cursor-pointer transition-all duration-300 ${
                isAvailable ? "bg-[#1a6b4a]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  isAvailable ? "ml-auto" : "ml-0"
                }`}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
