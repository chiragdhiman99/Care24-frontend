import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { healthrecords, gethealthrecords } from "../../services/HealthService";
import { getMe } from "../../services/AuthService";
import { createVitals, getVitals } from "../../services/VitalsService";
import EmergencyModal from "./UserDashboardEmergency";
import { toast } from "sonner";
import {
  FolderOpen,
  Droplets,
  Pill,
  Bone,
  HeartPulse,
  FileText,
  AlertTriangle,
} from "lucide-react";

function UploadRecordModal({ isOpen, onClose, userId, onNewRecord }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    type: "",
    date: "",
    doctor: "",
    notes: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async () => {
    if (!form.file || !form.title || !form.type || !form.date || !form.doctor) {
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", form.file);
    formData.append("upload_preset", "file-upload");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dvk6auu6m/auto/upload",
      formData,
    );

    const fileurl = res.data.secure_url;

    const record = {
      userId: userId,
      title: form.title,
      type: form.type,
      date: form.date,
      doctor: form.doctor,
      notes: form.notes,
      fileUrl: fileurl,
    };

    const record2 = await healthrecords(record);
    onNewRecord(record2);
    toast.success("Record uploaded successfully.");
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4 overflow-y-auto"
          >
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden my-auto">
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{
                  background: "linear-gradient(120deg, #0D6B5E, #1a8a7a)",
                }}
              >
                <p className="text-white font-bold text-sm">
                  Upload Health Record
                </p>
                <button
                  onClick={onClose}
                  className="w-7 h-7 cursor-pointer rounded-full bg-white/20 flex items-center justify-center text-white text-xs hover:bg-white/30 transition"
                >
                  ✕
                </button>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  {" "}
                  <div>
                    <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Title *
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Blood Test Report"
                      className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0D6B5E] transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Record Type *
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0D6B5E] transition bg-white"
                    >
                      <option value="">Select Type</option>
                      {[
                        "Lab Report",
                        "Prescription",
                        "Session Notes",
                        "Care Plan",
                        "Other",
                      ].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="mt-1 w-full border cursor-pointer border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0D6B5E] transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Doctor / Hospital
                      <span className="normal-case text-gray-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      name="doctor"
                      value={form.doctor}
                      onChange={handleChange}
                      placeholder="e.g. Dr. Kapoor / City Hospital"
                      className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0D6B5E] transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    Notes{" "}
                    <span className="normal-case text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Any additional notes..."
                    rows={2}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0D6B5E] transition resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    Upload File *
                  </label>
                  <label className="mt-1 w-full border-2 border-dashed border-gray-200 rounded-xl px-4 py-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#0D6B5E] transition">
                    <span className="text-2xl mb-1">📁</span>
                    <span className="text-xs text-gray-400">
                      {form.file
                        ? form.file.name
                        : "Click to choose PDF or Image"}
                    </span>
                    <input
                      type="file"
                      name="file"
                      accept=".pdf,image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={onClose}
                    className="flex-1 cursor-pointer py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-gray-50 transition border border-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-2.5 cursor-pointer rounded-xl text-sm font-bold text-white bg-[#0D6B5E] hover:bg-[#0a5a4e] transition disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      "Upload Record"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function VitalsModal({ isOpen, onClose, userId, onVitalsSaved }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    bloodPressure: "",
    heartRate: "",
    bloodSugar: "",
    spO2: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (
      !form.bloodPressure ||
      !form.heartRate ||
      !form.bloodSugar ||
      !form.spO2
    ) {
      return;
    }
    setLoading(true);
    const VitalsData = await createVitals({ ...form, userId });

    onVitalsSaved(VitalsData);

    toast.success("Vitals saved successfully.");
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{
                  background: "linear-gradient(120deg, #0D6B5E, #1a8a7a)",
                }}
              >
                <p className="text-white font-bold text-sm">Add Vitals</p>
                <button
                  onClick={onClose}
                  className="w-7 h-7 cursor-pointer rounded-full bg-white/20 flex items-center justify-center text-white text-xs hover:bg-white/30 transition"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 flex flex-col gap-3">
                {[
                  {
                    name: "bloodPressure",
                    label: "Blood Pressure",
                    placeholder: "e.g. 118/76",
                    unit: "mmHg",
                  },
                  {
                    name: "heartRate",
                    label: "Heart Rate",
                    placeholder: "e.g. 72",
                    unit: "bpm",
                  },
                  {
                    name: "bloodSugar",
                    label: "Blood Sugar",
                    placeholder: "e.g. 104",
                    unit: "mg/dL",
                  },
                  {
                    name: "spO2",
                    label: "SpO2",
                    placeholder: "e.g. 98",
                    unit: "%",
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      {field.label}
                    </label>
                    <div className="flex items-center mt-1 border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0D6B5E] transition">
                      <input
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="flex-1 px-4 py-2.5 text-sm outline-none"
                      />
                      <span className="px-3 text-xs text-gray-400 font-medium bg-gray-50 h-full flex items-center border-l border-gray-200 py-2.5">
                        {field.unit}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 mt-1">
                  <button
                    onClick={onClose}
                    className="flex-1 cursor-pointer py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-gray-50 transition border border-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-2.5 cursor-pointer rounded-xl text-sm font-bold text-white bg-[#0D6B5E] hover:bg-[#0a5a4e] transition disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Vitals"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function HealthRecordsTab() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [records, setRecords] = useState([]);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [booking, setBooking] = useState(null);
  const [vitals, setVitals] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const typeIcons = {
    "Lab Report": {
      icon: <Droplets className="w-6 h-6 text-red-500" />,
      bg: "#FEE2E2",
    },
    Prescription: {
      icon: <Pill className="w-6 h-6 text-purple-600" />,
      bg: "#EDE9FE",
    },
    "Session Notes": {
      icon: <Bone className="w-6 h-6 text-green-600" />,
      bg: "#DCFCE7",
    },
    "Care Plan": {
      icon: <HeartPulse className="w-6 h-6 text-emerald-600" />,
      bg: "#D1FAE5",
    },
    Other: {
      icon: <FileText className="w-6 h-6 text-gray-500" />,
      bg: "#F3F4F6",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = await getMe();
      setUserId(user.userId);
      const data = await gethealthrecords(user.userId);
      setRecords(data);

      const VitalsData = await getVitals(user.userId);
      setVitals(VitalsData[0]);

      if (user.userId) {
        const allBookings = await getBookingById(user.userId);
        const confirmed = allBookings?.find(
          (booking) => booking.status === "confirmed",
        );

        if (confirmed) {
          setBooking({
            nurseName: confirmed.caregiverName,
            nursePhone: confirmed.caregiverPhone ?? "N/A",
          });
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 text-base">Health Records</h2>
          <button
            onClick={() => setShowUploadModal(true)}
            className="text-xs cursor-pointer text-[#0D6B5E] font-semibold hover:underline"
          >
            + Upload
          </button>
        </div>

        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-5xl mb-4">
              <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            </div>
            <p className="font-bold text-gray-700 text-lg">No records yet!</p>
            <p className="text-gray-400 text-sm text-center mt-1 mb-6">
              Keep all your medical files in one place, hassle-free.
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-[#2d9486] cursor-pointer hover:bg-[#0D6B5E] transition-all duration-300 text-white px-6 py-3 rounded-xl font-semibold text-sm"
            >
              + Upload Your First Record
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {records.map((r) => {
              const t = typeIcons[r.type] || typeIcons["Other"];
              return (
                <motion.div
                  key={r._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-4 flex items-center gap-4"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: t.bg }}
                  >
                    {t.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm capitalize truncate">
                      {r.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {r.type} ·{" "}
                      {new Date(r.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <a
                    href={r.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#0D6B5E] font-semibold hover:underline flex-shrink-0"
                  >
                    View →
                  </a>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <UploadRecordModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        userId={userId}
        onNewRecord={(newrecord) => setRecords((prev) => [newrecord, ...prev])}
      />

      <div
        className="bg-white rounded-2xl p-5 mt-10 h-70 "
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 text-base">Latest Vitals</h2>
          <button
            onClick={() => setShowVitalsModal(true)}
            className="text-xs cursor-pointer text-[#0D6B5E] font-semibold hover:underline"
          >
            + Update
          </button>
        </div>

        {!vitals ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-4xl mb-3">
              <HeartPulse className="w-10 h-10 text-red-400 mx-auto mb-3" />
            </div>
            <p className="font-bold text-gray-700 text-sm">
              No vitals recorded yet!
            </p>
            <p className="text-gray-400 text-xs text-center mt-1 mb-4">
              Track your health by adding your first reading.
            </p>
            <button
              onClick={() => setShowVitalsModal(true)}
              className="bg-[#2d9486] hover:bg-[#0D6B5E] transition-all duration-300 text-white px-5 py-2.5 rounded-xl font-semibold text-xs cursor-pointer"
            >
              + Add Vitals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Blood Pressure",
                value: vitals.bloodPressure,
                unit: "mmHg",
                color: "#0D6B5E",
              },
              {
                label: "Heart Rate",
                value: vitals.heartRate,
                unit: "bpm",
                color: "#E8642A",
              },
              {
                label: "Blood Sugar",
                value: vitals.bloodSugar,
                unit: "mg/dL",
                color: "#2563EB",
              },
              {
                label: "SpO2",
                value: vitals.spO2,
                unit: "%",
                color: "#059669",
              },
            ].map((v) => (
              <div
                key={v.label}
                className="rounded-xl p-3 text-center"
                style={{ backgroundColor: v.color + "12" }}
              >
                <p className="text-xl font-bold" style={{ color: v.color }}>
                  {v.value}
                </p>
                <p className="text-[10px] text-gray-400">{v.unit}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {v.label}
                </p>
              </div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => setShowEmergencyModal(true)}
          className="rounded-2xl p-4 mt-16 flex items-center gap-3 cursor-pointer min-w-0"
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

      <VitalsModal
        isOpen={showVitalsModal}
        onClose={() => setShowVitalsModal(false)}
        userId={userId}
        onVitalsSaved={(v) => setVitals(v)}
      />
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        booking={booking}
      />
    </div>
  );
}
