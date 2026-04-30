import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { getMe } from "../../services/AuthService";
import CaregiverOverview from "./CaregiverOverview";
import CaregiverClient from "./CaregiverClient";
import CaregiverProfile from "./CaregiverProfile";
import CaregiverSetting from "./CaregiverSetting";
import CaregiverMessages from "./CaregiverMessages";
import { getuserbyid } from "../../services/AuthService";
import { getCaregiverbyId } from "../../services/CaregiverService";
import { getbookingsByCaregiverId } from "../../services/bookingservice";
import { markAllAsRead } from "../../services/bookingservice";
import {
  Home,
  CalendarDays,
  User,
  BarChart3,
  MessageCircle,
  Settings,
  X,
} from "lucide-react";

import {
  getNotifications,
  markAllAsRead3,
} from "../../services/NotificationsService";
import socket from "../../utils/socket";
import CaregiverEarnings from "./CaregiverEarnings";

const navItems = [
  { icon: <Home className="w-4 h-4" />, label: "Overview", id: "overview" },
  {
    icon: <CalendarDays className="w-4 h-4" />,
    label: "My clients",
    id: "client",
  },
  { icon: <User className="w-4 h-4" />, label: "My Profile", id: "profile" },
  {
    icon: <BarChart3 className="w-4 h-4" />,
    label: "Earnings",
    id: "earnings",
  },
  {
    icon: <MessageCircle className="w-4 h-4" />,
    label: "Messages",
    id: "messages",
  },
  { icon: <Settings className="w-4 h-4" />, label: "Settings", id: "settings" },
];
const pageTitles = {
  overview: {
    title: "Overview",
    sub: "Here's what's happening with your care today",
  },
  client: {
    title: "My Clients",
    sub: "Manage your upcoming and past sessions",
  },
  profile: {
    title: "My Profile",
    sub: "Manage your profile and verification status",
  },
  earnings: { title: "Earnings", sub: "Track your income and performance" },
  messages: { title: "Messages", sub: "Chat with your clients" },
  settings: { title: "Settings", sub: "Manage your account and preferences" },
};

