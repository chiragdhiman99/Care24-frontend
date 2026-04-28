import { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import { useNavigate, useParams } from "react-router";
import { getCaregiverbyId } from "../../services/CaregiverService";
import { getuserbyid } from "../../services/AuthService";
import { getMe } from "../../services/AuthService";
import { verifyUser } from "../../services/AuthService";
import {
  Clock,
  CalendarDays,
  Calendar,
  ShieldCheck,
  CheckCircle,
  RefreshCw,
  Star,
} from "lucide-react";
import { toast } from "sonner";

const todayStr = () => new Date().toISOString().split("T")[0];

const IMAGE_BASE = "http://localhost:5001";

const getInitials = (name) => {
  return name
    ?.replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatSpecialization = (s) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function Booking() {
  const { id } = useParams();

  const [bookingdata, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startPeriod, setStartPeriod] = useState("AM");
  const [endPeriod, setEndPeriod] = useState("AM");
  const [serviceType, setServiceType] = useState("hourly");
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [selectedTime, setSelectedTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [hours, setHours] = useState(2);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("male");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(1);
  const [userid, setUserId] = useState(null);
  const [userdata, setUserdata] = useState(null);

  const calchours = () => {
    if (!selectedTime || !endTime) return 0;

    const [sh, sm] = selectedTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const start = sh + sm / 60;
    const end = eh + em / 60;

    let diff = end - start;
    if (diff < 0) diff += 24;
    return diff > 0 ? diff : 0;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    getCaregiverbyId(id)
      .then((response) => {
        setBookingData(response);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [id]);

  const getTotal = () => {
    if (!bookingdata) return 0;
    if (serviceType === "hourly")
      return Math.round(bookingdata.hourlyRate * calchours());
    if (serviceType === "daily") return bookingdata.dailyRate;
    if (serviceType === "weekly")
      return Math.round(bookingdata.dailyRate * 7 * 0.9);
    return 0;
  };

  useEffect(() => {
    getMe()
      .then((data) => {
        setUserId(data.userId);
      })
      .catch(() => {
        toast.error("You are not logged in.");
      });
  }, []);

  useEffect(() => {
    if (!userid) return;

    getuserbyid(userid)
      .then((data) => {
        setUserdata(data);
      })
      .catch((error) => {
        console.error("Error fetching user by ID:", error);
      });
  }, [userid]);

  const handleReviewBooking = async () => {
    try {
      await verifyUser();
      navigate("/payment", {
        state: {
          caregiver: bookingdata?.name,
          email: userdata?.email,
          city: bookingdata?.city,
          experience: bookingdata?.experience,
          specializations: bookingdata?.specializations,
          image: bookingdata?.image,
          userId: userdata?._id,
          caregiverId: bookingdata?._id,
          patientGender,
          patientAge,
          address,
          notes,
          startTime: new Date(
            `${selectedDate}T${selectedTime}:00`,
          ).toISOString(),
          caregiverExp: bookingdata?.experience,
          caregiverRating: bookingdata?.rating,
          caregiverReviews: bookingdata?.totalReviews,
          caregiverAvailable: bookingdata?.status === "active",
          service: serviceType.charAt(0).toUpperCase() + serviceType.slice(1),
          date: selectedDate,
          patient: patientName,
          amount: getTotal(),
          duration:
            serviceType === "hourly"
              ? `${Math.round(calchours() * 60)} mins`
              : serviceType === "daily"
                ? "1 Day"
                : "1 Week",
        },
      });
    } catch (err) {
      navigate("/login");
    }
  };

  const canProceed =
    selectedDate &&
    (serviceType !== "hourly" || selectedTime) &&
    patientName &&
    patientAge &&
    address;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen mt-13 bg-[#f0f7f5] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">
              Loading caregiver details...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#f0f7f5] flex items-center justify-center">
        <div
          className="bg-white rounded-2xl shadow-lg p-12 max-w-lg w-full text-center"
          style={{ animation: "fadeUp 0.5s ease forwards" }}
        >
          <div
            className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center mx-auto mb-5"
            style={{ animation: "popIn 0.4s 0.2s ease both" }}
          >
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-400 mb-6">
            Your appointment with{" "}
            <span className="text-teal-600 font-semibold">
              {bookingdata?.name}
            </span>{" "}
            has been scheduled successfully.
          </p>
          <div className="bg-gray-50 rounded-xl p-5 text-left mb-6 space-y-3">
            <Row label="Caregiver" value={bookingdata?.name} />
            <Row label="Date" value={selectedDate} />
            {serviceType === "hourly" && (
              <Row label="Time" value={selectedTime} />
            )}
            <Row
              label="Service"
              value={serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
            />
            <Row label="Patient" value={`${patientName}, Age ${patientAge}`} />
            <Row
              label="Total Paid"
              value={`₹${getTotal().toLocaleString()}`}
              accent
            />
          </div>
          <button
            onClick={() => setStep(1)}
            className="px-8 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all active:scale-95"
          >
            Book Another Appointment
          </button>
        </div>
        <style>{`
          @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
          @keyframes popIn{from{transform:scale(0.4);opacity:0}to{transform:scale(1);opacity:1}}
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen mt-13 bg-[#f0f7f5]"
        style={{ animation: "fadeIn 0.4s ease forwards" }}
      >
        <div className="max-w-7xl mx-auto px-8 py-6">
          <button
            onClick={() => window.history.back()}
            className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to caregivers
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-8 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Book an <span style={{ color: "#e8622a" }}>Appointment</span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Complete the form below to schedule your care session
              </p>
            </div>

            <Card title="Select Service Type">
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  {
                    id: "hourly",
                    label: "Hourly",
                    icon: (
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                    ),
                    sub: `₹${bookingdata?.hourlyRate}/hr`,
                  },
                  {
                    id: "daily",
                    label: "Daily",
                    icon: (
                      <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                    ),
                    sub: `₹${bookingdata?.dailyRate}/day`,
                  },
                  {
                    id: "weekly",
                    label: "Weekly",
                    icon: (
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                    ),
                    sub: `₹${Math.round(bookingdata?.dailyRate * 7 * 0.9)}/wk • 10% off`,
                  },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setServiceType(s.id)}
                    className={`flex flex-col items-center gap-1 sm:gap-1.5 py-3 sm:py-5 px-2 sm:px-4 rounded-xl border-2 transition-all duration-200 active:scale-95 ${
                      serviceType === s.id
                        ? "border-teal-500 bg-teal-50 shadow-sm"
                        : "border-gray-100 bg-white hover:border-teal-200"
                    }`}
                  >
                    {s.icon}
                    <span
                      className={`font-semibold text-xs sm:text-sm ${serviceType === s.id ? "text-teal-700" : "text-gray-700"}`}
                    >
                      {s.label}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-400 text-center leading-tight">
                      {s.sub}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            <Card title="Date & Schedule">
              <div className="grid grid-cols-2 gap-5 mb-4">
                <div>
                  <Label>Select Date</Label>
                  <input
                    type="date"
                    min={todayStr()}
                    value={selectedDate}
                    onClick={(e) => e.target.showPicker()}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border cursor-pointer border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                  />
                </div>
              </div>
              {serviceType === "hourly" && (
                <div className="flex flex-wrap gap-5 mt-2">
                  <div>
                    <Label>Start Time</Label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        value={selectedTime}
                        onClick={(e) => e.target.showPicker()}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="flex-1 border cursor-pointer border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                      />
                      <select
                        value={startPeriod}
                        onChange={(e) => setStartPeriod(e.target.value)}
                        className="border border-gray-200  cursor-pointer rounded-xl px-2 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                      >
                        <option>AM</option>
                        <option>PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label>End Time</Label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        value={endTime}
                        onClick={(e) => e.target.showPicker()}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="flex-1 border  cursor-pointer border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                      />
                      <select
                        value={endPeriod}
                        onChange={(e) => setEndPeriod(e.target.value)}
                        className="border border-gray-200  cursor-pointer rounded-xl px-2 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                      >
                        <option>AM</option>
                        <option>PM</option>
                      </select>
                    </div>
                  </div>

                  {calchours() > 0 && (
                    <div className="col-span-2 bg-teal-50 rounded-xl px-4 py-3 flex items-center justify-between">
                      <span className="text-sm text-teal-700 font-medium">
                        Duration
                      </span>
                      <span className="text-sm ml-3 font-bold text-teal-700">
                        {calchours().toFixed(1)} hour
                        {calchours() !== 1 ? "s" : ""}{" "}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </Card>

            <Card title="Patient Information">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="col-span-2">
                  <Label>Patient Full Name</Label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition placeholder-gray-300"
                  />
                </div>
                <div>
                  <Label>Age</Label>
                  <input
                    type="number"
                    placeholder="e.g. 72"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="mb-4 ">
                <Label>Gender</Label>
                <div className="flex flex-wrap gap-3 mt-1">
                  {["male", "female", "other"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setPatientGender(g)}
                      className={`px-5 py-2 rounded-lg text-sm font-medium border transition-all active:scale-95 ${
                        patientGender === g
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-gray-200 bg-gray-50 text-gray-500 hover:border-teal-300"
                      }`}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <Label>Home Address</Label>
                <input
                  type="text"
                  placeholder="Full address for caregiver visit"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition placeholder-gray-300"
                />
              </div>

              <div>
                <Label>
                  Special Notes{" "}
                  <span className="text-gray-300 font-normal">(optional)</span>
                </Label>
                <textarea
                  placeholder="Medical conditions, allergies, special instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition resize-none placeholder-gray-300"
                />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
              style={{ animation: "slideIn 0.5s ease forwards" }}
            >
              <div className="bg-gradient-to-r from-teal-600 to-teal-400 h-16 relative">
                <div className="absolute -bottom-10 left-5 w-20 h-20 rounded-xl bg-teal-700 flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow overflow-hidden">
                  {bookingdata?.image ? (
                    <img
                      src={
                        bookingdata.image?.startsWith("http")
                          ? bookingdata.image
                          : `${IMAGE_BASE}${bookingdata.image}`
                      }
                      loading="lazy"
                      decoding="async"
                      alt={bookingdata?.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    getInitials(bookingdata?.name)
                  )}
                </div>
              </div>

              <div className="pt-12 px-5 pb-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-gray-800 text-base">
                        {bookingdata?.name}
                      </h3>
                      {bookingdata?.verified && (
                        <span className="w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                      )}
                      {bookingdata?.status === "inactive" && (
                        <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                          Busy
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {bookingdata?.city} • {bookingdata?.experience} yrs
                      experience
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="font-bold text-gray-800 text-sm">
                      {bookingdata?.rating}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({bookingdata?.totalReviews})
                    </span>
                  </div>
                </div>

                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {bookingdata?.specializations?.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium"
                    >
                      {formatSpecialization(s)}
                    </span>
                  ))}
                </div>

                {bookingdata?.languages?.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {bookingdata.languages.map((l) => (
                      <span
                        key={l}
                        className="text-xs bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full border border-gray-100"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <p className="text-base font-bold text-gray-800">
                      ₹{bookingdata?.hourlyRate}
                      <span className="text-xs font-normal text-gray-400">
                        /hr
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-800">
                      ₹{bookingdata?.dailyRate}
                      <span className="text-xs font-normal text-gray-400">
                        /day
                      </span>
                    </p>
                  </div>
                </div>

                {bookingdata?.emergencyAvailable && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                    Available for Emergency
                  </div>
                )}
              </div>
            </div>

            <div
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
              style={{ animation: "slideIn 0.6s ease forwards" }}
            >
              <h3 className="font-bold text-gray-700 text-sm mb-3">
                Booking Summary
              </h3>
              <div className="space-y-2.5">
                <SummaryRow
                  label="Service"
                  value={
                    serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
                  }
                />
                <SummaryRow label="Date" value={selectedDate || "—"} />
                {serviceType === "hourly" && (
                  <SummaryRow label="Start Time" value={selectedTime || "—"} />
                )}
                {serviceType === "hourly" && (
                  <SummaryRow label="End Time" value={endTime || "—"} />
                )}
                {serviceType === "hourly" && (
                  <SummaryRow
                    label="Duration"
                    value={`${calchours().toFixed(1)} hour${calchours() !== 1 ? "s" : ""}`}
                  />
                )}
                <SummaryRow label="Patient" value={patientName || "—"} />
              </div>
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">
                  Total Estimate
                </span>
                <span className="text-xl font-bold text-teal-600">
                  ₹{getTotal().toLocaleString()}
                </span>
              </div>
              {serviceType === "weekly" && (
                <p className="text-[11px] text-teal-500 mt-1 text-right">
                  10% weekly discount applied
                </p>
              )}
            </div>

            <button
              onClick={handleReviewBooking}
              disabled={!canProceed}
              className={`w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 active:scale-95 ${
                canProceed
                  ? "bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-200 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Review Booking →
            </button>
            {!canProceed && (
              <p className="text-xs text-gray-400 text-center -mt-2">
                Fill all required fields to continue
              </p>
            )}

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                {
                  icon: <ShieldCheck className="w-4 h-4 text-teal-600" />,
                  text: "Secure Payment",
                },
                {
                  icon: <CheckCircle className="w-4 h-4 text-teal-600" />,
                  text: "Verified Pros",
                },
                {
                  icon: <RefreshCw className="w-4 h-4 text-teal-600" />,
                  text: "Easy Reschedule",
                },
              ].map((b) => (
                <div
                  key={b.text}
                  className="bg-white rounded-xl border border-gray-100 p-2.5"
                >
                  <div className="flex justify-center mb-1">{b.icon}</div>
                  <p className="text-[10px] text-gray-400 font-medium leading-tight">
                    {b.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {step === 2 && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            style={{ animation: "fadeIn 0.2s ease forwards" }}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4"
              style={{ animation: "slideUp 0.3s ease forwards" }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Confirm Your Booking
              </h2>
              <p className="text-sm text-gray-400 mb-5">
                Please review all details before confirming
              </p>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 mb-5">
                <Row label="Caregiver" value={bookingdata?.name} />
                <Row
                  label="Service Type"
                  value={
                    serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
                  }
                />
                <Row label="Date" value={selectedDate} />
                {serviceType === "hourly" && (
                  <Row label="Time" value={selectedTime} />
                )}
                {serviceType === "hourly" && (
                  <Row
                    label="Duration"
                    value={`${hours} hour${hours > 1 ? "s" : ""}`}
                  />
                )}
                <Row
                  label="Patient"
                  value={`${patientName}, ${patientAge} yrs, ${patientGender}`}
                />
                <Row label="Address" value={address} />
                {notes && <Row label="Notes" value={notes} />}
              </div>
              <div className="flex justify-between items-center bg-teal-50 rounded-xl px-4 py-3 mb-5">
                <span className="font-semibold text-gray-700">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-teal-600">
                  ₹{getTotal().toLocaleString()}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition active:scale-95"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition active:scale-95 shadow-md"
                >
                  Confirm & Pay ₹{getTotal().toLocaleString()}
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes fadeIn{from{opacity:0}to{opacity:1}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
          @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
          @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
          @keyframes popIn{from{transform:scale(0.4);opacity:0}to{transform:scale(1);opacity:1}}
        `}</style>
      </div>
    </>
  );
}

function Card({ title, children }) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
      style={{ animation: "fadeUp 0.4s ease forwards" }}
    >
      <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Label({ children }) {
  return (
    <label className="block text-xs text-gray-400 font-semibold mb-1.5 uppercase tracking-wide">
      {children}
    </label>
  );
}

function Row({ label, value, accent }) {
  return (
    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-400 flex-shrink-0">{label}</span>
      <span
        className={`text-sm font-semibold text-right ${accent ? "text-teal-600" : "text-gray-700"}`}
      >
        {value}
      </span>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs font-semibold text-gray-700">{value}</span>
    </div>
  );
}
