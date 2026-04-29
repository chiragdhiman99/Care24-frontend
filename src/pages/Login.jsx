import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, LogIn, Lock } from "lucide-react";
import { loginUser } from "../services/AuthService";
export default function Login() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [logindata, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setLoginData({ ...logindata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!logindata.email || !logindata.password) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(logindata.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const strongPassword =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!strongPassword.test(logindata.password)) {
      toast.error(
        "Password must be 8+ chars with uppercase, lowercase, number & special character.",
      );
      return;
    }

    const userdata = logindata;
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = await loginUser(userdata);
      localStorage.setItem("token", data.token);
      setLoading(false);
      toast.success("Login successful!");
      window.location.href = "/caregiver-dashboard";
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const handleGoogle = () => {
    window.location.href = "https://care24-backend.onrender.com/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <motion.div
          className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {" "}
          
          <div className="text-center mb-7">
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
              Trusted by 5,000+ Families
            </span>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">
              Welcome <span className="italic text-[#0b7d6e]">Back</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Login to manage your care appointments
            </p>
          </div>
          
          <button
            onClick={handleGoogle}
            className=" cursor-pointer w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-800 hover:border-green-600 hover:shadow-md transition-all mb-5"
          >
            <GoogleIcon />
            Continue with Google
          </button>
          
          <div className="flex items-center gap-3 mb-5">
            <hr className="flex-1 border-gray-200" />
            <span className="text-gray-400 text-xs">or login with email</span>
            <hr className="flex-1 border-gray-200" />
          </div>
          
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={logindata.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>
          
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={logindata.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer w-full bg-[#0b7d6e] text-white font-semibold py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Logging in...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Login <LogIn size={16} />
              </span>
            )}
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#0b7d6e] cursor-pointer font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-5 pt-5 border-t border-gray-100 text-xs text-gray-400">
            <Lock size={12} /> Secure & Encrypted · Background Verified
            Caregivers
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

