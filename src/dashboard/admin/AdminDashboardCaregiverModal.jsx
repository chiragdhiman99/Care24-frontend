import { useState } from "react";
import { updateCaregiverStatus } from "../../services/CaregiverService";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function CaregiverDetailModal({
  caregiver,
  onClose,
  onStatusChange,
}) {
  const [reason, setReason] = useState("");

  if (!caregiver) return null;

  const isPending = caregiver.verificationStatus === "pending";
  const IMAGE_BASE = " https://care24-backend.onrender.com";

  const docs = [
    {
      label: "Aadhaar Card",
      url: caregiver.verificationDetails?.aadhaar?.url,
    },
    {
      label: "Nursing Certificate",
      url: caregiver.verificationDetails?.nursingCertificate?.url,
    },
    {
      label: "Police Clearance",
      url: caregiver.verificationDetails?.policeClearance?.url,
    },
  ];

  const handleRejectAction = async () => {
    const data = await updateCaregiverStatus(caregiver._id, {
      verificationStatus: "rejected",
      RejectionReason: reason,
    });
    onStatusChange(caregiver._id, "rejected");
    toast.success("Caregiver rejected successfully.");

    onClose();
  };
  const handleApproveAction = async () => {
    const data = await updateCaregiverStatus(caregiver._id, {
      verificationStatus: "active",
    });
    onStatusChange(caregiver._id, "active");
    toast.success("Caregiver approved successfully.");
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#0b7d6e] rounded-t-2xl">
          <h2 className="text-white font-medium text-base">
            Caregiver Details
          </h2>
          <button
            onClick={onClose}
            className="text-white text-lg cursor-pointer hover:opacity-70"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#e6f4ee] text-[#0b7d6e] flex items-center justify-center font-medium text-lg overflow-hidden flex-shrink-0">
              {caregiver.image ? (
                <img
                  src={
                    caregiver.image?.startsWith("http")
                      ? caregiver.image
                      : `${IMAGE_BASE}${caregiver.image}`
                  }
                  alt={caregiver.name}
                  loading="lazy" decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                caregiver.name?.charAt(0)
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800">{caregiver.name}</p>
              <p className="text-xs text-gray-400">{caregiver.email}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                  caregiver.verificationStatus === "active"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : caregiver.verificationStatus === "pending"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
                {caregiver.verificationStatus}
              </span>
            </div>
          </div>

          <hr className="border-gray-100" />

          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Phone</p>
              <p className="text-sm text-gray-800">{caregiver.phone || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">City</p>
              <p className="text-sm text-gray-800">{caregiver.city || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Experience</p>
              <p className="text-sm text-gray-800">
                {caregiver.experience} yrs
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Rating</p>
              <p className="text-sm text-gray-800">
                ⭐ {caregiver.rating > 0 ? caregiver.rating.toFixed(1) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Hourly Rate</p>
              <p className="text-sm text-gray-800">₹{caregiver.hourlyRate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Daily Rate</p>
              <p className="text-sm text-gray-800">₹{caregiver.dailyRate}</p>
            </div>
          </div>

          <hr className="border-gray-100" />

          
          {caregiver.bio && (
            <>
              <div>
                <p className="text-xs text-gray-400 mb-1">Bio</p>
                <p className="text-sm text-gray-600">{caregiver.bio}</p>
              </div>
              <hr className="border-gray-100" />
            </>
          )}

          
          <div>
            <p className="text-xs text-gray-400 mb-2">Specializations</p>
            <div className="flex flex-wrap gap-1">
              {(caregiver.specializations || []).map((s) => (
                <span
                  key={s}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {s.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>

          
          <div>
            <p className="text-xs text-gray-400 mb-2">Languages</p>
            <div className="flex flex-wrap gap-1">
              {(caregiver.languages || []).map((l) => (
                <span
                  key={l}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          
          <div>
            <p className="text-xs text-gray-400 mb-2">Documents</p>

            {isPending ? (
              <div className="space-y-2">
                {docs.map((doc) => (
                  <div
                    key={doc.label}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50"
                  >
                    <p className="text-sm text-gray-700">{doc.label}</p>
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs px-3 py-1 rounded-lg bg-[#0b7d6e] text-white cursor-pointer hover:bg-[#0a6d60]"
                      >
                        View Doc
                      </a>
                    ) : (
                      <span className="text-xs text-red-400">Not uploaded</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {docs.map((doc) => (
                  <div
                    key={doc.label}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50"
                  >
                    <p className="text-sm text-gray-700">{doc.label}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${doc.url ? "bg-green-50 text-green-600" : "bg-red-50 text-red-400"}`}
                    >
                      {doc.url ? "Uploaded" : "Not uploaded"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            {caregiver.verificationStatus !== "rejected" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Reason{" "}
                  <span className="text-gray-400 font-normal">
                    (required for rejection)
                  </span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Incomplete documents, unverified experience..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            )}

            <div className="flex gap-3 justify-end mt-3">
              {caregiver.verificationStatus !== "rejected" && (
                <button
                  onClick={handleRejectAction}
                  className="px-5 cursor-pointer active:scale-95 py-2 rounded-lg border border-red-400 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
              )}
              <button
                onClick={handleApproveAction}
                className="px-5 cursor-pointer active:scale-95 py-2 rounded-lg bg-teal-700 text-white text-sm font-medium hover:bg-teal-800 transition-colors"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

