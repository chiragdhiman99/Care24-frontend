import { useEffect, useState ,memo} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import EmergencyModal from "./UserDashboardEmergency";
import {
  ClipboardList,
  CheckCircle,
  Users,
  CalendarDays,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";

const getInitials = (name) =>
  name
    ?.replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "C";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function Avatar({ initials, color, size = "md" }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-base",
  };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

const StatCard = memo(function StatCard({ stat, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl p-4 sm:p-5 cursor-default select-none"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mb-1 truncate">
            {stat.label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800">
            {stat.value}
          </p>
        </div>
        <div
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: stat.bg }}
        >
          {stat.icon}
        </div>
      </div>
    </motion.div>
  );
});

const CaregiverCard = memo(function CaregiverCard({ cg, index }) {
  const [booked, setBooked] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-4"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-3">
        <Avatar initials={cg.initials} color={cg.color} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-800 truncate">{cg.name}</p>
          <p className="text-xs text-gray-400 truncate">
            {cg.role} · {cg.exp} exp
          </p>
          <span
            className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: cg.color + "18", color: cg.color }}
          >
            {cg.badge}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {[
          { val: cg.rating, label: "Rating" },
          { val: cg.reviews, label: "Reviews" },
        ].map(({ val, label }) => (
          <div
            key={label}
            className="flex-1 bg-gray-50 rounded-xl p-2 text-center"
          >
            <p className="text-base font-bold text-gray-800 truncate">{val}</p>
            <p className="text-[10px] text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span
          className={`flex items-center gap-1.5 text-xs font-medium ${cg.available ? "text-emerald-600" : "text-gray-400"}`}
        >
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${cg.available ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`}
          />
          {cg.available ? "Available" : "Unavailable"}
        </span>
        <motion.button
          whileTap={{ scale: 0.93 }}
          disabled={!cg.available}
          onClick={() => {
            setBooked(!booked);
            navigate("/caregivers");
          }}
          className={`text-xs font-semibold cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 ${
            booked
              ? "bg-gray-100 text-gray-500"
              : cg.available
                ? "text-white"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
          style={
            booked ? {} : cg.available ? { backgroundColor: cg.color } : {}
          }
        >
          book now
        </motion.button>
      </div>
    </motion.div>
  );
});

const AppointmentRow = memo(function AppointmentRow({ appt, index }) {
  const statusColors = {
    Confirmed: "bg-emerald-100 text-emerald-600",
    Cancelled: "bg-red-100 text-red-500",
    Completed: "bg-blue-100 text-blue-500",
    Pending: "bg-orange-100 text-orange-500",
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default"
    >
      <Avatar initials={appt.initials} color={appt.color} size="md" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate">
          {appt.caregiver}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {appt.role} · {appt.date}
        </p>
      </div>
      <span
        className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
          statusColors[appt.status] ?? "bg-orange-100 text-orange-500"
        }`}
      >
        {appt.status}
      </span>
    </motion.div>
  );
});

export default function UserOverview({ searchQuery = "", bookingData = [] }) {
  const navigate = useNavigate();
  const [showEmergency, setShowEmergency] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const appointments = (bookingData || []).map((b, i) => ({
    id: b._id,
    caregiver: b.caregiverName ?? "Unknown",
    role: b.serviceType,
    date: b.date,
    time: b.duration,
    status: b.status?.charAt(0).toUpperCase() + b.status?.slice(1),
    initials: getInitials(b.caregiverName),
    color: ["#0D6B5E", "#E8642A", "#2563EB", "#7C3AED"][i % 4],
  }));

  const myCaregivers = (bookingData || [])
    .filter((b) => b.status === "completed")
    .filter(
      (b, i, self) =>
        self.findIndex((t) => t.caregiverId === b.caregiverId) === i,
    )
    .map((b, i) => ({
      id: b.caregiverId,
      name: b.caregiverName,
      role: b.serviceType,
      exp: b.caregiverExperience ? `${b.caregiverExperience} yrs` : "N/A",
      rating: b.caregiverRating ?? "—",
      reviews: b.caregiverReviews ?? "—",
      available: b.caregiverAvailable ?? false,
      badge: b.status === "confirmed" ? "Confirmed" : "Booked",
      initials: getInitials(b.caregiverName),
      color: ["#0D6B5E", "#E8642A", "#2563EB", "#7C3AED"][i % 4],
    }));

  const totalSpent = (bookingData || []).reduce(
    (sum, b) => sum + (b.totalAmount || 0),
    0,
  );

  const stats = [
    {
      label: "Active Bookings",
      value: String(appointments.length),
      icon: <ClipboardList className="w-5 h-5 text-[#0D6B5E]" />,
      bg: "#E8F5F2",
    },
    {
      label: "Total Sessions",
      value: String(
        bookingData?.filter((b) => b.status === "completed").length || 0,
      ),
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      bg: "#D1FAE5",
    },
    {
      label: "Caregivers Hired",
      value: String(new Set(appointments.map((a) => a.caregiver)).size),
      icon: <Users className="w-5 h-5 text-[#2563EB]" />,
      bg: "#EEF2FF",
    },
    {
      label: "Total Spent",
      value: `₹${totalSpent}`,
      icon: <IndianRupee className="w-5 h-5 text-[#D97706]" />,
      bg: "#FFFBEB",
    },
  ];

  const filtered = myCaregivers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
      >
        {stats.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} />
        ))}
      </motion.div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 text-base">My Caregivers</h2>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filtered.slice(0, 3).map((cg, i) => (
              <CaregiverCard key={cg.id} cg={cg} index={i} />
            ))}
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-12 gap-2 bg-white rounded-2xl"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                <Users className="w-8 h-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">
                  No caregivers yet
                </p>
                <p className="text-xs text-gray-400">
                  Book a caregiver to see them here
                </p>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.01 }}
            className="mt-5 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
            style={{
              background: "linear-gradient(120deg, #0D6B5E 0%, #1a8a7a 100%)",
              boxShadow: "0 8px 24px rgba(13,107,94,0.25)",
            }}
          >
            <div className="min-w-0">
              <p className="text-white font-bold text-sm">
                Need a new caregiver?
              </p>
              <p className="text-white/60 text-xs mt-0.5 truncate">
                Browse 200+ verified professionals near you
              </p>
            </div>
            <motion.button
              onClick={() => navigate("/caregivers")}
              whileTap={{ scale: 0.93 }}
              className="bg-white cursor-pointer text-[#0D6B5E] text-xs font-bold px-4 py-2 rounded-xl flex-shrink-0 hover:bg-[#E8642A] hover:text-white transition-colors duration-200"
            >
              Book Now
            </motion.button>
          </motion.div>
        </div>

        <div className="flex flex-col gap-5 min-w-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="bg-white rounded-2xl p-4 sm:p-5"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center justify-between mb-4 gap-2">
              <h2 className="font-bold text-gray-800 text-base">
                Appointments
              </h2>
              <span className="text-[10px] bg-[#E8F5F2] text-[#0D6B5E] font-semibold px-2 py-1 rounded-full flex-shrink-0">
                {appointments.length} upcoming
              </span>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col"
            >
              {appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <CalendarDays className="w-7 h-7 text-gray-300" />
                  <p className="text-sm font-medium text-gray-500">
                    No upcoming appointments
                  </p>
                  <p className="text-xs text-gray-400">
                    Your sessions will appear here
                  </p>
                </div>
              ) : (
                appointments
                  .slice(0, 2)
                  .map((appt, i) => (
                    <AppointmentRow key={appt.id} appt={appt} index={i} />
                  ))
              )}
            </motion.div>
          </motion.div>

          <motion.div
            onClick={() => setShowEmergency(true)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
            style={{
              background: "linear-gradient(120deg, #E8642A, #f0874a)",
              boxShadow: "0 6px 20px rgba(232,100,42,0.3)",
            }}
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-bold text-sm">Emergency Support</p>
              <p className="text-white/70 text-xs">
                24/7 nurse on-call available
              </p>
            </div>
            <span className="ml-auto text-white text-lg flex-shrink-0">→</span>
          </motion.div>
        </div>
      </div>

      <EmergencyModal
        isOpen={showEmergency}
        onClose={() => setShowEmergency(false)}
      />
    </>
  );
}
