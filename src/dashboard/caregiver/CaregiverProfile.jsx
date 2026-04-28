import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getuserbyid, getMe } from "../../services/AuthService";
import CaregiverEditModal from "./CaregiverEditModal";
import { getCaregiverbyId } from "../../services/CaregiverService";
import { Info, Check, X, FileText } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export default function CaregiverProfile({ caregiverId }) {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [caregiverData, setCaregiverData] = useState(null);
  useEffect(() => {
    getMe().then((data) => {
      setUserId(data.userId);
      getCaregiverbyId(data.caregiverId).then((res) => {
        setCaregiverData(res);
      });
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!userId) return;
    getuserbyid(userId).then((res) => setUserData(res));
  }, [userId]);

  const Verfidetails = caregiverData?.verificationDetails;

  const docsuploaded = Boolean(
    Verfidetails?.aadhaar?.url &&
    Verfidetails?.policeClearance?.url &&
    Verfidetails?.nursingCertificate?.url,
  );

  const verificationStatus = caregiverData?.verificationStatus || "pending";
  const verificationSteps = [
    {
      heading: "Profile Created",
      subHeading: "Basic info submitted",
      icon: "✓",
      bg_color: "bg-green-300 border border-green-200",
    },
    {
      heading: "Documents Uploaded",
      subHeading: "ID proof and certificates submitted",
      icon: docsuploaded ? "✓" : "✗",
      bg_color: docsuploaded
        ? "bg-green-300 border border-green-200"
        : "bg-red-50 border border-red-200",
    },
    {
      heading: "Admin Review",
      subHeading:
        verificationStatus === "active"
          ? "Admin approved your profile"
          : "Under review — 24-48 hrs",
      icon: verificationStatus === "active" ? "✓" : "✗",
      bg_color:
        verificationStatus === "active"
          ? "bg-green-300 border border-green-200"
          : "bg-red-300 border border-red-200",
    },
    {
      heading: "Account Activated",
      subHeading:
        verificationStatus === "active"
          ? "Your account is active"
          : "Your account is inactive",
      icon: verificationStatus === "active" ? "✓" : "✗",
      bg_color:
        verificationStatus === "active"
          ? "bg-green-300 border border-green-200"
          : "bg-red-300 border border-red-200",
    },
  ];

  const statusConfig = {
    pending: {
      label: "Pending",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      banner: "Verification under review — Admin will approve within 24–48 hrs",
      bannerBg: "bg-amber-50 border border-amber-200",
      bannerText: "text-amber-800",
    },
    active: {
      label: "active",
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      banner: "Your profile is verified. You can now accept bookings.",
      bannerBg: "bg-green-50 border border-green-200",
      bannerText: "text-green-800",
    },
    rejected: {
      label: "Rejected",
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
      banner: "Your verification was rejected. Please resubmit your documents.",
      bannerBg: "bg-red-50 border border-red-200",
      bannerText: "text-red-800",
    },
  };

  const status = statusConfig[verificationStatus];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="px-2 sm:p-6 space-y-4 w-full min-h-screen -mt-5">
      {" "}
      <motion.div
        {...fadeUp}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${status.bannerBg} ${status.bannerText}`}
      >
        <svg
          className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {status.banner}
      </motion.div>
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white relative border border-gray-100 rounded-2xl p-5 shadow-sm w-full"
      >
        <div className="absolute top-0 left-0 bg-[#0b7d6e] h-13 w-full rounded-2xl rounded-bl-none rounded-br-none"></div>

        <div className="flex items-center gap-4 mt-10 mb-6">
          <div className="w-20 h-20 absolute top-5 rounded-2xl bg-[#e6f4ee] text-[#0D6B5E] flex items-center justify-center font-semibold text-xl flex-shrink-0 overflow-hidden">
            {caregiverData?.image ? (
              <img
                src={caregiverData.image}
                alt="profile"
                loading="lazy" decoding="async"
                className="w-full h-full object-cover"
              />
            ) : (
              caregiverData?.name?.charAt(0) || "?"
            )}
          </div>
          <div className="flex-1 ml-24">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-gray-800 text-base">
                {caregiverData?.name || "Loading..."}
              </p>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium border ${status.bg} ${status.text} ${status.border}`}
              >
                {status.label}
              </span>
            </div>
            <p className="text-xs text-gray-400">Caregiver · Joined 2026</p>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="absolute right-2 top-1.5 text-sm border border-white bg-white text-black active:scale-85 px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Edit profile
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {[
            { label: "Phone", value: caregiverData?.phone || "—" },
            { label: "Email", value: caregiverData?.email || "—" },
            { label: "City", value: caregiverData?.city || "—" },
            {
              label: "Experience",
              value: caregiverData?.experience
                ? `${caregiverData.experience} yrs`
                : "—",
            },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800  truncate ">
                {item.value}
              </p>{" "}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-2">Specializations</p>
          <div className="flex flex-wrap gap-2">
            {(caregiverData?.specializations || []).length > 0 ? (
              caregiverData.specializations.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-[#f5f4ed] text-gray-600 px-3 py-1 rounded-full border border-gray-100"
                >
                  {tag}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-300 italic">—</p>
            )}
          </div>
        </div>

        <hr className="border-gray-100 mb-2" />

        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
            Pricing
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Hourly Rate</p>
              <p className="text-sm font-medium text-gray-800">
                {caregiverData?.hourlyRate
                  ? `₹${caregiverData.hourlyRate}`
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Daily Rate</p>
              <p className="text-sm font-medium text-gray-800">
                {caregiverData?.dailyRate ? `₹${caregiverData.dailyRate}` : "—"}
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-100 mb-3" />

        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
            About
          </p>
          <p className="text-sm text-gray-600 italic">
            {caregiverData?.bio || "No description added yet."}
          </p>
        </div>

        <hr className="border-gray-100 mb-2" />

        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
            Languages
          </p>
          <div className="flex flex-wrap gap-2">
            {(caregiverData?.languages || []).length > 0 ? (
              caregiverData.languages.map((lang) => (
                <span
                  key={lang}
                  className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-100"
                >
                  {lang}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-300 italic">—</p>
            )}
          </div>
        </div>

        <hr className="border-gray-100 mb-2" />

        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
            Service Areas
          </p>
          <div className="flex flex-wrap gap-2">
            {(caregiverData?.serviceAreas || []).length > 0 ? (
              caregiverData.serviceAreas.map((area) => (
                <span
                  key={area}
                  className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-100"
                >
                  {area}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-300 italic">
                No areas added yet.
              </p>
            )}
          </div>
        </div>

        <hr className="border-gray-100 mb-6" />

        <div>
          <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
            Working Shifts
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {" "}
            {caregiverData?.workingShifts ? (
              Object.entries(caregiverData.workingShifts).map(([key, val]) => (
                <div
                  key={key}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm ${
                    val.available
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div>
                    <p
                      className={`font-medium text-sm ${val.available ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </p>
                    <p className="text-xs text-gray-400">{val.timeRange}</p>
                  </div>
                  <span
                    className={`text-xs font-medium ${val.available ? "text-green-600" : "text-gray-400"}`}
                  >
                    {val.available ? (
                      <span className="flex items-center gap-1">
                        <Check size={11} /> Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <X size={11} /> Not available
                      </span>
                    )}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-300 italic col-span-2">—</p>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-2">Select a day</p>
            <div className="flex gap-2 flex-wrap">
              {days.map((day) => (
                <button
                  key={day}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 bg-gray-50 cursor-pointer hover:bg-[#e6f4ee] hover:border-[#0b7d6e] hover:text-[#0b7d6e] transition"
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      <CaregiverEditModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        userData={userData}
        caregiverData={caregiverData}
        onUpdate={(updated) => setCaregiverData(updated)}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        {" "}
        <div className="relative w-full shadow bg-white rounded-xl p-4">
          <h2 className="font-bold text-left absolute top-4 left-4">
            Verification progress
          </h2>
          <div className="mt-12 ml-3">
            {verificationSteps.map((step, index) => (
              <div key={index}>
                <div className="flex items-center gap-3 py-3">
                  <div
                    className={`w-7 h-7 rounded-full ${step.bg_color ? `${step.bg_color} text-white` : "bg-gray-100"} flex items-center justify-center flex-shrink-0 text-xs`}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{step.heading}</p>
                    <p className="text-xs text-gray-500">{step.subHeading}</p>
                  </div>
                </div>
                {index < verificationSteps.length - 1 && (
                  <div className="border-t border-gray-300 " />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 relative w-full shadow bg-white rounded-xl">
          <h2 className="font-bold text-left mb-2">Documents</h2>

          <div className="flex flex-col">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={Verfidetails?.aadhaar?.url ? "#22c55e" : "#ef4444"}
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Aadhar Card
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  Verfidetails?.aadhaar?.url
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {Verfidetails?.aadhaar?.url ? "Uploaded" : "Missing"}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={
                      Verfidetails?.nursingCertificate?.url
                        ? "#22c55e"
                        : "#ef4444"
                    }
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Nursing Certificate
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  Verfidetails?.nursingCertificate?.url
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {Verfidetails?.nursingCertificate?.url ? "Uploaded" : "Missing"}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={
                      Verfidetails?.policeClearance?.url ? "#22c55e" : "#ef4444"
                    }
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Police Clearance
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  Verfidetails?.policeClearance?.url
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {Verfidetails?.policeClearance?.url ? "Uploaded" : "Missing"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
