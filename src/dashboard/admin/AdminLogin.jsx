import { useState } from "react";
import { AdminLogin } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { Lock, Star } from "lucide-react";

export default function Adminlogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const res = await AdminLogin({ email, password });
      if (res.success) {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setErrors({ api: "Invalid email or password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className=" page-enter min-h-screen flex flex-col md:flex-row"
        style={{ background: "#f5f0e8" }}
      >
        <div
          className="left-enter hidden md:flex w-1/2 flex-col justify-between p-8 lg:p-12"
          style={{ background: "#0f6246" }}
        >
          <div className="flex items-center gap-3">
            <h1 className="text-white text-3xl font-bold tracking-tight">
              Care<span style={{ color: "#f97316" }}>24</span>
            </h1>
            <span
              className="text-[10px] text-white px-3 py-1 rounded-full uppercase tracking-widest mt-3"
              style={{ border: "1px solid rgba(255,255,255,0.25)" }}
            >
              Admin Portal
            </span>
          </div>

          <div>
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              Manage with Care <br />
              <span style={{ color: "#f97316" }} className="italic">
                & Control
              </span>
            </h2>
            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Access your admin panel to oversee caregivers, patients, bookings,
              and platform operations — all in one place.
            </p>
          </div>

          <div className="flex gap-10">
            <div>
              <p className="text-white text-2xl font-bold">5K+</p>
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Families Served
              </p>
            </div>
            <div>
              <p className="text-white text-2xl font-bold">800+</p>
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Verified Caregivers
              </p>
            </div>
            <div>
              <p className="text-white flex text-2xl font-bold">
                4.9
                <Star
                  size={18}
                  className="text-yellow-400 mt-2 fill-yellow-400"
                />
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Avg Rating
              </p>
            </div>
          </div>
        </div>

        <div
          className="w-full md:w-1/2 flex items-center justify-center px-8 py-12"
          style={{ background: "#faf7f2" }}
        >
          <div className="w-full max-w-sm">
            <div className="form-enter mb-8">
              <span
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4"
                style={{ background: "#e0f2ea", color: "#0f6246" }}
              >
                <span
                  className="dot-pulse w-2 h-2 rounded-full"
                  style={{ background: "#0f6246" }}
                ></span>
                Admin Access
              </span>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-400">
                Sign in to your admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field-enter1 mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="admin@care24.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: errors.email
                      ? "1.5px solid #ef4444"
                      : "1.5px solid #d1d5db",
                    background: "#fff",
                  }}
                  onFocus={(e) => {
                    if (!errors.email) e.target.style.borderColor = "#0f6246";
                  }}
                  onBlur={(e) => {
                    if (!errors.email) e.target.style.borderColor = "#d1d5db";
                  }}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">⚠ {errors.email}</p>
                )}
              </div>

              <div className="field-enter2 mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                    style={{
                      border: errors.password
                        ? "1.5px solid #ef4444"
                        : "1.5px solid #d1d5db",
                      background: "#fff",
                    }}
                    onFocus={(e) => {
                      if (!errors.password)
                        e.target.style.borderColor = "#0f6246";
                    }}
                    onBlur={(e) => {
                      if (!errors.password)
                        e.target.style.borderColor = "#d1d5db";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18M10.584 10.587a2 2 0 102.829 2.828M9.88 5.12A9.77 9.77 0 0112 5c5 0 9 5 9 7a13.133 13.133 0 01-2.167 3.315M6.53 6.53A13.133 13.133 0 003 12s4 7 9 7a9.77 9.77 0 003.88-.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12s4.5-7.5 9.75-7.5S21.75 12 21.75 12s-4.5 7.5-9.75 7.5S2.25 12 2.25 12z"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    ⚠ {errors.password}
                  </p>
                )}
              </div>

              <div className="btn-enter">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full text-white cursor-pointer font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                  style={{ background: "#0f6246" }}
                  onMouseEnter={(e) => {
                    if (!isLoading) e.target.style.background = "#0a4f38";
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) e.target.style.background = "#0f6246";
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Signing In...
                    </>
                  ) : (
                    "Sign In to Dashboard →"
                  )}
                </button>
              </div>
            </form>

            <p className="flex items-center justify-center gap-1 text-xs text-gray-400 mt-6">
              <Lock size={13} /> Secure admin-only access · Care24
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