export default function CaregiverDashboard() {
  const [activeNav, setActiveNav] = useState("overview");
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [caregiverId, setCaregiverId] = useState(null);
  const [caregiverData, setCaregiverData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [msgUnread, setMsgUnread] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      if (userId) {
        socket.emit("userOnline", userId);
      }
    });
  }, [userId]);

  useEffect(() => {
    socket.on("bookingCancelled", (data) => {
      setNotifications((prev) => {
        const exists = prev.some(
          (n) => n.bookingId?.toString() === data.bookingId?.toString(),
        );
        if (exists) return prev;
        return [data, ...prev];
      });
      setUnreadCount((prev) => prev + 1);
    });
    return () => socket.off("bookingCancelled");
  }, []);

  useEffect(() => {
    socket.on("newBooking", (data) => {
      setNotifications((prev) => {
        const exists = prev.some(
          (n) => n.bookingId?.toString() === data.bookingId?.toString(),
        );
        if (exists) return prev;
        return [data, ...prev];
      });
      setUnreadCount((prev) => prev + 1);
    });
    return () => socket.off("newBooking");
  }, []);

  useEffect(() => {
    getMe()
      .then((data) => {
        if (data.caregiverId) {
          socket.emit("joinRoom", data.caregiverId);
        }
        socket.emit("userOnline", data.userId);
        setUserId(data.userId);
        setCaregiverId(data.caregiverId);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!caregiverId) return;
    getCaregiverbyId(caregiverId)
      .then((data) => setCaregiverData(data))
      .catch((error) => console.error("Error fetching caregiver:", error));
  }, [caregiverId]);

  useEffect(() => {
    if (!caregiverId) return;
    getNotifications(caregiverId).then((data) => {
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    });
  }, [caregiverId]);

  useEffect(() => {
    if (!userId) return;
    getuserbyid(userId)
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user:", error));
  }, [userId]);

  const handleMarkAsRead = () => {
    markAllAsRead3(caregiverId).then(() => {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setShowNotifications(false);
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const currentPage = pageTitles[activeNav] ?? { title: "", sub: "" };
  const { title, sub } = {
    ...currentPage,
    title:
      activeNav === "overview"
        ? `${getGreeting()}, ${userData?.name || "User"} 👋`
        : currentPage.title,
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
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="flex cursor-pointer items-center gap-2 mb-10 px-2">
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
          <div className="absolute left-[43px] -top-4 bottom-0 flex flex-col items-center z-0">
            <div className="w-2.5 h-2.5 rounded-full bg-white/40 flex-shrink-0" />
            <div className="flex-1 w-[2px] bg-white/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/40 flex-shrink-0" />
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                setActiveTab(item.id);
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
              {item.id === "messages" && msgUnread > 0 && (
                <span className="ml-auto bg-[#E8642A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                  {msgUnread}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-6 bg-white/10 rounded-2xl p-3 flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#E8642A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {userData?.name
              ?.split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase() || "U"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-semibold truncate">
              {userData?.name || "User"}
            </p>
            <p className="text-white/50 text-[10px]">Caregiver</p>
          </div>
          <button className="ml-auto text-white/50 hover:text-white transition-colors text-xs flex-shrink-0">
            →
          </button>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white text-sm"
        >
          <X className="w-3 h-3" />
        </button>
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
            <h1 className="text-xl font-bold text-gray-800 truncate">
              {title}
            </h1>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-10 cursor-pointer h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
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
                  <span className="absolute -top-1 -right-1 bg-[#E8622A] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute -right-15 top-12 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">
                      Notifications
                    </p>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {notifications.length} notifications
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto scrollbar-hide">
                    {" "}
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-sm text-gray-400">
                          no notifications yet
                        </p>
                      </div>
                    ) : (
                      notifications.map((n, i) => (
                        <div
                          key={i}
                          className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 items-start cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#E8622A"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                              />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {n.type === "booking_cancelled"
                                ? `Booking cancelled by ${n.patientName}`
                                : n.type === "booking_confirmed"
                                  ? `Booking confirmed with ${n.patientName}`
                                  : n.type === "booking_completed"
                                    ? `Session completed with ${n.patientName}`
                                    : `New booking from ${n.patientName}`}
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              {n.serviceType} • {n.date || ""}
                            </p>
                            <p className="text-xs font-semibold text-[#0D6B5E] mt-1">
                              ₹{n.totalAmount}
                            </p>
                          </div>

                          {!n.isRead && (
                            <div className="w-2 h-2 rounded-full bg-[#E8622A] mt-1.5 flex-shrink-0" />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div
                    onClick={handleMarkAsRead}
                    className="px-4 py-2.5 border-t border-gray-100"
                  >
                    <button className="text-xs text-[#0D6B5E] font-semibold hover:underline">
                      View all bookings →
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="w-9 h-9 rounded-full bg-[#E8642A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {userData?.name
                ?.split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase() || "U"}
            </div>
          </div>
        </motion.header>

        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto overflow-x-hidden min-w-0">
          {activeTab === "overview" && (
            <CaregiverOverview
              caregiverId={caregiverId}
              onNavigate={(id) => {
                setActiveTab(id);
                setActiveNav(id);
              }}
            />
          )}
          {activeTab === "client" && (
            <CaregiverClient
              caregiverId={caregiverId}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "profile" && (
            <CaregiverProfile caregiverId={caregiverId} />
          )}
          {activeTab === "earnings" && <CaregiverEarnings />}
          {activeTab === "settings" && <CaregiverSetting />}
          {activeTab === "messages" && (
            <CaregiverMessages
              caregiverId={caregiverId}
              onUnreadChange={setMsgUnread}
            />
          )}
        </main>
      </div>
    </div>
  );
}
