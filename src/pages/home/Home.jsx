import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { getAllBookings } from "../../services/bookingservice";
import { getCaregivers } from "../../services/CaregiverService";
import { CheckCircle, Clock, ShieldCheck, MessageCircle } from "lucide-react";
import {
  fadeUp,
  fadeLeft,
  fadeRight,
  staggerContainer,
  stats,
  services,
  steps,
  caregivers,
  testimonials,
  whyItems,
  Section,
  SectionLabel,
  SectionTitle,
} from "./HomeData";
import { useEffect } from "react";
import Footer from "../../components/common/Footer";
import Navbar from "../../components/common/Navbar";

const Home = () => {
  const scrollRef = useRef(null);
  const IMAGE_BASE = "https://care24-backend.onrender.com";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [topCaregivers, setTopCaregivers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookings = await getAllBookings();
        const countids = {};
        bookings.forEach((b) => {
          countids[b.caregiverId] = (countids[b.caregiverId] || 0) + 1;
        });
        const data = await getCaregivers();
        const top4 = data
          .sort((a, b) => (countids[b._id] || 0) - (countids[a._id] || 0))
          .slice(0, 4);
        setTopCaregivers(top4);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="-mt-25 sm:mt-0">
        <div className="pt-5 overflow-x-hidden">
          <section className="min-h-screen bg-[#F9F6F0] px-4 sm:px-6 py-16 sm:py-24 flex items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-teal-100/40 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  variants={fadeUp}
                  custom={0}
                  className="inline-flex items-center gap-2 bg-[#E1F5EE] text-[#0B7D6E] px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium mb-6 sm:mb-6"
                >
                  <span className="w-2 h-2 rounded-full bg-[#1D9E75]" />
                  Trusted by 5,000+ Families Across India
                </motion.div>
                <motion.h1
                  variants={fadeUp}
                  custom={1}
                  className="font-fraunces text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-5 text-[#1A1A18]"
                >
                  Compassionate Care
                  <br />
                  for Your <span className="text-[#0B7D6E] italic">Loved</span>
                  <br />
                  <span className="text-[#D85A30]">Elders</span> at Home
                </motion.h1>
                <motion.p
                  variants={fadeUp}
                  custom={2}
                  className="text-sm sm:text-base text-gray-500 leading-relaxed mb-6 sm:mb-8 max-w-lg"
                >
                  Connect with verified nurses, caregivers & physiotherapists —
                  right at your doorstep.
                </motion.p>
                <motion.div
                  variants={fadeUp}
                  custom={3}
                  className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10"
                >
                  <Link
                    to="/caregivers"
                    className="bg-[#0B7D6E] text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-medium hover:bg-[#1D9E75] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                  >
                    Book a Caregiver →
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="border-2 border-[#0B7D6E] text-[#0B7D6E] px-5 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-medium hover:bg-[#E1F5EE] transition-all duration-200"
                  >
                    How it Works
                  </Link>
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  custom={4}
                  className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500"
                >
                  {[
                    [
                      <CheckCircle className="w-4 h-4" />,
                      "Verified Caregivers",
                    ],
                    [<Clock className="w-4 h-4" />, "24/7 Availability"],
                    [<ShieldCheck className="w-4 h-4" />, "Secure & Safe"],
                  ].map(([icon, label]) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#E1F5EE] flex items-center justify-center text-[#0B7D6E]">
                        {icon}
                      </div>
                      {label}
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              <div className="hidden md:flex items-center justify-center relative">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: [0, -12, 0] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.3 },
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3,
                    },
                  }}
                  className="absolute -top-4 -right-6 bg-white rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-3 z-10"
                >
                  <MessageCircle className="w-6 h-6 text-[#0B7D6E]" />
                  <div>
                    <p className="font-semibold text-sm leading-none mb-0.5">
                      Request Sent!
                    </p>
                    <p className="text-xs text-gray-400">Priya N. — Nurse</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, y: [0, -16, 0] }}
                  transition={{
                    opacity: { duration: 0.6 },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="bg-white rounded-2xl p-7 shadow-xl w-72 relative z-20"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0B7D6E] flex items-center justify-center text-white font-fraunces text-xl mb-4">
                    P
                  </div>
                  <p className="font-semibold text-base">Priya Narayanan</p>
                  <p className="text-[#0B7D6E] text-xs mb-4">
                    Senior Registered Nurse • 8 yrs exp
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-[#F9F6F0] rounded-lg p-2.5 text-center">
                      <span className="block font-bold text-lg text-[#0B7D6E]">
                        127
                      </span>
                      <span className="text-xs text-gray-400">
                        Patients Served
                      </span>
                    </div>
                    <div className="bg-[#F9F6F0] rounded-lg p-2.5 text-center">
                      <span className="block font-bold text-lg text-[#0B7D6E]">
                        4.9
                      </span>
                      <span className="text-xs text-gray-400">Rating</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-gray-400 text-xs">48 reviews</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Available Today from 9 AM
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: [0, 12, 0] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.6 },
                    y: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.8,
                    },
                  }}
                  className="absolute -bottom-2 -left-10 bg-white rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-3 z-10"
                >
                  <ShieldCheck className="w-6 h-6 text-[#0B7D6E]" />
                  <div>
                    <p className="font-semibold text-sm leading-none mb-0.5">
                      Background Verified
                    </p>
                    <p className="text-xs text-gray-400">
                      All caregivers checked
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="bg-[#0B7D6E] py-10 mb-20 sm:mb-0  sm:py-14 px-4 sm:px-6">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center"
            >
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  className="border-r border-white/15 last:border-0 px-2 sm:px-4"
                >
                  <div className="font-fraunces text-3xl sm:text-5xl font-bold text-white leading-none mb-1 sm:mb-2">
                    {s.num}
                  </div>
                  <div className="text-white/70 text-xs sm:text-sm">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <Section id="services" className="py-14 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-10 sm:mb-14"
              >
                <SectionLabel>What We Offer</SectionLabel>
                <SectionTitle>
                  Professional Care Services,
                  <br />
                  Delivered at Home
                </SectionTitle>
                <p className="text-gray-500 max-w-lg text-sm sm:text-base">
                  Choose from a wide range of expert services tailored to your
                  loved one's needs.
                </p>
              </motion.div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
              >
                {services.map((s, i) => (
                  <motion.div
                    key={s.name}
                    variants={fadeUp}
                    custom={i}
                    className="bg-[#F9F6F0] relative overflow-hidden rounded-2xl p-5 sm:p-6 cursor-pointer border-2 border-transparent hover:border-[#0B7D6E] hover:bg-white hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="w-40 h-40 absolute -bottom-10 -right-10 bg-[#e8eee7] rounded-full transition-transform duration-300 group-hover:scale-150" />
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#E1F5EE] group-hover:bg-[#0B7D6E] flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-5 transition-colors duration-300 relative z-10">
                      {s.icon}
                    </div>
                    <h3 className="font-fraunces text-base sm:text-lg font-semibold mb-2 relative z-10">
                      {s.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-4 relative z-10">
                      {s.desc}
                    </p>
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-xs sm:text-sm font-semibold text-[#0B7D6E]">
                        From {s.price}
                      </span>
                      <Link
                        to="/caregivers"
                        className="bg-[#0B7D6E] text-white px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium hover:bg-[#1D9E75] transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Section>

          <Section id="how-it-works" className="py-14 sm:py-24 bg-[#F9F6F0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-10 sm:mb-14"
              >
                <SectionLabel>Simple Process</SectionLabel>
                <SectionTitle>Care in 5 Easy Steps</SectionTitle>
                <p className="text-gray-500 max-w-lg mx-auto text-sm sm:text-base">
                  From registration to care delivery — fast, transparent, and
                  simple.
                </p>
              </motion.div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="hidden md:flex items-start"
              >
                {steps.map((step, i) => (
                  <div key={step.num} className="flex items-start flex-1">
                    <motion.div
                      variants={fadeUp}
                      custom={i}
                      className="text-center flex-1 px-4"
                    >
                      <div className="flex flex-col items-center mb-3">
                        <div className="w-12 h-12 rounded-full bg-[#0B7D6E] text-white font-fraunces text-xl font-bold flex items-center justify-center mb-3">
                          {step.num}
                        </div>
                        <div className="text-3xl">{step.icon}</div>
                      </div>
                      <h4 className="font-semibold text-sm mb-2">
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {step.desc}
                      </p>
                    </motion.div>
                    {i < steps.length - 1 && (
                      <div className="connector-line mt-6 min-w-[20px]" />
                    )}
                  </div>
                ))}
              </motion.div>
              <div className="md:hidden flex flex-col gap-5">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.num}
                    variants={fadeUp}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="w-10 h-10 min-w-[40px] rounded-full bg-[#0B7D6E] text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <div className="text-xl mb-1">{step.icon}</div>
                      <h4 className="font-semibold text-sm mb-1">
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>

          <Section id="caregivers" className="py-14 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-10 sm:mb-14"
              >
                <SectionLabel>Our Professionals</SectionLabel>
                <SectionTitle>Meet Our Top-Rated Caregivers</SectionTitle>
                <p className="text-gray-500 max-w-lg text-sm sm:text-base">
                  Background-verified, trained, and compassionate professionals
                  ready to serve.
                </p>
              </motion.div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
              >
                {topCaregivers.map((cg, i) => (
                  <motion.div
                    key={cg._id}
                    variants={fadeUp}
                    custom={i}
                    className="rounded-2xl border border-teal-100 overflow-hidden hover:-translate-y-1.5 hover:shadow-lg hover:border-[#0B7D6E] transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-32 sm:h-44 lg:h-48 overflow-hidden">
                      <img
                        src={
                          cg.image?.startsWith("http")
                            ? cg.image
                            : `${IMAGE_BASE}${cg.image}`
                        }
                        alt={cg.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="p-2.5 sm:p-4">
                      <p className="font-semibold text-xs sm:text-base mb-1 truncate">
                        {cg.name}
                      </p>
                      <p className="text-[#0B7D6E] text-[10px] sm:text-xs mb-2 line-clamp-2">
                        {cg.specializations.join(" • ")} • {cg.experience} yrs
                        exp
                      </p>
                      <div className="hidden sm:flex flex-wrap gap-1.5 mb-3">
                        {cg.certifications.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="bg-[#E1F5EE] text-[#0B7D6E] text-xs px-2.5 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1 font-semibold">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-[10px] sm:text-sm">
                            {cg.rating} ({cg.totalReviews})
                          </span>
                        </div>
                        <Link
                          to="/caregivers"
                          className="bg-[#D85A30] text-white px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium hover:bg-[#c04a22] transition-colors"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Section>

          <Section
            id="reviews"
            className="py-14 sm:py-24 bg-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center justify-between mb-8 sm:mb-10"
              >
                <div>
                  <SectionLabel>Real Stories</SectionLabel>
                  <SectionTitle>What Families Say About Us</SectionTitle>
                </div>
                <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                  <button
                    onClick={() =>
                      scrollRef.current.scrollBy({
                        left: -300,
                        behavior: "smooth",
                      })
                    }
                    className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#0B7D6E] text-[#0B7D6E] hover:bg-[#0B7D6E] hover:text-white transition-all text-sm"
                  >
                    ←
                  </button>
                  <button
                    onClick={() =>
                      scrollRef.current.scrollBy({
                        left: 300,
                        behavior: "smooth",
                      })
                    }
                    className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#0B7D6E] text-[#0B7D6E] hover:bg-[#0B7D6E] hover:text-white transition-all text-sm"
                  >
                    →
                  </button>
                </div>
              </motion.div>
              <div
                ref={scrollRef}
                className="flex gap-3 sm:gap-5 overflow-x-auto scrollbar-hide pb-4"
              >
                {testimonials.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="min-w-[85vw] sm:min-w-72 bg-[#F9F6F0] rounded-2xl p-4 sm:p-6 border border-teal-100 hover:border-[#0B7D6E] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div className="text-yellow-400 mb-3 text-sm">
                      {"★".repeat(t.stars)}
                      {"☆".repeat(5 - t.stars)}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed mb-4 sm:mb-5">
                      {t.quote}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0B7D6E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {t.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-xs sm:text-sm leading-none mb-0.5">
                          {t.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400">
                          {t.relation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>

          <section className="bg-[#0B7D6E] py-16 sm:py-24 px-4 sm:px-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/4 translate-y-1/3 -translate-x-1/3" />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-2xl mx-auto relative z-10"
            >
              <motion.h2
                variants={fadeUp}
                custom={0}
                className="font-fraunces text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
              >
                Your Loved One Deserves
                <br />
                the Best Care — Today
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={1}
                className="text-white/80 text-sm sm:text-base mb-8 leading-relaxed"
              >
                Join thousands of families who trust Care24 for compassionate,
                professional, and reliable elderly care at home.
              </motion.p>
              <motion.div
                variants={fadeUp}
                custom={2}
                className="flex flex-wrap gap-3 sm:gap-4 justify-center"
              >
                <Link
                  to="/caregivers"
                  className="bg-white text-[#0B7D6E] px-5 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                >
                  Book a Caregiver Now →
                </Link>
                <Link
                  to="/caregivers"
                  className="border-2 border-white/50 text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-medium hover:border-white hover:bg-white/10 transition-all duration-200"
                >
                  Browse Caregivers
                </Link>
              </motion.div>
            </motion.div>
          </section>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
