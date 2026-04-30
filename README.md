# 🏥 Care24 — Home Healthcare Services Platform

> Connecting patients with verified, professional caregivers — right at their doorstep.

**Live Demo:** [care24-frontend-tjrg.vercel.app](https://care24-frontend-tjrg.vercel.app)  
**Backend Repo:** [Care24 Backend](https://github.com/chiragdhiman99/Care24-backend)

---

## 📌 About The Project

Care24 is a full-stack home healthcare booking platform that allows users to browse verified caregivers, book services, and make secure online payments — all from the comfort of their home. The platform bridges the gap between patients needing professional home care and qualified caregivers available in their city.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login & registration with token-based auth
- 👩‍⚕️ **Caregiver Listings** — Browse caregivers by service, location, experience & rating
- 📅 **Booking System** — Book caregivers with date, time, duration & patient details
- 💳 **Razorpay Payment Integration** — Secure online payments with order creation & signature verification
- 📧 **Email Notifications** — Booking confirmation emails sent automatically
- 🧾 **Payment Confirmation Page** — Detailed booking summary post-payment
- 📱 **Fully Responsive UI** — Mobile-first design with Tailwind CSS
- ⚡ **Smooth Animations** — Page transitions and loading states for great UX

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Icons | Lucide React |
| Payment Gateway | Razorpay |
| Unique IDs | UUID v4 |
| Deployment | Vercel |

---

## 📁 Project Structure

```
Care24-frontend/
├── public/
├── src/
│   ├── common/
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Caregivers.jsx
│   │   ├── PaymentSection.jsx
│   │   └── PaymentConfirmation.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- Razorpay Account (Test Mode)

### Installation

```bash
# Clone the repository
git clone https://github.com/chiragdhiman99/Care24-frontend.git

# Navigate to project directory
cd Care24-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here
```

---

## 💳 Payment Flow

```
User clicks Pay
      ↓
Create Order (Backend → Razorpay)
      ↓
Razorpay Checkout Modal opens
      ↓
User completes payment
      ↓
Verify Signature (Backend)
      ↓
Booking confirmed + Email sent
      ↓
Navigate to Confirmation Page
```

---

## 🔗 API Endpoints Used

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payment/create-order` | Creates a Razorpay order |
| POST | `/api/payment/verify-payment` | Verifies payment signature & creates booking |

---

## 📦 Key Dependencies

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "lucide-react": "latest",
  "uuid": "^9.x",
  "razorpay": "test mode"
}
```

---

## 🌐 Deployment

The frontend is deployed on **Vercel** with automatic deployments on every push to `main`.

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🤝 Backend

This frontend works with the Care24 REST API backend built with Node.js, Express, and MongoDB.

Backend handles:
- User authentication (JWT)
- Caregiver management
- Razorpay order creation & payment verification
- Booking creation
- Email notifications via Nodemailer

---

## 👨‍💻 Author

**Chirag Dhiman**  
[GitHub](https://github.com/chiragdhiman99)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
