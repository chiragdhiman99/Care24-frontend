import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import UserOverview from "./UserOverview";
import AppointmentsTab from "./UserAppointments";
import HealthRecordsTab from "./UserHealthrecords";
import MessagesTab from "./UserMessages";
import SettingsTab from "./UserSettings";
import { getMe, getuserbyid } from "../../services/AuthService";
import { getBookingById } from "../../services/bookingservice";
import {
  getNotifications,
  markAllAsRead3,
} from "../../services/NotificationsService";
import {
  Home,
  CalendarDays,
  Pill,
  MessageCircle,
  Settings,
  CheckCircle,
  XCircle,
  Star,
  Clock,
  ClipboardList,
  Search,
  Bell,
} from "lucide-react";

import socket from "../../utils/socket";
import { toast } from "sonner";

const navItems = [
  { icon: <Home className="w-4 h-4" />, label: "Overview", id: "dashboard" },
  {
    icon: <CalendarDays className="w-4 h-4" />,
    label: "Appointments",
    id: "appointments",
  },
  { icon: <Pill className="w-4 h-4" />, label: "Health Records", id: "health" },
  {
    icon: <MessageCircle className="w-4 h-4" />,
    label: "Messages",
    id: "messages",
  },
  { icon: <Settings className="w-4 h-4" />, label: "Settings", id: "settings" },
];

const pageTitles = {
  dashboard: { title: "", sub: "Here's what's happening with your care today" },
  appointments: {
    title: "Appointments",
    sub: "Manage your upcoming and past sessions",
  },
  caregivers: { title: "Caregivers", sub: "Your assigned care professionals" },
  health: {
    title: "Health Records",
    sub: "Track your vitals and medical history",
  },
  messages: { title: "Messages", sub: "Chat with your caregivers" },
  settings: { title: "Settings", sub: "Manage your account and preferences" },
};

const getNotificationIcon = (type) => {
  switch (type) {
    case "booking_confirmed":
      return {
        bg: "bg-green-50",
        emoji: <CheckCircle className="w-5 h-5 text-green-500" />,
      };
    case "booking_cancelled":
      return {
        bg: "bg-red-50",
        emoji: <XCircle className="w-5 h-5 text-red-500" />,
      };
    case "booking_completed":
      return {
        bg: "bg-blue-50",
        emoji: <Star className="w-5 h-5 text-blue-500" />,
      };
    case "reminder":
      return {
        bg: "bg-yellow-50",
        emoji: <Clock className="w-5 h-5 text-yellow-500" />,
      };
    default:
      return {
        bg: "bg-orange-50",
        emoji: <ClipboardList className="w-5 h-5 text-orange-500" />,
      };
  }
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
};

