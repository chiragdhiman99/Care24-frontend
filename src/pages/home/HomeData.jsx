import { motion } from "framer-motion";
import {
  Stethoscope,
  Users,
  Dumbbell,
  Home,
  ClipboardList,
  Search,
  CalendarDays,
  CheckCircle,
  Star,
  ShieldCheck,
  Zap,
  BarChart3,
} from "lucide-react";

/* ─── ANIMATION VARIANTS ───────────────────────────── */
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── DATA ──────────────────────────────────────────── */
export const stats = [
  { num: "5,000+", label: "Families Served" },
  { num: "850+", label: "Verified Caregivers" },
  { num: "98%", label: "Satisfaction Rate" },
  { num: "24", label: "Cities Active" },
];

export const services = [
  {
    icon: <Stethoscope className="w-7 h-7" />,
    name: "Nursing Care",
    price: "₹600/hr",
    desc: "Wound dressing, IV care, post-op monitoring, vital checks by certified nurses.",
  },
  {
    icon: <Users className="w-7 h-7" />,
    name: "Elderly Attendant",
    price: "₹450/hr",
    desc: "Personal hygiene, meal assistance, companionship, mobility support & daily routines.",
  },
  {
    icon: <Dumbbell className="w-7 h-7" />,
    name: "Physiotherapy",
    price: "₹800/hr",
    desc: "Post-fracture rehab, joint mobility, stroke recovery & exercise plans at home.",
  },
  {
    icon: <Home className="w-7 h-7" />,
    name: "Post-Hospital Care",
    price: "₹700/hr",
    desc: "Expert care after surgery — medication management, monitoring & recovery.",
  },
];

export const steps = [
  {
    num: 1,
    icon: <ClipboardList className="w-7 h-7 text-[#0B7D6E]"  />,
    title: "Register & Tell Us",
    desc: "Share your care needs, location, and preferred schedule in minutes.",
  },
  {
    num: 2,
    icon: <Search className="w-7 h-7 text-[#0B7D6E]" />,
    title: "Browse Caregivers",
    desc: "Filter by service, location, availability, and ratings.",
  },
  {
    num: 3,
    icon: <CalendarDays className="w-7 h-7 text-[#0B7D6E]" />,
    title: "Book & Schedule",
    desc: "Choose hourly, daily or long-term packages that suit you.",
  },
  {
    num: 4,
    icon: <CheckCircle className="w-7 h-7 text-[#0B7D6E]" />,
    title: "Caregiver Confirms",
    desc: "Your caregiver accepts and you get real-time notifications.",
  },
  {
    num: 5,
    icon: <Star className="w-7 h-7 text-[#0B7D6E]" />,
    title: "Care Delivered",
    desc: "Track service status and rate your experience after completion.",
  },
];

export const caregivers = [
  {
    emoji: "👩‍⚕️",
    bg: "from-[#E1F5EE] to-[#9FE1CB]",
    name: "Priya Narayanan",
    spec: "Registered Nurse",
    tags: ["Post-Op Care", "IV Therapy", "Wound Care"],
    rating: "4.9",
    reviews: 48,
  },
  {
    emoji: "🧑‍⚕️",
    bg: "from-[#FAECE7] to-[#F5C4B3]",
    name: "Rajan Mehta",
    spec: "Physiotherapist",
    tags: ["Stroke Rehab", "Ortho", "Elderly Fitness"],
    rating: "4.8",
    reviews: 36,
  },
  {
    emoji: "👩‍🦽",
    bg: "from-[#E6F1FB] to-[#B5D4F4]",
    name: "Sunita Sharma",
    spec: "Elder Care Attendant",
    tags: ["Dementia", "Companionship", "Meals"],
    rating: "4.9",
    reviews: 62,
  },
  {
    emoji: "👨‍⚕️",
    bg: "from-[#EAF3DE] to-[#C0DD97]",
    name: "Dr. Arun Kumar",
    spec: "Post-Hospital Specialist",
    tags: ["ICU Recovery", "Cardiac Care"],
    rating: "5.0",
    reviews: 29,
  },
];

export const testimonials = [
  {
    stars: 5,
    quote: `"Care24 has been an absolute blessing. Priya came within hours and my father immediately felt comfortable. The professionalism and warmth she brings every day is remarkable."`,
    name: "Ananya Verma",
    relation: "Daughter, Delhi",
    initials: "AV",
  },
  {
    stars: 5,
    quote: `"After my mother's hip surgery, we were lost. Care24 connected us with a brilliant physiotherapist who helped her recover in 3 weeks. Couldn't be more grateful!"`,
    name: "Rohit Sharma",
    relation: "Son, Mumbai",
    initials: "RS",
  },
  {
    stars: 5,
    quote: `"The real-time tracking feature gives me so much peace of mind when I'm at work. I can check on my grandparent's care status any time. Truly modern elderly care."`,
    name: "Nisha Patel",
    relation: "Granddaughter, Bangalore",
    initials: "NP",
  },
  {
    stars: 4,
    quote: `"Transparent pricing, verified caregivers, and an easy booking process. We switched from an agency to Care24 and the difference in quality is night and day."`,
    name: "Mahesh Kumar",
    relation: "Son, Pune",
    initials: "MK",
  },
  {
    stars: 5,
    quote: `"Sunita has become like family to us. She cares for my 85-year-old mother with such dignity and love. Care24 made finding her incredibly easy."`,
    name: "Deepa Gupta",
    relation: "Daughter, Chennai",
    initials: "DG",
  },
];

export const whyItems = [
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "Fully Verified Professionals",
    desc: "Every caregiver goes through background checks, training verification & reference checks.",
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: "Fast Matching",
    desc: "Get caregiver confirmation within 30 minutes of your booking request.",
  },
  {
    icon: <BarChart3 className="w-7 h-7" />,
    title: "Real-time Status Tracking",
    desc: "Know when your caregiver is on the way, arrived, and completed the session.",
  },
];

/* ─── REUSABLE COMPONENTS ───────────────────────────── */
export const Section = ({ id, className = "", children }) => (
  <section id={id} className={`px-6 ${className}`}>
    {children}
  </section>
);

export const SectionLabel = ({ children }) => (
  <p className="text-xs font-semibold uppercase tracking-widest text-[#0B7D6E] mb-3">
    {children}
  </p>
);

export const SectionTitle = ({ children }) => (
  <h2 className="font-fraunces text-3xl md:text-4xl font-bold leading-tight mb-4 text-[#1A1A18]">
    {children}
  </h2>
);

