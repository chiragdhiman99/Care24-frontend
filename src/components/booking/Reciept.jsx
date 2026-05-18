const Receipt = ({ state, receiptRef }) => {
  return (
    <div
      ref={receiptRef}
      style={{
        position: "absolute",
        left: "-9999px",
        fontFamily: "DM Sans, sans-serif",
        width: "1020px",
      }}
    >
      <div
        style={{
          background: "white",
          border: "1px solid #e0ebe2",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#219067",
            padding: "40px 44px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "38px",
                fontWeight: "700",
                color: "white",
                margin: 0,
              }}
            >
              Care<span style={{ color: "#fb923c" }}>24</span>
            </p>
            <p
              style={{
                fontSize: "17px",
                color: "rgba(255,255,255,0.6)",
                margin: "8px 0 0",
              }}
            >
              Official Payment Receipt
            </p>
            <div
              style={{
                marginTop: "18px",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "20px",
                padding: "8px 20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "9px",
              }}
            >
              <div
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  background: "#4ade80",
                }}
              />
              <span
                style={{ fontSize: "15px", color: "white", marginTop: "-10px" }}
              >
                Payment Successful
              </span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.6)",
                margin: 0,
              }}
            >
              Receipt Date
            </p>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "white",
                margin: "6px 0 0",
              }}
            >
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p
              style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.6)",
                margin: "6px 0 0",
              }}
            >
              {new Date().toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div
          style={{
            padding: "28px 44px",
            borderBottom: "1px solid #e0ebe2",
            display: "flex",
            alignItems: "center",
            gap: "22px",
          }}
        >
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "22px",
              overflow: "hidden",
              flexShrink: 0,
              background: "#d1fae5",
            }}
          >
            <img
              src={
                state?.caregiverImage?.startsWith("http")
                  ? state?.caregiverImage
                  : `https://care24-backend-1.onrender.com${state?.caregiverImage}`
              }
              alt="Caregiver"
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "22px",
                fontWeight: "700",
                color: "#1a3a1a",
                margin: 0,
              }}
            >
              {state?.caregiverName}
            </p>
            <p
              style={{ fontSize: "16px", color: "#7a9a80", margin: "6px 0 0" }}
            >
              📍 {state?.caregiverLocation} · {state?.caregiverExperience}{" "}
              experience
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {state?.caregiverTags?.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "14px",
                  background: "#dcfce7",
                  color: "#15803d",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontWeight: "500",
                }}
              >
                {tag
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
            ))}
          </div>
        </div>

        <div style={{ padding: "32px 44px" }}>
          <div
            style={{
              background: "#f9fafb",
              borderRadius: "14px",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "28px",
            }}
          >
            <span style={{ fontSize: "15px", color: "#9ca3af" }}>
              Booking ID
            </span>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1a7a4a",
                letterSpacing: "0.03em",
              }}
            >
              {state?.bookingId}
            </span>
          </div>

          <p
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#d1d5db",
              textTransform: "uppercase",
              letterSpacing: "0.09em",
              margin: "0 0 12px",
            }}
          >
            Booking Details
          </p>
          {[
            { k: "Service", v: state?.service },
            { k: "Date", v: state?.date },
            { k: "Patient", v: state?.patientName },
            { k: "Duration", v: state?.duration },
          ].map(({ k, v }) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "14px 0",
                borderBottom: "1px solid #f3f4f6",
                fontSize: "17px",
              }}
            >
              <span style={{ color: "#9ca3af" }}>{k}</span>
              <span style={{ fontWeight: "600", color: "#1a3a1a" }}>{v}</span>
            </div>
          ))}

          <p
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#d1d5db",
              textTransform: "uppercase",
              letterSpacing: "0.09em",
              margin: "26px 0 12px",
            }}
          >
            Payment Details
          </p>
          {[
            { k: "Method", v: state?.method },
            { k: "Transaction ID", v: state?.transactionId },
          ].map(({ k, v }) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "14px 0",
                borderBottom: "1px solid #f3f4f6",
                fontSize: "17px",
              }}
            >
              <span style={{ color: "#9ca3af" }}>{k}</span>
              <span
                style={{
                  fontWeight: "600",
                  color: "#1a3a1a",
                  fontSize: k === "Transaction ID" ? "14px" : "17px",
                }}
              >
                {v}
              </span>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "26px",
              paddingTop: "22px",
              borderTop: "2px solid #e8f0e9",
            }}
          >
            <span
              style={{ fontSize: "22px", fontWeight: "700", color: "#1a3a1a" }}
            >
              Total Paid
            </span>
            <span
              style={{ fontSize: "42px", fontWeight: "700", color: "#1a7a4a" }}
            >
              ₹{state?.totalAmount}
            </span>
          </div>

          <div
            style={{
              marginTop: "20px",
              background: "#f0fdf4",
              border: "1px solid #86efac",
              borderRadius: "14px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#16a34a",
                flexShrink: 0,
              }}
            />
            <span
              style={{ fontSize: "16px", fontWeight: "600", color: "#15803d" }}
            >
              Payment Verified & Booking Confirmed
            </span>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #e0ebe2",
            padding: "18px 44px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "14px", color: "#9ca3af", margin: 0 }}>
            care24.in · support@care24.in
          </p>
          <p style={{ fontSize: "14px", color: "#9ca3af", margin: 0 }}>
            Thank you for trusting us 🙏
          </p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