export default function UserDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [unread, setunread] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      if (userId) socket.emit("userOnline", userId);
    });
  }, [userId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  useEffect(() => {
    socket.on("bookingCancelled", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off("bookingCancelled");
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };
  const { title, sub } = {
    ...pageTitles[activeNav],
    title:
      activeNav === "dashboard"
        ? `${getGreeting()}, ${userData?.name || "User"} 👋`
        : pageTitles[activeNav].title,
  };

  useEffect(() => {
    getMe()
      .then((data) => {
        setUserId(data.userId);
        socket.emit("userOnline", data.userId);
        socket.emit("joinUserRoom", data.userId);
      })
      .catch(() => toast.error("You are not logged in"));
  }, []);

  useEffect(() => {
    if (!userId) return;
    getNotifications(userId).then((data) => {
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    getuserbyid(userId)
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user by ID:", error));
  }, [userId]);

  useEffect(() => {
    if (!userData?._id) return;
    getBookingById(userData._id)
      .then((data) => {
        setBookingData(data);

        setUnreadCount(sorted.filter((b) => !b.isRead).length);
      })
      .catch((error) => console.error("Error fetching booking by ID:", error));
  }, [userData?._id]);

  useEffect(() => {
    socket.on("newBooking", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    socket.on("appointmentReminder", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    return () => {
      socket.off("newBooking");
      socket.off("appointmentReminder");
    };
  }, []);

  const handleMarkAllRead = async () => {
    await markAllAsRead3(userId);
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setShowNotifications(false);
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
        className={`flex flex-col w-60 min-h-screen bg-[#0D6B5E] fixed top-0 left-0 z-50 py-6 px-4 flex-shrink-0 transition-transform duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ boxShadow: "4px 0 24px rgba(13,107,94,0.18)" }}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white text-sm"
        >
          ✕
        </button>

        <div
          onClick={() => (window.location.href = "/")}
          className="flex cursor-pointer items-center gap-2 mb-10 px-2"
        >
          <Link
            to="/"
            className="font-fraunces text-2xl font-bold text-[#0B7D6E]"
          >
            <span
              style={{ fontFamily: "'DM Sans', sans-serif", color: "white" }}
            >
              Care
            </span>
            <span>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#E8622A",
                }}
              >
                24
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex flex-col gap-0 flex-1 relative">
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
              {item.id === "messages" && unread > 0 && (
                <span className="ml-auto bg-[#E8642A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                  {unread}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-6 bg-white/10 rounded-2xl p-3 flex items-center gap-3 min-w-0">
          {userData?.photo ? (
            <img
              src={userData?.photo}
              referrerPolicy="no-referrer"
              alt="profile"
              loading="lazy"
              decoding="async"
              className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#E8642A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {userData?.name
                ?.split(" ")
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("") || "U"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-semibold truncate">
              {userData?.name || "User"}
            </p>
            <p className="text-white/50 text-[10px]">Premium Member</p>
          </div>
          <button className="ml-auto text-white/50 hover:text-white transition-colors text-xs flex-shrink-0">
            →
          </button>
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
            <h1 className="text-xl font-bold text-gray-800 truncate">
              {title}
            </h1>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {activeNav === "dashboard" && (
              <div className="relative hidden sm:block">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  <Search className="absolute  top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search caregivers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#0D6B5E]/20 w-44 transition-all focus:w-56"
                />
              </div>
            )}

            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-9 cursor-pointer h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
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

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -right-14 top-12 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800">
                          Notifications
                        </p>
                        {unreadCount > 0 && (
                          <span className="bg-[#E8622A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-[#0D6B5E] font-semibold hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto scrollbar-hide">
                      {notifications.length === 0 ? (
                        <div className="py-10 text-center">
                          <div className="text-3xl mb-2">🔔</div>
                          <p className="text-sm font-medium text-gray-500">
                            No notifications yet
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Your booking updates will appear here
                          </p>
                        </div>
                      ) : (
                        notifications.map((n, i) => {
                          const { bg, emoji } = getNotificationIcon(n.type);
                          return (
                            <div
                              key={i}
                              className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 items-start cursor-pointer ${!n.isRead ? "bg-green-50/30" : ""}`}
                            >
                              <div
                                className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 text-base`}
                              >
                                {emoji}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                  {n.type === "booking_confirmed"
                                    ? "Booking Confirmed "
                                    : n.type === "booking_cancelled"
                                      ? n.cancelledBy === "caregiver"
                                        ? `Booking cancelled by ${n.caregiverName}`
                                        : `You cancelled your booking`
                                      : n.type === "reminder"
                                        ? "Appointment Reminder "
                                        : "Booking Updated"}
                                </p>
                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                  {n.type === "reminder"
                                    ? n.message
                                    : `${n.caregiverName} • ${n.serviceType}`}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-xs font-semibold text-[#0D6B5E]">
                                    ₹{n.totalAmount}
                                  </p>
                                  <p className="text-[10px] text-gray-400">
                                    {timeAgo(n.createdAt)}
                                  </p>
                                </div>
                              </div>

                              {!n.isRead && (
                                <div className="w-2 h-2 rounded-full bg-[#E8622A] mt-1.5 flex-shrink-0" />
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
                      <button
                        onClick={() => {
                          setActiveNav("appointments");
                          setShowNotifications(false);
                          handleMarkAllRead();
                        }}
                        className="text-xs text-[#0D6B5E] font-semibold hover:underline w-full text-center"
                      >
                        View all bookings →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {userData?.photo ? (
              <img
                src={userData.photo}
                referrerPolicy="no-referrer"
                alt="profile"
                loading="lazy"
                decoding="async"
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="w-9 h-9 rounded-full bg-[#E8642A] items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ display: userData?.photo ? "none" : "flex" }}
            >
              {userData?.name
                ?.split(" ")
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("") || "U"}
            </div>
          </div>
        </motion.header>

        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto overflow-x-hidden min-w-0">
          {activeNav === "dashboard" && (
            <UserOverview searchQuery={searchQuery} bookingData={bookingData} />
          )}
          {activeNav === "appointments" && (
            <AppointmentsTab bookingData={bookingData} />
          )}
          {activeNav === "health" && <HealthRecordsTab />}
          {activeNav === "messages" && (
            <MessagesTab onUnreadChange={setunread} />
          )}
          {activeNav === "settings" && <SettingsTab />}
          {activeNav === "caregivers" && (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              Caregivers tab coming soon...
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
