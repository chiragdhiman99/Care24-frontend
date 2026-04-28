import React from "react";
import Navbar from "../components/common/Navbar";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Footer from "../components/common/Footer";
import {
  Heart,
  CheckCircle,
  Zap,
  Eye,
  Award,
  Building2,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router";


const stats = [
  { number: "5,000+", label: "Families Served" },
  { number: "500+", label: "Verified Caregivers" },
  { number: "20+", label: "Cities Covered" },
  { number: "4.8★", label: "Average Rating" },
];

const team = [
  {
    initials: "SK",
    name: "Sanjeev Kumar",
    role: "Founder & CEO",
    bio: "With over 15 years of experience in healthcare services, Ramesh founded Care24 after facing challenges in finding reliable home care for his father. His vision is to make quality elder care accessible and trustworthy for every family.",
    bg: "bg-[#1a6b4a]",
  },
  {
    initials: "SA",
    name: "Dr. Sunita Arora",
    role: "Medical Director",
    bio: "MBBS, MD with extensive clinical experience. Dr. Arora oversees caregiver training and ensures all services meet strict medical and safety standards. Former department head at a leading multi-speciality hospital.",
    bg: "bg-[#c8623a]",
  },
  {
    initials: "PM",
    name: "Priya Mehta",
    role: "Head of Operations",
    bio: "Leads a nationwide network of 500+ caregivers. Priya specializes in operations management and ensures every family is matched with the right caregiver based on their needs.",
    bg: "bg-[#0f4a32]",
  },
];
const values = [
  {
    icon: <Heart className="w-6 h-6 text-[#1a6b4a]" />,
    title: "Compassion",
    desc: "We treat every elder like our own family member.",
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-[#1a6b4a]" />,
    title: "Trust",
    desc: "Background-verified, trained, and reliable caregivers only.",
  },
  {
    icon: <Zap className="w-6 h-6 text-[#1a6b4a]" />,
    title: "Reliability",
    desc: "On-time, every time. No last-minute cancellations.",
  },
  {
    icon: <Eye className="w-6 h-6 text-[#1a6b4a]" />,
    title: "Transparency",
    desc: "Clear pricing, honest communication, no hidden fees.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="bg-[#f5f0e8] min-h-screen font-serif text-gray-800">
        
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-[#1a6b4a] text-white py-20 px-6 text-center"
        >
          <motion.p
            variants={item}
            className="text-sm uppercase tracking-widest text-green-300 mb-3"
          >
            Our Story
          </motion.p>

          <motion.h1
            variants={item}
            className="text-4xl md:text-5xl font-bold leading-tight mb-4"
          >
            Founded with one mission —
            <br />
            <span className="text-[#f5c89a]">
              dignity and care for every elder
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-green-200 max-w-xl mx-auto text-lg mt-4"
          >
            We started Care24 because we believe every family deserves access to
            professional, compassionate home care — right at their doorstep.
          </motion.p>
        </motion.div>

        
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto px-6 py-16 text-center"
        >
          <motion.h2
            variants={item}
            className="text-3xl font-bold text-[#1a6b4a] mb-6"
          >
            Our Story
          </motion.h2>
          <motion.p
            variants={item}
            className="text-gray-600 text-lg leading-relaxed"
          >
            Care24 was founded in 2018 when our founder Sanjeev Kumar struggled
            to find a reliable caregiver for his elderly father in Delhi. He
            realised thousands of Indian families face the same challenge — so
            he built the solution. Today, Care24 connects families with verified
            nurses, caregivers, and physiotherapists across 20+ cities in India
            — making quality home care more accessible, reliable, and
            stress-free.
          </motion.p>
        </motion.div>

        
        <motion.div
          className="bg-white py-14 px-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <motion.div
              variants={item}
              className="border-l-4 border-[#1a6b4a] pl-6"
            >
              <p className="text-xs uppercase tracking-widest text-[#1a6b4a] mb-2">
                Our Mission
              </p>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Quality care, accessible to all
              </h3>
              <p className="text-gray-500 leading-relaxed">
                To make professional elderly care accessible to every Indian
                family — regardless of city or budget.
              </p>
            </motion.div>

            <motion.div
              variants={item}
              className="border-l-4 border-[#c8623a] pl-6"
            >
              <p className="text-xs uppercase tracking-widest text-[#c8623a] mb-2">
                Our Vision
              </p>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                No elder feels alone
              </h3>
              <p className="text-gray-500 leading-relaxed">
                A future where every elder in India receives dignified, loving
                care at home — supported by trusted professionals.
              </p>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div
          className="py-16 px-6 bg-[#f5f0e8]"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2
              variants={item}
              className="text-3xl font-bold text-[#1a6b4a] text-center mb-10"
            >
              Care24 in Numbers
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  className="bg-white rounded-2xl p-6 text-center shadow-sm hover:scale-105 transition-transform duration-300"
                >
                  <p className="text-3xl font-bold text-[#1a6b4a]">
                    {stat.number}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        
        <motion.div
          className="bg-white py-16 px-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2
              variants={item}
              className="text-3xl font-bold text-[#1a6b4a] text-center mb-2"
            >
              Meet Our Team
            </motion.h2>

            <motion.p
              variants={item}
              className="text-center text-gray-400 mb-10"
            >
              The people behind Care24
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8  mx-auto">
              {team.map((person, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  className="bg-[#f5f0e8]   rounded-2xl p-6 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`${person.bg} w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}
                  >
                    {person.initials}
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {person.name}
                  </h3>
                  <p className="text-[#1a6b4a] text-sm mb-3">{person.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {person.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        
        <motion.div
          className="py-16 px-6 bg-[#f5f0e8]"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2
              variants={item}
              className="text-3xl font-bold text-[#1a6b4a] text-center mb-10"
            >
              Our Values
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  className="bg-white rounded-2xl p-6 text-center cursor-default group hover:bg-[#1a6b4a] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-[#e8f5ee] flex items-center justify-center text-xl mx-auto mb-4 group-hover:bg-white transition-colors duration-300">
                    <span className="text-[#1a6b4a]">{v.icon}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 group-hover:text-white transition-colors duration-300">
                    {v.title}
                  </h3>
                  <p className="text-gray-500 text-sm group-hover:text-green-200 transition-colors duration-300">
                    {v.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        
        <motion.div
          className="bg-white py-12 px-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-6">
            {[
              {
                icon: <Award className="w-4 h-4" />,
                text: "ISO 9001 Certified",
              },
              {
                icon: <Building2 className="w-4 h-4" />,
                text: "Government Registered",
              },
              {
                icon: <ShieldCheck className="w-4 h-4" />,
                text: "Background Verified",
              },
              { icon: <Star className="w-4 h-4" />, text: "Top Rated 2026" },
            ].map((badge, i) => (
              <motion.div
                key={i}
                variants={item}
                className="bg-[#e8f5ee] text-[#1a6b4a] px-5 py-3 rounded-full text-sm font-semibold flex items-center gap-2"
              >
                {badge.icon}
                {badge.text}
              </motion.div>
            ))}
          </div>
        </motion.div>

        
        <motion.div
          className="bg-[#1a6b4a] py-16 px-6 text-center"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={item}
            className="text-3xl font-bold text-white mb-4"
          >
            Want to know more?
          </motion.h2>

          <motion.p variants={item} className="text-green-200 mb-8 text-lg">
            Talk to us — we're here to help your family.
          </motion.p>

          <motion.button
            variants={item}
            onClick={()=> navigate("/contact")}
            className="bg-white text-[#1a6b4a] font-bold px-8 py-3 rounded-full hover:bg-[#f5c89a] hover:text-[#0f4a32] transition-colors duration-300 text-lg"
          >
            Contact Us →
          </motion.button>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}

