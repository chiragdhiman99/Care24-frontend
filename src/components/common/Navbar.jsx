import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getMe } from "../../services/AuthService";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "How it Works", path: "/how-it-works" },
    { label: "Caregivers", path: "/caregivers" },
    { label: "About us", path: "/about-us" },
    { label: "Contact ", path: "/contact" },
  ];

  useEffect(() => {
    getMe()
      .then((data) => {
        setToken(true);
        setRole(data.role);
      })
      .catch(() => setToken(false));
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/92 backdrop-blur-md border-b border-teal-100 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-fraunces  text-2xl font-bold text-[#0B7D6E]"
        >
          <span style={{ fontFamily: "'DM Sans', sans-serif" }}>Care </span>
          <span className="text-[#D85A30]">
            {" "}
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#E8622A",
              }}
            >
              24
            </span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 list-none">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`text-[16px] font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "text-[#0B7D6E] font-semibold"
                    : "text-gray-500 hover:text-[#0B7D6E]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {token ? (
          <Link
            to={role === "caregiver" ? "/caregiver-dashboard" : "/dashboard"}
            className="hidden md:block bg-[#0B7D6E] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1D9E75] hover:-translate-y-0.5 transition-all duration-200"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            className="hidden md:block bg-[#0B7D6E] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1D9E75] hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Started
          </Link>
        )}

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-teal-50 px-6 py-4 flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-gray-600 hover:text-[#0B7D6E]"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {token ? (
              <Link
                to={
                  role === "caregiver" ? "/caregiver-dashboard" : "/dashboard"
                }
                className="bg-[#0B7D6E]  text-white px-5 py-2 rounded-full text-sm font-medium text-center"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-[#0B7D6E] text-white px-5 py-2 rounded-full text-sm font-medium text-center"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
