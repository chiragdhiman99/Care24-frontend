import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1
          className="text-[120px] font-bold leading-none"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="text-[#0b7d6e]">4</span>
          <span className="text-[#e8622a]">0</span>
          <span className="text-[#0b7d6e]">4</span>
        </h1>

        <div className="w-16 h-1 bg-[#0b7d6e] mx-auto mt-2 mb-6 rounded-full" />

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back to safety.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => navigate("/")}
            className="bg-[#0b7d6e] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#0a6d5e] transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Go Home →
          </button>
          <button
            onClick={() => navigate("/caregivers")}
            className="border border-[#0b7d6e] text-[#0b7d6e] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#e8f5f2] transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Browse Caregivers
          </button>
        </div>

        <p className="mt-10 text-xs text-gray-400">
          Care<span className="text-[#e8622a] font-semibold">24</span> · Trusted
          Home Care
        </p>
      </div>
    </div>
  );
}
