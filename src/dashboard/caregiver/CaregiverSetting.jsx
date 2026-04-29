import { useState } from "react";
import { motion } from "framer-motion";
import { getMe } from "../../services/AuthService";
import { getuserbyid } from "../../services/AuthService";
import { useEffect } from "react";
import { updateUser } from "../../services/AuthService";
import { deleteUser } from "../../services/AuthService";
import { logout } from "../../services/AuthService";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4 },
  }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${value ? "bg-[#0D6B5E]" : "bg-gray-200"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${value ? "left-5" : "left-0.5"}`}
      />
    </button>
  );
}

export default function SettingsTab() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [notifs, setNotifs] = useState({
    newClientRequests: true,
    newMessages: true,
    scheduleReminders: true,
    promotions: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showAvailability: true,
    twoFactor: false,
  });
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDelete = async () => {
    setShowDeleteModal(false);
    try {
      await deleteUser(userId);
      await logout();
      localStorage.clear();
      toast.success("Account deleted successfully.");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    getMe()
      .then((data) => setUserId(data.userId))
      .catch(() =>
        toast.error(
          "You are not logged in. Please log in to access this page.",
        ),
      );
  }, []);

  useEffect(() => {
    if (!userId) return;
    getuserbyid(userId)
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user by ID:", error));
  }, [userId]);

  useEffect(() => {
    if (!userData) return;
    setProfile({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      city: userData.city || "",
    });

    setNotifs({
      newClientRequests:
        userData.notificationPreferences?.newClientRequests ?? true,
      newMessages: userData.notificationPreferences?.newMessages ?? true,
      scheduleReminders:
        userData.notificationPreferences?.scheduleReminders ?? true,
      promotions: userData.notificationPreferences?.promotions ?? false,
    });
  }, [userData]);

  const handleSave = () => {
    try {
      updateUser(userId, {
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
      })
        .then((data) => {
          setUserData(data);
          toast.success("Profile updated successfully.");
          setSaved(true);
          setIsEditing(false);
          setTimeout(() => setSaved(false), 2000);
        })
        .catch((error) => console.error("Error updating user:", error));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <motion.div
        variants={fadeUp}
        custom={0}
        className="bg-white rounded-2xl p-5"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
      >
        <h2 className="font-bold text-gray-800 text-base mb-5">
          Profile Details
        </h2>

        <div className="flex items-center gap-4 mb-5">
          {userData?.photo ? (
            <img
              src={userData.photo}
              alt={userData.name}
              loading="lazy" decoding="async"
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#E8642A] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {userData?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800">{userData?.name}</p>

            <p className="text-xs text-gray-400">Caregiver</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { label: "Full Name", key: "name" },
            { label: "Email", key: "email", readonly: true },
            { label: "Phone", key: "phone" },
            { label: "City", key: "city" },
          ].map(({ label, key, readonly }) => (
            <div key={key}>
              <label className="text-xs text-gray-400 font-medium mb-1 block">
                {label}
              </label>
              <input
                type="text"
                disabled={!isEditing || readonly}
                value={profile[key]}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, [key]: e.target.value }))
                }
                className="w-full bg-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#0D6B5E]/20"
              />
            </div>
          ))}
        </div>

        {isEditing ? (
          <button
            onClick={handleSave}
            className={`mt-5 cursor-pointer w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-[#0D6B5E] text-white hover:bg-[#0a5a4e]"
            }`}
          >
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-5 cursor-pointer w-full py-2.5 rounded-xl text-sm font-bold border border-[#0D6B5E] text-[#0D6B5E] hover:bg-[#0D6B5E] hover:text-white transition-all"
          >
            Edit Profile
          </button>
        )}
      </motion.div>

      <div className="flex flex-col gap-5">
        <motion.div
          variants={fadeUp}
          custom={1}
          className="bg-white rounded-2xl p-5"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <h2 className="font-bold text-gray-800 text-base mb-4">
            Notifications
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                label: "New Client Requests",
                sub: "Get notified when a client books you",
                key: "newClientRequests",
              },
              {
                label: "New Messages",
                sub: "Alert when a client messages you",
                key: "newMessages",
              },
              {
                label: "Schedule Reminders",
                sub: "Reminders before your upcoming sessions",
                key: "scheduleReminders",
              },
              {
                label: "Promotions & Offers",
                sub: "Platform deals and announcements",
                key: "promotions",
              },
            ].map(({ label, sub, key }) => (
              <div
                key={key}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
                <Toggle
                  value={notifs[key]}
                  onChange={(v) => {
                    setNotifs((n) => ({ ...n, [key]: v }));
                    updateUser(userId, {
                      notificationPreferences: { ...notifs, [key]: v },
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={2}
          className="bg-white rounded-2xl p-5"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <h2 className="font-bold text-gray-800 text-base mb-1">
            Delete Account
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Once you delete your account, all your data will be permanently
            removed. This action cannot be undone.
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full cursor-pointer py-2.5 rounded-xl text-sm font-bold bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white transition-all"
          >
            Delete My Account
          </button>
        </motion.div>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
            >
              <h3 className="text-center font-bold text-gray-800 text-lg mb-1">
                Delete Account?
              </h3>
              <p className="text-center text-xs text-gray-400 mb-6">
                This action is permanent. Your data, bookings and profile will
                be deleted forever.
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    handleDelete();
                  }}
                  className="w-full cursor-pointer py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-all"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
