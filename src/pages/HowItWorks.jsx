import { motion } from "framer-motion";
import { ClipboardList, Search, CreditCard, Mail } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.25 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};
const steps = [
  {
    number: "01",
    icon: <Search size={28} />,
    title: "Find a Caregiver",
    desc: "Browse through our verified caregivers — filter by specialization, experience, and availability near you.",
    tag: "Verified Profiles",
    tagColor: "#dff0e8",
    tagText: "#1a5c4a",
    side: "right",
  },
  {
    number: "02",
    icon: <ClipboardList size={28} />,
    title: "Fill Your Details",
    desc: "Tell us when you need the caregiver, for how long, and any specific requirements for your loved one.",
    tag: "Takes 2 Minutes",
    tagColor: "#fff3eb",
    tagText: "#e07b3a",
    side: "left",
  },
  {
    number: "03",
    icon: <CreditCard size={28} />,
    title: "Make Payment",
    desc: "Pay securely online — multiple payment options available. 100% safe and encrypted.",
    tag: "100% Secure",
    tagColor: "#dff0e8",
    tagText: "#1a5c4a",
    side: "right",
  },
  {
    number: "04",
    icon: <Mail size={28} />,
    title: "Get Confirmation",
    desc: "Instant confirmation email with your booking details and caregiver info — plus a receipt for your records.",
    tag: "Instant Receipt",
    tagColor: "#fff3eb",
    tagText: "#e07b3a",
    side: "left",
  },
];
export default function HowItWorks() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigate = useNavigate();
  return (
    <div className="min-h-screen font-sans" style={{ background: "#f5f0e6" }}>
      <Navbar />

      
      <motion.div
        className="text-center mt-14 pt-14 pb-10 px-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.span
          variants={item}
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
          style={{ background: "#dff0e8", color: "#1a5c4a" }}
        >
          <span className="w-2 h-2 rounded-full bg-[#1a5c4a]" />
          Simple 4-step process
        </motion.span>

        <motion.h1
          variants={item}
          className="text-5xl font-bold text-gray-900 leading-tight"
        >
          How{" "}
          <span style={{ color: "#1a5c4a", fontStyle: "italic" }}>Care24</span>{" "}
          Works
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-4 text-gray-500 max-w-md mx-auto text-base"
        >
          Getting a trusted caregiver for your loved one is now as easy as
          booking a cab — fast, reliable, and stress-free.
        </motion.p>
      </motion.div>

      
      <div className="max-w-4xl mx-auto px-6 pb-10 relative">
        
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px hidden lg:block"
          style={{ background: "#d4e8de", transform: "translateX(-50%)" }}
        />

        <motion.div
          className="flex flex-col gap-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={item}
              className={`flex flex-col lg:flex-row items-center gap-8 ${
                step.side === "left" ? "lg:flex-row-reverse" : ""
              }`}
            >
              
              <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm">
                
                <span
                  className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
                  style={{ background: step.tagColor, color: step.tagText }}
                >
                  {step.tag}
                </span>

                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              
              <div className="flex flex-col items-center gap-2 shrink-0 z-10">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
                  style={{ background: "#1a5c4a", color: "white" }}
                >
                  {step.icon}
                </div>
                <span
                  className="text-2xl font-black"
                  style={{ color: "#d4e8de" }}
                >
                  {step.number}
                </span>
              </div>

              
              <div className="flex-1 hidden lg:block" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      
      <motion.div
        className="max-w-2xl mx-auto px-6 pb-12"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.div
          variants={item}
          className="bg-white rounded-3xl p-8 shadow-sm text-center"
        >
          <p className="text-gray-600 text-base italic leading-relaxed">
            "We found the perfect nurse for my mother within 2 hours. The
            process was so smooth — I couldn't believe how easy it was."
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "#e07b3a" }}
            >
              SS
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-800">Sumit sharma</p>
              <p className="text-xs text-gray-400">Bangalore, Karnataka</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      
      <motion.div
        className="text-center pb-24 px-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.p variants={item} className="text-gray-500 text-sm mb-6">
          Trusted by 5,000+ families across India
        </motion.p>
        <motion.div variants={item} className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/caregivers")}
            className="px-8 py-3.5 rounded-full cursor-pointer text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ background: "#1a5c4a" }}
          >
            Book a Caregiver →
          </button>
          <button
            onClick={() => navigate("/caregivers")}
            className="px-8 py-3.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 hover:bg-[#1a5c4a] hover:text-white cursor-pointer"
            style={{ borderColor: "#1a5c4a", color: "#1a5c4a" }}
            onMouseEnter={(e) => (e.target.style.color = "white")}
            onMouseLeave={(e) => (e.target.style.color = "#1a5c4a")}
          >
            Explore Services
          </button>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
}

