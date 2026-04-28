import { getAllUsers } from "../../services/AuthService";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteUser } from "../../services/AuthService";
import { toast } from "sonner";

import {
  Search,
  Eye,
  Trash2,
  X,
  Mail,
  Phone,
  Calendar,
  Lock,
} from "lucide-react";

export default function AdminDashboardUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser2, setDeleteUser2] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDelete = async (userId) => {
    await deleteUser(userId);
    const updated = users.filter((user) => user._id !== userId);
    setUsers(updated);
    toast.success("User deleted successfully.");
    setDeleteUser2(null);
  };

  function getJoinDate(id) {
    const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="w-full">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">All Users</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {users.length} registered users
          </p>
        </div>

        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#0D6B5E] w-64 transition-all"
          />
        </div>
      </div>

      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          border: "1px solid #F0EDE8",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div className="hidden sm:grid grid-cols-[2fr_2.5fr_1.2fr_1.2fr_1fr] px-6 py-3 border-b border-gray-100">
          {["Name", "Email", "Phone", "Joined", "Actions"].map((heading) => (
            <span
              key={heading}
              className="text-[10px] font-bold uppercase tracking-widest text-gray-400"
            >
              {heading}
            </span>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            No users found
          </div>
        )}

        {filteredUsers.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col sm:grid sm:grid-cols-[2fr_2.5fr_1.2fr_1.2fr_1fr] px-6 py-4 border-b border-gray-50 hover:bg-[#f9f8f6] transition-colors gap-2 sm:gap-0 sm:items-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0D6B5E] flex items-center justify-center text-white font-bold text-sm">
                {user.name
                  ?.split(" ")
                  .slice(0, 2)
                  .map((w) => w[0]?.toUpperCase())
                  .join("")}{" "}
              </div>
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            </div>

            <p className="text-xs text-gray-500 truncate pr-4">{user.email}</p>

            <p className="text-xs text-gray-500">{user.phone || "—"}</p>

            <p className="text-xs text-gray-500">{getJoinDate(user._id)}</p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedUser(user)}
                title="View Details"
                className="w-8 h-8 rounded-lg cursor-pointer bg-[#E6F4F1] text-[#0D6B5E] flex items-center justify-center transform transition-transform duration-150 ease-out hover:scale-105 will-change-transform"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>

              <button
                onClick={() => setDeleteUser2(user)}
                title="Delete User"
                className="w-8 h-8 cursor-pointer rounded-lg bg-red-50 text-red-500 flex items-center justify-center transform transition-transform duration-150 ease-out hover:scale-105 will-change-transform"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}

        {filteredUsers.length > 0 && (
          <div className="px-6 py-3">
            <p className="text-xs text-gray-400">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(4px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#0D6B5E] flex items-center justify-center text-white font-bold text-2xl">
                    {selectedUser.name
                      ?.split(" ")
                      .slice(0, 2)
                      .map((w) => w[0]?.toUpperCase())
                      .join("")}{" "}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {selectedUser.name}
                    </h3>
                    <span className="text-xs text-gray-400 capitalize">
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-8 cursor-pointer h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F9F8F6] rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                    <Mail size={10} className="inline mr-1" /> Email
                  </p>
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {selectedUser.email}
                  </p>
                </div>
                <div className="bg-[#F9F8F6] rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                    <Phone size={10} className="inline mr-1" /> Phone
                  </p>
                  <p className="text-xs font-semibold text-gray-700">
                    {selectedUser.phone || "Not provided"}
                  </p>
                </div>
                <div className="bg-[#F9F8F6] rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                    <Calendar size={10} className="inline mr-1" /> Joined
                  </p>
                  <p className="text-xs font-semibold text-gray-700">
                    {getJoinDate(selectedUser._id)}
                  </p>
                </div>
                <div className="bg-[#F9F8F6] rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                    <Lock size={10} className="inline mr-1" /> Login Via
                  </p>
                  <p className="text-xs font-semibold text-gray-700">
                    {selectedUser.password === "google_auth"
                      ? "Google"
                      : "Email & Password"}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setDeleteUser2(selectedUser);
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteUser2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center"
            >
              <h3 className="text-center font-bold text-gray-800 text-lg mb-1">
                Delete Account
              </h3>
              <p className="text-center text-xs text-gray-400 mb-6">
                This action is permanent. Users data, bookings and profile will
                be deleted forever.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteUser2(null)}
                  className="flex-1 cursor-pointer py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteUser2._id)}
                  className="flex-1 cursor-pointer py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-all"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
