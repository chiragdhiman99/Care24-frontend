import { motion, AnimatePresence } from "framer-motion";
import { Phone, Truck, HeartHandshake, AlertTriangle } from "lucide-react";
const emergencyContacts = [
  {
    name: "National Health Helpline",
    number: "104",
    icon: <Phone className="w-5 h-5 text-red-500" />,
    desc: "Free · 24/7",
    bg: "bg-red-50",
  },
  {
    name: "Ambulance",
    number: "108",
    icon: <Truck className="w-5 h-5 text-orange-500" />,
    desc: "Emergency",
    bg: "bg-orange-50",
  },
  {
    name: "Mental Health Helpline",
    number: "1800-599-0019",
    icon: <HeartHandshake className="w-5 h-5 text-blue-500" />,
    desc: "Free · 24/7",
    bg: "bg-blue-50",
  },
];
function EmergencyModal({ isOpen, onClose }) {
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
                  background: "linear-gradient(120deg, #E8642A, #f0874a)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {" "}
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </span>
                  <p className="text-white font-bold text-sm">
                    Emergency Support
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 cursor-pointer rounded-full bg-white/20 flex items-center justify-center text-white text-xs hover:bg-white/30 transition"
                >
                  ✕
                </button>
              </div>

              
              <div className="p-5 flex flex-col gap-3">
                <p className="text-sm text-gray-500 text-center">
                  Immediate help is just a call away .
                  <span className="font-semibold text-gray-700">24/7</span>.
                </p>

                {emergencyContacts.map((contact) => (
                  <a
                    key={contact.number}
                    href={`tel:${contact.number}`}
                    className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${contact.bg} flex items-center justify-center flex-shrink-0`}
                    >
                      {contact.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">
                        {contact.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Dial {contact.number} · {contact.desc}
                      </p>
                    </div>
                    <span className="text-[#E8642A] font-bold text-sm">
                      Call →
                    </span>
                  </a>
                ))}

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-gray-50 transition border border-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default EmergencyModal;

