import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { Toaster } from "sonner";
import Chatbot from "./components/common/chatbot";

const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/SignUp"));
const Caregivers = lazy(() => import("./pages/Caregiver"));
const CaregiverDetail = lazy(
  () => import("./components/caregiver/CaregiverDetail"),
);
const UserDashboard = lazy(() => import("./dashboard/user/UserDashboard"));
const Booking = lazy(() => import("./components/booking/BookingCard"));
const PaymentSection = lazy(
  () => import("./components/booking/PaymentSection"),
);
const PaymentConfirmation = lazy(
  () => import("./components/booking/PaymentConfirmation"),
);
const CaregiverDashboard = lazy(
  () => import("./dashboard/caregiver/CaregiverDashboard"),
);
const AdminDashboard = lazy(() => import("./dashboard/admin/AdminDashboard"));
const AdminLogin = lazy(() => import("./dashboard/admin/AdminLogin"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const NotFound = lazy(() => import("./PageNotFound"));

const socket = io(" https://care24-backend.onrender.com");

function App() {
  useEffect(() => {
    socket.on("connect", () => {});
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        richColors
        offset={{ top: 37, right: 16 }}
        toastOptions={{
          duration: 3000,
        }}
      />
      <Chatbot />
      <main>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0b7d6e] rounded-full animate-spin" />
            </div>
          }
        >
          {" "}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/caregivers" element={<Caregivers />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/caregiver" element={<Caregivers />} />
            <Route path="/caregiver/:id" element={<CaregiverDetail />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/payment" element={<PaymentSection />} />
            <Route
              path="/payment-confirmation"
              element={<PaymentConfirmation />}
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route
              path="/caregiver-dashboard"
              element={<CaregiverDashboard />}
            />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

export default App;
