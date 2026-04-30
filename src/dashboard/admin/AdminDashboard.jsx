import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import AdminDashboardOverview from "./AdminDashboardOverview";
import AdminDashboardUsers from "./AdminDashboardUsers";
import AdminDashboardCaregivers from "./AdminDashboardCaregivers";
import AdminDashboardBookings from "./AdminDashboardBookings";
import AdminDashboardSettings from "./AdminDashboardSettings";
import {
  LayoutDashboard,
  Users,
  HeartPulse,
  CalendarDays,
  Settings,
  Bell,
  Wrench,
  X,
} from "lucide-react";
import {
  getNotifications,
  markAllAsRead3,
} from "../../services/NotificationsService";
import { getMe, getuserbyid } from "../../services/AuthService";
import { io } from "socket.io-client";

const navItems = [
  { icon: <LayoutDashboard size={16} />, label: "Overview", id: "overview" },
  { icon: <Users size={16} />, label: "Users", id: "users" },
  { icon: <HeartPulse size={16} />, label: "Caregivers", id: "caregivers" },
  { icon: <CalendarDays size={16} />, label: "Bookings", id: "bookings" },
  { icon: <Settings size={16} />, label: "Settings", id: "settings" },
];

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("overview");
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [UserData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const fetchdata = async () => {
      const data = await getMe();
      const userData = await getuserbyid(data.userId);
      setUserData(userData);
    };

    fetchdata();
  }, []);

  useEffect(() => {
    if (!UserData) return;

    const fetchNotifs = async () => {
      const data = await getNotifications(UserData._id);
      setNotifications(data);
    };
    fetchNotifs();

    const socket = io("https://care24-backend.onrender.com");
    socket.on("newBooking", (data) => {
      setNotifications((prev) => [{ ...data, isRead: false }, ...prev]);
    });
    socket.on("newUser", (data) => {
      setNotifications((prev) => [{ ...data, isRead: false }, ...prev]);
    });

    socket.on("caregiverUpdate", (data) => {
      setNotifications((prev) => [{ ...data, isRead: false }, ...prev]);
    });
    return () => socket.disconnect();
  }, [UserData]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    await markAllAsRead3(UserData._id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setShowNotif(false);
  };

  return (
    <div
      className="min-h-screen bg-[#F5F3EE] font-sans flex overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`flex flex-col w-60 min-h-screen bg-[#0D6B5E] fixed top-0 left-0 z-50 py-6 px-4 flex-shrink-0 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ boxShadow: "4px 0 24px rgba(13,107,94,0.18)" }}
      >
        <div className="flex items-center gap-2 mb-10 px-2">
          <Link className="font-fraunces text-2xl font-bold">
            <span
              style={{ fontFamily: "'DM Sans', sans-serif", color: "white" }}
            >
              Care{" "}
            </span>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#E8622A",
              }}
            >
              24
            </span>
          </Link>
        </div>

        <nav className="flex flex-col gap-0 relative">
          <div className="absolute left-[43px] -top-4 bottom-12 flex flex-col items-center z-0">
            <div className="w-2.5 h-2.5 rounded-full bg-white/40 flex-shrink-0" />
            <div className="flex-1 w-[2px] bg-white/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/40 flex-shrink-0" />
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                setSidebarOpen(false);
              }}
              className={`flex cursor-pointer items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left w-full relative z-10 ${
                activeNav === item.id
                  ? "text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <span
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  activeNav === item.id
                    ? "bg-white text-[#0D6B5E] shadow-md"
                    : "bg-white/10 text-white/70"
                }`}
              >
                {item.icon}
              </span>
              <span className="truncate font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-6 bg-white/10 rounded-2xl p-3 flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="w-9 h-9 rounded-full bg-[#E8642A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {UserData?.name
              ?.split(" ")
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase())
              .join("") || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-semibold truncate">Admin</p>
            <p className="text-white/50 text-[10px]">Administrator</p>
          </div>
        </div>
      </aside>

      <div className="md:ml-60 flex-1 flex flex-col min-h-screen min-w-0 overflow-hidden">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 px-4 md:px-8 py-4 flex items-center justify-between gap-4 min-w-0"
          style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}
        >
          <div className="md:hidden flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-8 h-8 flex flex-col justify-center items-center gap-1.5 mr-1"
            >
              <span className="w-5 h-0.5 bg-gray-700 rounded-full" />
              <span className="w-5 h-0.5 bg-gray-700 rounded-full" />
              <span className="w-3.5 h-0.5 bg-gray-700 rounded-full" />
            </button>
            <div className="w-7 h-7 bg-[#0D6B5E] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">C</span>
            </div>
            <span className="text-[#0D6B5E] font-bold text-base">
              Care <span className="text-[#E8642A]">24</span>
            </span>
          </div>
          <div className="hidden md:block min-w-0">
            <h1 className="text-xl font-bold text-gray-800 truncate capitalize">
              {activeNav}
            </h1>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotif((prev) => !prev)}
                className="relative cursor-pointer w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              {showNotif && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute -right-15 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-800 text-sm">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-[#0D6B5E] hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-10 text-center text-gray-400 text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n, i) => (
                        <div
                          key={i}
                          className={`flex gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.isRead ? "bg-green-50" : ""}`}
                        >
                          <div className="w-8 h-8 rounded-full bg-[#0D6B5E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CalendarDays
                              size={14}
                              className="text-[#0D6B5E]"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-800 ">
                              {n.type === "booking_cancelled"
                                ? `Booking cancelled by ${n.patientName || n.userName}`
                                : n.type === "booking_confirmed"
                                  ? `Booking confirmed with ${n.patientName || n.userName}`
                                  : n.type === "newUser" ||
                                      n.type === "user_registered"
                                    ? `New user registered: ${n.patientName || n.userName}`
                                    : n.type === "caregiver_registered" ||
                                        n.type === "newCaregiver"
                                      ? `New caregiver registered: ${n.patientName || n.caregiverName}`
                                      : n.message ||
                                        `New booking from ${n.patientName || n.userName}`}
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              {n.serviceType ? `${n.serviceType} • ` : ""}
                              {n.date || ""}
                            </p>
                            {n.totalAmount > 0 && (
                              <p className="text-xs font-semibold text-[#0D6B5E] mt-1">
                                ₹{n.totalAmount}
                              </p>
                            )}
                          </div>
                          {!n.isRead && (
                            <div className="w-2 h-2 rounded-full bg-[#0D6B5E] flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="w-9 h-9 rounded-full bg-[#E8642A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {UserData?.name
                ?.split(" ")
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("") || "A"}
            </div>
          </div>
        </motion.header>

        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto overflow-x-hidden min-w-0">
          {activeNav === "overview" && <AdminDashboardOverview />}
          {activeNav === "users" && <AdminDashboardUsers />}
          {activeNav === "caregivers" && <AdminDashboardCaregivers />}
          {activeNav === "bookings" && <AdminDashboardBookings />}
          {activeNav === "settings" && <AdminDashboardSettings />}
        </main>
      </div>
    </div>
  );
}
