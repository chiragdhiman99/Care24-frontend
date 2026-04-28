import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1A1A18] text-gray-400 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          <div>
            <div className="font-fraunces text-2xl font-bold text-white mb-3">
              Care<span className="text-[#D85A30]">24</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              India's trusted platform connecting families with verified,
              trained, and compassionate elderly caregivers — right at home.
            </p>
          </div>

          
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
            <ul className="flex flex-col gap-3 text-sm">
              {[
                "Nursing Care",
                "Elderly Attendant",
                "Physiotherapy",
                "Post-Hospital Care",
              ].map((s) => (
                <li key={s}>
                  <Link
                    to="/services"
                    className="hover:text-white transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="flex flex-col gap-3 text-sm">
              {["About Us", "How it Works", "For Caregivers", "Careers"].map(
                (s) => (
                  <li key={s}>
                    <a href="#" className="hover:text-white transition-colors">
                      {s}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
            <ul className="flex flex-col gap-3 text-sm">
              {[
                "Help Center",
                "Safety & Trust",
                "Privacy Policy",
                "Contact Us",
              ].map((s) => (
                <li key={s}>
                  <a href="#" className="hover:text-white transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <span>© 2026 Care24. All rights reserved.</span>
          <span>Made with care for India's elders 🤍</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

