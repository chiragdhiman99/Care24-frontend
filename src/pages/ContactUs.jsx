import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ShieldCheck, Zap } from "lucide-react";
import Navbar from "../components/common/Navbar";
import { createUserQuery } from "../services/UserQueriesService";
import { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import { toast } from "sonner";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.25 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const infoCards = [
  {
    icon: <Phone size={22} />,
    title: "Call Us",
    line1: "+91 98765 43210",
    line2: "24/7 available",
  },
  {
    icon: <Mail size={22} />,
    title: "Email Us",
    line1: "support@care24.in",
    line2: "We reply within 24 hours",
  },
  {
    icon: <MapPin size={22} />,
    title: "Our Office",
    line1: "12, Greenfield Road",
    line2: "Bangalore, Karnataka 560001",
  },
  {
    icon: <Clock size={22} />,
    title: "Working Hours",
    line1: "Mon – Sat: 9 AM – 8 PM",
    line2: "Sunday: 10 AM – 4 PM",
  },
];

export default function ContactUs() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await createUserQuery(form);
    toast.success("Query submitted successfully.");
    setForm({
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    });
  };

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
          We're here to help
        </motion.span>

        <motion.h1
          variants={item}
          className="text-5xl font-bold text-gray-900 leading-tight"
        >
          Get In{" "}
          <span style={{ color: "#1a5c4a", fontStyle: "italic" }}>Touch</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-4 text-gray-500 max-w-md mx-auto text-base"
        >
          Have questions about our caregivers or services? We'd love to hear
          from you and help your family.
        </motion.p>
      </motion.div>

      
      <motion.div
        className="grid grid-cols-1 mt-10 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto px-6 mb-14"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {infoCards.map((card) => (
          <motion.div
            key={card.title}
            variants={item}
            className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "#dff0e8", color: "#1a5c4a" }}
            >
              {card.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {card.title}
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {card.line1}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{card.line2}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      
      <motion.div
        className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-5 gap-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        
        <motion.div
          variants={container}
          className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-sm"
        >
          
          <motion.h2
            variants={item}
            className="text-xl font-bold text-gray-800 mb-1"
          >
            Send us a message
          </motion.h2>

          
          <motion.p variants={item} className="text-sm text-gray-400 mb-7">
            Fill the form and our team will get back to you soon.
          </motion.p>

          <div className="flex flex-col gap-4">
            
            <motion.div
              variants={item}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ramesh Kumar"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a5c4a] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a5c4a] transition-colors"
                />
              </div>
            </motion.div>

            
            <motion.div variants={item}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ramesh@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a5c4a] transition-colors"
              />
            </motion.div>

            
            <motion.div variants={item}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Subject
              </label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none focus:border-[#1a5c4a] transition-colors bg-white"
              >
                <option value="">Select a topic</option>
                <option>Book a Caregiver</option>
                <option>General Inquiry</option>
                <option>Billing Support</option>
                <option>Feedback</option>
              </select>
            </motion.div>

            
            <motion.div variants={item}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Message
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us how we can help you..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a5c4a] transition-colors resize-none"
              />
            </motion.div>

            
            <motion.button
              variants={item}
              onClick={handleSubmit}
              whileHover={{ y: -2, boxShadow: "0 16px 40px rgba(0,0,0,0.10)" }}
              className="w-full py-3.5 rounded-2xl cursor-pointer active:scale-95 text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "#1a5c4a" }}
            >
              Send Message →
            </motion.button>
          </div>
        </motion.div>

        
        <motion.div
          variants={item}
          className="lg:col-span-2 flex flex-col gap-5"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497698.77490448696!2d77.30125374670206!3d12.954459543640922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1777009194185!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "224px" }}
            className="rounded-3xl"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />{" "}
          
          <div className="bg-white rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "#dff0e8" }}
            >
              <ShieldCheck className="w-6 h-6 text-[#1a5c4a]" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">
                Background Verified
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                All caregivers are checked and trusted
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "#dff0e8" }}
            >
              <ShieldCheck className="w-6 h-6 text-[#1a5c4a]" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Quick Response</p>
              <p className="text-xs text-gray-400 mt-0.5">
                We reply within 24 hours on all days
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
}

