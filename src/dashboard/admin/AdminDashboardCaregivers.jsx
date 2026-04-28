import { useEffect, useState } from "react";
import { getCaregivers } from "../../services/CaregiverService";
import CaregiverDetailModal from "./AdminDashboardCaregiverModal";
import { motion } from "framer-motion";

export default function AdminDashboardCaregivers() {
  const [caregivers, setCaregivers] = useState([]);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const Items_Per_Page = 5;

  const IMAGE_BASE = "https://care24-backend.onrender.com";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCaregivers();
      setCaregivers(data);
    };
    fetchData();
  }, []);

  const filtered = caregivers.filter((c) => {
    if (activeTab === "all") return true;
    return c.verificationStatus === activeTab;
  });

  const TotalPages = Math.ceil(filtered.length / Items_Per_Page);
  const startIndex = (currentPage - 1) * Items_Per_Page;
  const endIndex = startIndex + Items_Per_Page;
  const currentItems = filtered.slice(startIndex, endIndex);

  const countOf = (status) =>
    caregivers.filter((c) => c.verificationStatus === status).length;

  const handleStatusChange = (id, status) => {
    setCaregivers((prev) =>
      prev.map((c) =>
        c._id === id ? { ...c, verificationStatus: status } : c,
      ),
    );
  };

  const tabs = [
    { key: "all", label: "All", count: caregivers.length },
    { key: "pending", label: "Pending", count: countOf("pending") },
    { key: "active", label: "Active", count: countOf("active") },
    { key: "rejected", label: "Rejected", count: countOf("rejected") },
  ];

  const statusStyle = {
    active: "bg-green-50 text-green-700 border border-green-200",
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    rejected: "bg-red-50 text-red-600 border border-red-200",
    suspended: "bg-gray-100 text-gray-500 border border-gray-200",
  };

  return (
    <motion.div
      className="p-2 sm:p-6 -mt-5"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {" "}
      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setCurrentPage(1);
            }}
            className={`px-4 py-1.5 rounded-lg text-sm border transition cursor-pointer flex items-center gap-2 ${
              activeTab === tab.key
                ? "bg-[#0b7d6e] text-white border-[#0b7d6e]"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-medium">Caregiver</th>
              <th className="text-left px-4 py-3 font-medium">City</th>
              <th className="text-left px-4 py-3 font-medium">Experience</th>
              <th className="text-left px-4 py-3 font-medium">Rating</th>
              <th className="text-left px-4 py-3 font-medium">
                Specializations
              </th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((c, i) => (
              <tr
                key={c._id}
                className={`border-b border-gray-50 hover:bg-gray-50 transition ${i === filtered.length - 1 ? "border-none" : ""}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#e6f4ee] text-[#0b7d6e] flex items-center justify-center font-medium text-xs overflow-hidden flex-shrink-0">
                      {c.image ? (
                        <img
                          src={
                            c.image?.startsWith("http")
                              ? c.image
                              : `${IMAGE_BASE}${c.image}`
                          }
                          alt={c.name}
                          loading="lazy" decoding="async"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        c.name
                          ?.split(" ")
                          .slice(0, 2)
                          .map((w) => w[0]?.toUpperCase())
                          .join("")
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 text-gray-600">{c.city || "—"}</td>

                <td className="px-4 py-3 text-gray-600">{c.experience} yrs</td>

                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-gray-700">
                    <span className="text-yellow-400 text-xs">★</span>
                    {c.rating > 0 ? c.rating.toFixed(1) : "—"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(c.specializations || []).slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                      >
                        {s.replace("_", " ")}
                      </span>
                    ))}
                    {c.specializations?.length > 2 && (
                      <span className="text-xs text-gray-400">
                        +{c.specializations.length - 2}
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle[c.verificationStatus] || "bg-gray-100 text-gray-500"}`}
                  >
                    {c.verificationStatus}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCaregiver(c)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-gray-400 text-sm"
                >
                  No caregivers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 border-t border-gray-100 gap-2">
        <p className="text-xs text-gray-400">
          Showing {startIndex + 1} to {endIndex} of {caregivers.length}{" "}
          caregivers
        </p>

        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50"
          >
            ←
          </button>

          {Array.from({ length: TotalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 text-xs rounded-lg border cursor-pointer ${
                currentPage === i + 1
                  ? "bg-[#0b7d6e] text-white border-[#0b7d6e]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === TotalPages}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50"
          >
            →
          </button>
        </div>
      </div>
      <CaregiverDetailModal
        caregiver={selectedCaregiver}
        onClose={() => setSelectedCaregiver(null)}
        onStatusChange={handleStatusChange}
      />
    </motion.div>
  );
}
