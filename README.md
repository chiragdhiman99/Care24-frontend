<div align="center">

```
 ██████╗ █████╗ ██████╗ ███████╗    ██████╗ ██╗  ██╗
██╔════╝██╔══██╗██╔══██╗██╔════╝   ╚════██╗██║  ██║
██║     ███████║██████╔╝█████╗      █████╔╝███████║
██║     ██╔══██║██╔══██╗██╔══╝     ██╔═══╝ ╚════██║
╚██████╗██║  ██║██║  ██║███████╗   ███████╗     ██║
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ╚══════╝     ╚═╝
```

### 🏥 *Professional Home Healthcare — Delivered with Care*

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-care24--frontend.vercel.app-00C896?style=for-the-badge&logoColor=white)](https://care24-frontend-tjrg.vercel.app)
[![Backend Repo](https://img.shields.io/badge/⚙️_Backend_Repo-Care24_API-0A0A0A?style=for-the-badge&logo=github&logoColor=white)](https://github.com/chiragdhiman99/Care24-backend)
[![MIT License](https://img.shields.io/badge/📄_License-MIT-3B82F6?style=for-the-badge)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

<br/>

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-0C2451?style=flat-square&logo=razorpay&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)

</div>

---

<br/>

## 🌟 What is Care24?

> **Care24** isn't just a platform — it's a bridge between vulnerability and compassion.

Imagine your elderly parent needs a trained nurse at home. Or a post-surgery patient needs daily wound care. Or a new mother needs a verified caregiver. **Care24 makes that happen in minutes.**

A full-stack home healthcare booking platform where patients can:
- 🔍 **Discover** verified caregivers filtered by specialization, rating & location
- 📅 **Book instantly** with real-time slot selection
- 💳 **Pay securely** via Razorpay with instant confirmation
- 📧 **Get notified** automatically via email the moment a booking is confirmed

<br/>

---

## ✨ Feature Showcase

<table>
<tr>
<td width="50%">

### 🔐 Auth & Security
- JWT-based login & registration
- Token stored securely in localStorage
- Protected routes for booking flow
- Signature verification on every payment

</td>
<td width="50%">

### 👩‍⚕️ Caregiver Discovery
- Browse by service type, city & experience
- Star-rated profiles with detailed bios
- Verified badge on all listed caregivers
- Real-time availability display

</td>
</tr>
<tr>
<td width="50%">

### 💳 Seamless Payments
- Razorpay Checkout Modal integration
- Backend order creation + HMAC signature verification
- Test mode ready with live-switch support
- Instant booking confirmation on success

</td>
<td width="50%">

### 📱 World-Class UX
- Mobile-first Tailwind CSS design
- Smooth page transitions & loading states
- Auto-triggered confirmation emails
- Detailed post-payment summary page

</td>
</tr>
</table>

<br/>

---

## 🛠️ Tech Stack — The Engine Room

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  ⚛️  React 18 + Vite      ─  Blazing fast dev & build      │
│  🛣️  React Router v6      ─  Client-side navigation         │
│  🎨 Tailwind CSS          ─  Utility-first styling          │
│  🔗 Axios                 ─  HTTP requests to backend       │
│  🧩 Lucide React          ─  Beautiful icon library         │
│  💳 Razorpay JS SDK       ─  Payment checkout modal         │
│  🆔 UUID v4               ─  Unique booking identifiers     │
│  🚀 Vercel                ─  Zero-config deployment         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                              │
│  🟢 Node.js + Express     ─  REST API server                │
│  🍃 MongoDB + Mongoose    ─  Database & ODM                 │
│  🔑 JWT                   ─  Auth tokens                    │
│  💸 Razorpay Node SDK     ─  Order creation & verification  │
│  📬 Nodemailer            ─  Email notifications            │
└─────────────────────────────────────────────────────────────┘
```

<br/>

---

## 💳 Payment Flow — Step by Step

```
                    ┌──────────────────┐
                    │  User clicks Pay │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  POST /create-   │
                    │  order (Backend) │◄── Razorpay creates order
                    └────────┬─────────┘
                             │
                    ┌────────▼──────────────────┐
                    │  Razorpay Checkout Modal  │
                    │  opens on client side     │
                    └────────┬──────────────────┘
                             │
               ┌─────────────▼────────────────┐
               │  User completes payment       │
               │  (UPI / Card / NetBanking)    │
               └─────────────┬────────────────┘
                             │
                    ┌────────▼──────────────┐
                    │  POST /verify-payment │
                    │  HMAC Signature Check │◄── Prevents fraud
                    └────────┬──────────────┘
                             │
               ┌─────────────▼──────────────────┐
               │  ✅ Booking Created in MongoDB  │
               │  📧 Confirmation Email Sent     │
               │  🧾 Navigate to Confirm Page    │
               └────────────────────────────────┘
```

<br/>

---

## 📁 Project Structure

```
Care24-frontend/
│
├── 📂 public/                  # Static assets
│
├── 📂 src/
│   ├── 📂 common/
│   │   └── 🧭 Navbar.jsx       # Global navigation bar
│   │
│   ├── 📂 pages/
│   │   ├── 🏠 Home.jsx          # Landing page with hero + features
│   │   ├── 👩‍⚕️ Caregivers.jsx    # Browse & filter caregivers
│   │   ├── 💳 PaymentSection.jsx       # Booking form + Razorpay trigger
│   │   └── ✅ PaymentConfirmation.jsx  # Post-payment booking summary
│   │
│   ├── ⚛️  App.jsx              # Route definitions
│   └── 🚀 main.jsx             # React DOM entry point
│
├── 📄 index.html
├── ⚙️  vite.config.js
├── 🔧 vercel.json              # Vercel SPA redirect config
└── 📦 package.json
```

<br/>

---

## 🚀 Getting Started — Run Locally in 60 Seconds

### Prerequisites

Make sure you have these installed:

| Tool | Version |
|------|---------|
| Node.js | v18+ |
| npm / yarn | Latest |
| Razorpay Account | Test Mode |

### ⚡ Quick Setup

```bash
# 1️⃣  Clone the repository
git clone https://github.com/chiragdhiman99/Care24-frontend.git

# 2️⃣  Jump into the project
cd Care24-frontend

# 3️⃣  Install all dependencies
npm install

# 4️⃣  Set up environment variables (see below)
cp .env.example .env

# 5️⃣  Fire it up 🔥
npm run dev
```

> 🟢 App will be running at **http://localhost:5173**

### 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# ─────────────────────────────────────────
#  Care24 Frontend — Environment Variables
# ─────────────────────────────────────────

VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here
VITE_BACKEND_URL=http://localhost:5000
```

> 💡 Get your Razorpay test keys from [dashboard.razorpay.com](https://dashboard.razorpay.com)

<br/>

---

## 🔗 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & receive JWT |
| `GET` | `/api/caregivers` | Fetch all caregivers |
| `POST` | `/api/payment/create-order` | Create Razorpay order |
| `POST` | `/api/payment/verify-payment` | Verify signature & confirm booking |

<br/>

---

## 🌐 Deployment

The frontend lives on **Vercel** with auto-deployments triggered on every push to `main`.

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

The `vercel.json` handles SPA routing — all paths redirect to `index.html` so React Router works correctly on Vercel.

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

<br/>

---

## 🤝 Backend — The Other Half

This frontend is powered by the **Care24 REST API** — a Node.js + Express + MongoDB backend.

| Feature | Technology |
|---------|-----------|
| Authentication | JWT + bcrypt |
| Database | MongoDB + Mongoose |
| Payments | Razorpay Node SDK |
| Emails | Nodemailer + Gmail SMTP |
| Deployment | Railway / Render |

👉 **[View Backend Repository →](https://github.com/chiragdhiman99/Care24-backend)**

<br/>

---

## 🔮 Roadmap — What's Coming Next

- [ ] 🗓️ **Real-time Availability Calendar** — live slot booking
- [ ] ⭐ **Review & Rating System** — after-service feedback
- [ ] 🔔 **Push Notifications** — booking reminders
- [ ] 📊 **Admin Dashboard** — manage caregivers & bookings
- [ ] 🌍 **Multi-city Expansion** — more cities, more caregivers
- [ ] 💬 **In-app Chat** — patient ↔ caregiver messaging

<br/>

---

## 🐛 Found a Bug?

Open an issue and I'll get on it ASAP.

1. 🔍 Search [existing issues](https://github.com/chiragdhiman99/Care24-frontend/issues) first
2. 🐛 [Open a new issue](https://github.com/chiragdhiman99/Care24-frontend/issues/new) with steps to reproduce
3. 💡 Or even better — submit a **Pull Request**!

<br/>

---

## 👨‍💻 About the Author

<div align="center">

**Built with 💙 by Chirag Dhiman**

*Full-Stack Developer | Passionate about building products that matter*

[![GitHub](https://img.shields.io/badge/GitHub-chiragdhiman99-0A0A0A?style=for-the-badge&logo=github&logoColor=white)](https://github.com/chiragdhiman99)

*If Care24 impressed you, drop a ⭐ — it means the world!*

</div>

<br/>

---

<div align="center">

```
"Healthcare should be accessible to everyone, everywhere."
                                        — The Care24 Vision
```

**Made with React ⚛️ | Powered by passion 🔥 | Deployed on Vercel 🚀**

[![Star this repo](https://img.shields.io/github/stars/chiragdhiman99/Care24-frontend?style=social)](https://github.com/chiragdhiman99/Care24-frontend)

</div>

---

<div align="center">
<sub>© 2024 Care24 — Open Source under MIT License</sub>
</div>
