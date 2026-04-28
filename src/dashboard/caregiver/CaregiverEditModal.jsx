import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateCaregiverProfile } from "../../services/CaregiverService";
import axios from "axios";
import { toast } from "sonner";

export default function EditProfileModal({
  isOpen,
  onClose,
  userData,
  caregiverData,
  onUpdate,
}) {
  const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const allShifts = [
    { key: "morning", label: "Morning", time: "6 AM – 12 PM" },
    { key: "afternoon", label: "Afternoon", time: "12 PM – 6 PM" },
    { key: "evening", label: "Evening", time: "6 PM – 12 AM" },
    { key: "night", label: "Night", time: "12 AM – 6 AM" },
  ];
  const [profileImage, setProfileImage] = useState(null);
  const [documents, setDocuments] = useState({
    aadhaar: null,
    policeClearance: null,
    nursingCertificate: null,
  });

  const specializationOptions = [
    "Elderly Care",
    "Post-Surgery",
    "Physiotherapy",
    "Dementia Care",
    "Palliative Care",
    "Child Care",
    "Mental Health",
    "Diabetes Care",
  ];
  const languageOptions = [
    "Hindi",
    "English",
    "Punjabi",
    "Bengali",
    "Tamil",
    "Telugu",
    "Marathi",
    "Gujarati",
  ];

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    image: null,
    name: userData?.name || "",
    phone: userData?.phone || "",
    email: userData?.email || "",
    city: "",
    experience: "",
    hourlyRate: "",
    dailyRate: "",
    bio: "",
    languages: [],
    serviceAreas: "",
    specializations: [],
    qualification: "",
    qualificationInstitute: "",
    jobTitle: "",
    company: "",
    duration: "",
    shifts: { morning: true, afternoon: true, evening: true, night: false },
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleArr = (key, val) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val)
        ? f[key].filter((x) => x !== val)
        : [...f[key], val],
    }));

  const toggleShift = (key) =>
    setForm((f) => ({ ...f, shifts: { ...f.shifts, [key]: !f.shifts[key] } }));

  const handleSubmit = async () => {
    if (
      !form.image ||
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.city ||
      !form.experience ||
      !form.hourlyRate ||
      !form.dailyRate ||
      !form.bio ||
      !form.languages ||
      !form.serviceAreas ||
      !form.specializations ||
      !form.workingDays
    ) {
      return;
    }
    const data = await updateCaregiverProfile(caregiverData._id, {
      ...form,
      verificationDetails: {
        aadhaar: { url: documents.aadhaar?.url || "" },
        policeClearance: { url: documents.policeClearance?.url || "" },
        nursingCertificate: { url: documents.nursingCertificate?.url || "" },
      },
    });
    toast.success("Profile updated successfully.");
    onUpdate(data);
    onClose();
  };

  const handleFileChange = async (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "file-upload");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dvk6auu6m/auto/upload",
      formData,
    );
    const fileurl = res.data.secure_url;

    setDocuments((prev) => ({
      ...prev,
      [docType]: { name: file.name, url: fileurl },
    }));
  };

  const handleInputImage = async (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setProfileImage(url);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "file-upload");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dvk6auu6m/auto/upload",
      formData,
    );
    const fileurl = res.data.secure_url;
    setForm((f) => ({ ...f, image: fileurl }));
  };

  if (!isOpen) return null;

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#0b7d6e] focus:ring-1 focus:ring-[#0b7d6e] bg-white";
  const labelCls = "text-xs text-gray-500 font-medium mb-1 block";
  const sectionTitle =
    "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden"
        >
          <div className="flex items-center bg-[#0b7d6e] justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 className="font-semibold text-white text-base">
                Edit Profile
              </h2>
              <p className="text-xs text-white">
                Update your caregiver information
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-500 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-4 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
              <div className="col-span-2">
                <p className={sectionTitle} style={{ marginLeft: "120px" }}>
                  Basic Info
                </p>
              </div>

              <div
                onClick={() => fileInputRef.current.click()}
                className="relative mx-auto sm:mx-0 w-20 h-20 cursor-pointer col-span-1"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="profile"
                    loading="lazy" decoding="async"
                    className="w-20 h-20 object-cover rounded-full hover:scale-105 transition-all duration-300"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full hover:scale-105 transition-all duration-300 bg-[#e6f4ee] border-2 border-[#0b7d6e] flex items-center justify-center overflow-hidden">
                    {form.name ? (
                      <span className="text-[#0b7d6e] text-2xl font-bold select-none">
                        {form.name
                          .trim()
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((w) => w[0].toUpperCase())
                          .join("")}
                      </span>
                    ) : (
                      <svg
                        width="44"
                        height="44"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle cx="12" cy="8" r="4" fill="#0b7d6e" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#0b7d6e" />
                      </svg>
                    )}
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => handleInputImage(e)}
                />

                <button className="absolute -bottom-1 -right-2 w-10 h-10 rounded-full bg-[#0b7d6e] flex items-center justify-center border-2 border-white cursor-pointer">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
              </div>

              <div>
                <label className={labelCls}>Full Name</label>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input
                  className={inputCls}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input
                  className={inputCls}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className={labelCls}>City</label>
                <input
                  className={inputCls}
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="e.g. Delhi, Mumbai"
                />
              </div>
              <div>
                <label className={labelCls}>Experience (years)</label>
                <input
                  className={inputCls}
                  value={form.experience}
                  onChange={(e) => set("experience", e.target.value)}
                  placeholder="e.g. 3"
                  type="number"
                  min="0"
                />
              </div>

              <div className="col-span-2 mt-1">
                <hr className="border-gray-100 mb-3" />
                <p className={sectionTitle}>Pricing</p>
              </div>
              <div>
                <label className={labelCls}>Hourly Rate (₹)</label>
                <input
                  className={inputCls}
                  value={form.hourlyRate}
                  onChange={(e) => set("hourlyRate", e.target.value)}
                  placeholder="e.g. 200"
                  type="number"
                  min="0"
                />
              </div>
              <div>
                <label className={labelCls}>Daily Rate (₹)</label>
                <input
                  className={inputCls}
                  value={form.dailyRate}
                  onChange={(e) => set("dailyRate", e.target.value)}
                  placeholder="e.g. 1400"
                  type="number"
                  min="0"
                />
              </div>

              <div className="col-span-2 mt-1">
                <hr className="border-gray-100 mb-3" />
                <p className={sectionTitle}>Bio</p>
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={3}
                  value={form.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  placeholder="Write a short description about yourself..."
                />
              </div>

              <div className="col-span-2 mt-1">
                <hr className="border-gray-100 mb-3" />
                <p className={sectionTitle}>Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {specializationOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleArr("specializations", s)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition cursor-pointer ${
                        form.specializations.includes(s)
                          ? "bg-[#0b7d6e] text-white border-[#0b7d6e]"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#0b7d6e]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-2 mt-1">
                <hr className="border-gray-100 mb-3" />
                <p className={sectionTitle}>Languages</p>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map((l) => (
                    <button
                      key={l}
                      onClick={() => toggleArr("languages", l)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition cursor-pointer ${
                        form.languages.includes(l)
                          ? "bg-[#0b7d6e] text-white border-[#0b7d6e]"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#0b7d6e]"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-2 mt-1">
                <hr className="border-gray-100 mb-3" />
                <p className={sectionTitle}>Service Areas</p>
                <input
                  className={inputCls}
                  value={form.serviceAreas}
                  onChange={(e) => set("serviceAreas", e.target.value)}
                  placeholder="e.g. South Delhi, Noida, Gurgaon"
                />
              </div>

              <div className="col-span-2 mt-1">
                <hr className="border-gray-100 mb-3" />
                <p className={sectionTitle}>Qualifications</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    className={inputCls}
                    value={form.qualification}
                    onChange={(e) => set("qualification", e.target.value)}
                    placeholder="e.g. BPT (Bachelor of Physiotherapy)"
                  />
                  <input
                    className={inputCls}
                    value={form.qualificationInstitute}
                    onChange={(e) =>
                      set("qualificationInstitute", e.target.value)
                    }
                    placeholder="e.g. Delhi University • 2020"
                  />
                </div>
              </div>

              <div className="col-span-2 mt-1">
                <hr className="border-gray-100 mb-3" />
                <p className={sectionTitle}>Work History</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    className={inputCls}
                    value={form.jobTitle}
                    onChange={(e) => set("jobTitle", e.target.value)}
                    placeholder="e.g. Physiotherapist"
                  />
                  <input
                    className={inputCls}
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    placeholder="e.g. Max Hospital Delhi"
                  />
                  <input
                    className={inputCls}
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                    placeholder="e.g. 2 years"
                  />
                </div>
              </div>

              <div className="col-span-2 mt-1">
                <hr className="border-gray-100 mb-3" />
                <p className={sectionTitle}>Working Shifts</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {allShifts.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => toggleShift(s.key)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl border transition cursor-pointer ${
                        form.shifts[s.key]
                          ? "bg-green-50 border-green-300 text-green-700"
                          : "bg-gray-50 border-gray-200 text-gray-400"
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-medium text-xs">{s.label}</p>
                        <p className="text-xs opacity-70">{s.time}</p>
                      </div>
                      <span className="text-xs">
                        {form.shifts[s.key] ? "✓" : "✗"}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mb-2">Working Days</p>
                <div className="flex gap-2 flex-wrap">
                  {allDays.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleArr("workingDays", day)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                        form.workingDays.includes(day)
                          ? "bg-[#0b7d6e] text-white border-[#0b7d6e]"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#0b7d6e]"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <br></br>

                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    Upload Documents * (Max 3)
                  </label>

                  <div className="mt-3 bg-white border border-dashed border-gray-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 gap-2 hover:border-[#0b7d6e] hover:bg-[#f0faf7] transition-all duration-200 cursor-pointer">
                    <label className="text-sm font-medium text-gray-700 cursor-pointer">
                      Aadhaar Card
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "aadhaar")}
                      className="text-xs text-gray-500 max-w-[250px] truncate file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#0b7d6e] file:text-white hover:file:bg-[#0a6d60] file:cursor-pointer"
                    />
                  </div>

                  <div className="mt-3 bg-white border border-dashed border-gray-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 gap-2 hover:border-[#0b7d6e] hover:bg-[#f0faf7] transition-all duration-200 cursor-pointer">
                    <label className="text-sm font-medium text-gray-700 cursor-pointer">
                      nursingCertificate document
                    </label>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e, "nursingCertificate")
                      }
                      className="text-xs text-gray-500  max-w-[250px] truncate file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#0b7d6e] file:text-white hover:file:bg-[#0a6d60] file:cursor-pointer"
                    />
                  </div>

                  <div className="mt-3 bg-white border border-dashed border-gray-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 gap-2 hover:border-[#0b7d6e] hover:bg-[#f0faf7] transition-all duration-200 cursor-pointer">
                    <label className="text-sm font-medium text-gray-700 cursor-pointer">
                      Police Clearance document
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "policeClearance")}
                      className="text-xs text-gray-500  max-w-[250px] truncate file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#0b7d6e] file:text-white hover:file:bg-[#0a6d60] file:cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 text-sm bg-[#0b7d6e] text-white rounded-xl hover:bg-[#0a6d60] transition cursor-pointer font-medium"
            >
              Save Profile
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
