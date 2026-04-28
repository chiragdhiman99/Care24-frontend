import { motion } from "framer-motion";
import { getAllBookings } from "../../services/BookingService";
import { getCaregivers } from "../../services/CaregiverService";
import { getAllUsers } from "../../services/AuthService";
import { use, useEffect, useState } from "react";
import {
  Users,
  Shield,
  CalendarDays,
  DollarSign,
  Star,
  TriangleAlert,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { all } from "axios";

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AdminOverviewStats() {
  const [AllBookings, setAllBookings] = useState([]);
  const [AllCaregivers, setAllCaregivers] = useState([]);
  const [AllUsers, setAllUsers] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      const bookings = await getAllBookings();
      setAllBookings(bookings);

      const caregivers = await getCaregivers();
      setAllCaregivers(caregivers);

      const users = await getAllUsers();
      setAllUsers(users);
    };

    fetchAll();
  }, []);

  const TotalRevenue = AllBookings.reduce(
    (total, booking) => total + booking.totalAmount,
    0,
  );
  const stats = [
    {
      id: 1,
      label: "Total Users",
      value: AllUsers.length,
      icon: <Users size={22} />,
      accent: "#0D6B5E",
      bg: "#E6F4F1",
      iconColor: "#0D6B5E",
    },
    {
      id: 2,
      label: "Total Caregivers",
      value: AllCaregivers.length,
      icon: <Shield size={22} />,
      accent: "#E8622A",
      bg: "#FDF0EA",
      iconColor: "#E8622A",
    },
    {
      id: 3,
      label: "Active Bookings",
      value: AllBookings.length,
      icon: <CalendarDays size={22} />,
      accent: "#7C3AED",
      bg: "#F3EFFE",
      iconColor: "#7C3AED",
    },
    {
      id: 4,
      label: "Total Revenue",
      value: "$" + TotalRevenue,
      icon: <DollarSign size={22} />,
      accent: "#0EA5E9",
      bg: "#E8F6FD",
      iconColor: "#0EA5E9",
    },
  ];

  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const today = new Date();
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(today.getDate() - i);
    last7Days.push({
      day: days[day.getDay()],
      date: day.toISOString().split("T")[0],
      bookings: 0,
    });
  }

  AllBookings.forEach((booking) => {
    const createdDate = booking.createdAt.split("T")[0];
    const match = last7Days.find((d) => d.date === createdDate);
    if (match) match.bookings += 1;
  });

  const topCaregivers = [];

  AllBookings.forEach((booking) => {
    const existing = topCaregivers.find((c) => c.id === booking.caregiverId);
    if (existing) {
      existing.bookings += 1;
    } else {
      topCaregivers.push({
        id: booking.caregiverId,
        name: booking.caregiverName,
        rating: booking.caregiverRating,
        bookings: 1,
      });
    }
  });

  topCaregivers.sort((a, b) => b.bookings - a.bookings);
  const top5 = topCaregivers.slice(0, 5);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="w-full">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.id}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl p-5 flex flex-col gap-4 cursor-default"
            style={{
              border: "1px solid #F0EDE8",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              borderLeft: `4px solid ${stat.accent}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: stat.bg, color: stat.iconColor }}
              >
                {stat.icon}
              </div>
            </div>

            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.12 + 0.3, duration: 0.4 }}
                className="text-2xl font-bold text-gray-800 tracking-tight"
              >
                {stat.value}
              </motion.p>
              <p className="text-sm text-gray-400 mt-0.5 font-medium">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#aaa] mb-4">
            Bookings Trend — Last 7 Days
          </div>
          <ResponsiveContainer width="100%" height={250}>
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
                formatter={(val) => [val, "Bookings"]}
                contentStyle={{
                  borderRadius: 10,
                  border: "none",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="bookings" fill="#0D6B5E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-1 bg-white rounded-2xl p-5 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#aaa] mb-4">
            Recent Bookings
          </div>
          <div className="flex flex-col gap-3">
            {AllBookings.sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 4)
              .map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#f9f9f9]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0D6B5E] flex items-center justify-center text-white font-bold text-xs">
                      {booking.patientName
                        ?.split(" ")
                        .slice(0, 2)
                        .map((w) => w[0]?.toUpperCase())
                        .join("")}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1a1a1a]">
                        {booking.patientName}
                      </div>
                      <div className="text-[10px] text-[#aaa]">
                        {booking.date}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full
              ${booking.status === "completed" ? "bg-green-100 text-green-600" : ""}
              ${booking.status === "cancelled" ? "bg-red-100 text-red-500" : ""}
              ${booking.status === "confirmed" ? "bg-blue-100 text-blue-500" : ""}
              ${booking.status === "pending" ? "bg-yellow-100 text-yellow-600" : ""}
            `}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm mt-4 w-full">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#aaa] mb-4">
          Top Caregivers
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {top5.map((cg, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-4 rounded-2xl bg-[#f9f9f9]"
            >
              <div className="w-12 h-12 rounded-full bg-[#0D6B5E] flex items-center justify-center text-white font-bold text-lg mb-2">
                {cg.name
                  ?.split(" ")
                  .slice(0, 2)
                  .map((w) => w[0]?.toUpperCase())
                  .join("")}
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E6F4F1] text-[#0D6B5E] mb-1">
                #{i + 1}
              </span>
              <div className="text-xs font-bold text-[#1a1a1a] text-center">
                {cg.name}
              </div>
              <div className="text-[10px] text-[#aaa] mt-1 flex items-center gap-1">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />{" "}
                {cg.rating}
              </div>
              <div className="text-[10px] text-[#aaa]">
                {cg.bookings} bookings
              </div>
            </div>
          ))}
        </div>
      </div>
      {AllCaregivers.filter((c) => c.verificationStatus === "pending").length >
        0 && (
        <div className="w-full mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <TriangleAlert size={22} className="text-yellow-500" />
            <div>
              <div className="text-sm font-bold text-yellow-800">
                Pending Caregiver Verifications
              </div>
              <div className="text-[11px] text-yellow-600 mt-0.5">
                {
                  AllCaregivers.filter(
                    (c) => c.verificationStatus === "pending",
                  ).length
                }{" "}
                caregivers are waiting for approval
              </div>
            </div>
          </div>
          <button
            className="text-[11px] font-bold px-4 py-2 rounded-xl bg-yellow-400 text-yellow-900 hover:bg-yellow-500 transition-all cursor-pointer"
            onClick={() => (window.location.href = "/admin/caregivers")}
          >
            Review Now →
          </button>
        </div>
      )}
    </div>
  );
}
