import { motion } from "framer-motion";
import { MapPin, Clock, Zap, CheckCircle, X } from "lucide-react";

export const IMAGE_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

export const formatSpec = (s) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

export const maskNumber = (num) => {
  if (!num) return "";
  return num
    .split("")
    .map((c, i) => (i < 2 || i >= num.length - 2 ? c : "X"))
    .join("");
};

export const MOCK_REVIEWS = [
  {
    name: "Anjali Mehta",
    rating: 5,
    date: "Mar 2025",
    text: "Very caring and professional. My mother felt very comfortable. Highly recommended!",
  },
  {
    name: "Rohit Singh",
    rating: 4,
    date: "Feb 2025",
    text: "Good experience overall. Punctual and attentive. Would book again.",
  },
  {
    name: "Sunita Rao",
    rating: 5,
    date: "Jan 2025",
    text: "Excellent service. Very patient with elderly patients. 10/10.",
  },
];

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-4 h-4 ${star <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export const RatingBar = ({ star, count, total }) => {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <span className="w-3">{star}</span>
      <span className="text-amber-400 text-[10px]">★</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-6 text-right">{percent}%</span>
    </div>
  );
};

export const CheckIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-teal-600"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

export const CrossIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-gray-300"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

export const AboutTab = ({ caregiver, number }) => {
  const pm = caregiver.performanceMetrics || {};
  const vd = caregiver.verificationDetails || {};

  return (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="space-y-6"
    >
      {caregiver.bio && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            About
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {caregiver.bio}
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Details
            </h3>
            <div className="space-y-1">
              {[
                { label: "Phone", value: number },
                { label: "City", value: caregiver.city },
                { label: "Experience", value: `${caregiver.experience} years` },
                {
                  label: "Status",
                  value: caregiver.available ? "Available" : "Busy",
                  green: caregiver.available,
                },
                ...(caregiver.gender
                  ? [
                      {
                        label: "Gender",
                        value:
                          caregiver.gender.charAt(0).toUpperCase() +
                          caregiver.gender.slice(1),
                      },
                    ]
                  : []),
                ...(caregiver.age
                  ? [{ label: "Age", value: `${caregiver.age} years` }]
                  : []),
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center py-2.5 border-b border-gray-50"
                >
                  <span className="text-sm text-gray-400">{row.label}</span>
                  <span
                    className={`text-sm font-medium ${row.green ? "text-green-600" : "text-gray-700"}`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {pm.successRate !== undefined && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Performance
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Success Rate", value: `${pm.successRate}%` },
                  { label: "Response Time", value: pm.averageResponseTime },
                  { label: "Cases Done", value: pm.casesCompleted },
                  { label: "Repeat Bookings", value: pm.repeatBookings },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                  >
                    <p className="text-sm font-semibold text-teal-700">
                      {m.value}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {caregiver.languages?.map((lang) => (
                <span
                  key={lang}
                  className="text-sm px-4 py-1.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Rates
            </h3>
            <div className="space-y-1">
              {[
                { label: "Hourly", value: `₹${caregiver.hourlyRate}/hr` },
                { label: "Daily", value: `₹${caregiver.dailyRate}/day` },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center py-2.5 border-b border-gray-50"
                >
                  <span className="text-sm text-gray-400">{row.label}</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {caregiver.serviceAreas?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Service Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {caregiver.serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="text-xs px-3 py-1 rounded-lg bg-gray-50 text-gray-600 border border-gray-100"
                  >
                    <MapPin className="w-3 h-3" />
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {caregiver.qualifications?.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Qualifications
          </h3>
          <div className="space-y-2">
            {caregiver.qualifications.map((q, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {q.degree}
                  </p>
                  <p className="text-xs text-gray-400">
                    {q.institution} {q.year ? `• ${q.year}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {caregiver.certifications?.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Certifications
          </h3>
          <div className="flex flex-wrap gap-2">
            {caregiver.certifications.map((cert, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-100"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {caregiver.workHistory?.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Work History
          </h3>
          <div className="space-y-3">
            {caregiver.workHistory.map((w, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {w.position}
                  </p>
                  <p className="text-xs text-gray-500">{w.organization}</p>
                  {w.duration && (
                    <p className=" flex text-xs text-gray-400 mt-0.5">
                      <Clock className="w-3 h-3 mt-0.5 " />{" "}
                      <span className="ml-2">{w.duration}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const ReviewsTab = ({ caregiver }) => {
  const rb = caregiver.ratingBreakdown || {};
  const totalRatingCount =
    (rb.fiveStar || 0) +
    (rb.fourStar || 0) +
    (rb.threeStar || 0) +
    (rb.twoStar || 0) +
    (rb.oneStar || 0);

  return (
    <motion.div
      key="reviews"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
    >
      <div className="flex gap-6 mb-6 pb-6 border-b border-gray-50 flex-wrap">
        <div className="text-center">
          <p className="text-5xl font-bold text-gray-900">{caregiver.rating}</p>
          <StarRating rating={caregiver.rating} />
          <p className="text-xs text-gray-400 mt-1">
            {caregiver.totalReviews} reviews
          </p>
        </div>
        <div className="flex-1 min-w-[180px] space-y-2 justify-center flex flex-col">
          <RatingBar
            star={5}
            count={rb.fiveStar || 0}
            total={totalRatingCount}
          />
          <RatingBar
            star={4}
            count={rb.fourStar || 0}
            total={totalRatingCount}
          />
          <RatingBar
            star={3}
            count={rb.threeStar || 0}
            total={totalRatingCount}
          />
          <RatingBar
            star={2}
            count={rb.twoStar || 0}
            total={totalRatingCount}
          />
          <RatingBar
            star={1}
            count={rb.oneStar || 0}
            total={totalRatingCount}
          />
        </div>
      </div>

      <div className="space-y-5">
        {MOCK_REVIEWS.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="pb-5 border-b border-gray-50 last:border-0 last:pb-0"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 text-xs font-semibold">
                  {getInitials(review.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {review.name}
                  </p>
                  <p className="text-[11px] text-gray-400">{review.date}</p>
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed pl-12">
              {review.text}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export const AvailabilityTab = ({
  caregiver,
  selectedDay,
  setSelectedDay,
  selectedSlot,
  setSelectedSlot,
}) => {
  const shifts = caregiver.workingShifts || {};
  const shiftList = [
    { key: "morning", label: "Morning", time: shifts.morning?.timeRange },
    { key: "afternoon", label: "Afternoon", time: shifts.afternoon?.timeRange },
    { key: "evening", label: "Evening", time: shifts.evening?.timeRange },
    { key: "night", label: "Night", time: shifts.night?.timeRange },
  ];

  return (
    <motion.div
      key="availability"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
    >
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Working Shifts
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {shiftList.map((shift) => {
            const isAvail = shifts[shift.key]?.available;
            return (
              <div
                key={shift.key}
                className={`p-3 rounded-xl border text-center ${isAvail ? "bg-teal-50 border-teal-100" : "bg-gray-50 border-gray-100 opacity-50"}`}
              >
                <p
                  className={`text-xs font-medium ${isAvail ? "text-teal-700" : "text-gray-400"}`}
                >
                  {shift.label}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{shift.time}</p>
                <span
                  className={`text-[10px] mt-1 inline-block ${isAvail ? "text-teal-600" : "text-gray-400"}`}
                >
                  {isAvail ? "✓ Available" : "✗ Not available"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {caregiver.emergencyAvailable && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
          <Zap className="w-4 h-4 text-red-500" />
          <p className="text-sm text-red-700 font-medium">
            Available for emergency cases
          </p>
        </div>
      )}

      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Select a day
      </h3>
      <div className="flex gap-2 mb-6 flex-wrap">
        {DAYS.map((day) => (
          <button
            key={day}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${selectedDay === day ? "bg-teal-600 text-white border-teal-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
          >
            {day}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
