<div align="center">

<img src="https://img.shields.io/badge/Care24-Elderly%20Care%20Platform-blue?style=for-the-badge&logo=heart&logoColor=white" alt="Care24 Banner"/>

# 🏥 Care24 — Elderly Care Management System

### *Connecting Families, Caregivers & Administrators — 24/7*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=flat-square&logo=vercel)](https://care24-frontend-tjrg.vercel.app/)

</div>

---

## 📌 Overview

**Care24** is a full-stack elderly care management platform that bridges the gap between **families**, **professional caregivers**, and **administrators**. Families can easily book trusted caregivers, track health records, and communicate in real-time — all in one place.

> Built with love for the people who care — and for those being cared for. ❤️

---

## 🌐 Live Demo

🔗 **[https://care24-frontend-tjrg.vercel.app/](https://care24-frontend-tjrg.vercel.app/)**

---

## 👥 User Roles

Care24 supports **3 distinct roles**, each with its own dedicated dashboard and feature set:

| Role | Description |
|------|-------------|
| 👨‍👩‍👧 **Family** | Books caregivers, manages health records, chats with caregiver |
| 🧑‍⚕️ **Caregiver** | Manages bookings, creates profile, communicates with families |
| 🛡️ **Admin** | Full control — manages users, caregivers, bookings, platform-wide |

---

## ✨ Features

### 👨‍👩‍👧 Family / User
- 📅 **Appointments** — View and track all upcoming & past appointments
- 🏥 **Health Records** — Add and monitor personal health data
- 💬 **Real-time Chat** — Message your caregiver directly in-app
- 🔔 **Live Notifications** — Instant alerts via Socket.io

### 🧑‍⚕️ Caregiver
- 📋 **Booking Management** — View, accept, or manage assigned bookings
- 👤 **Profile Setup** — Build a professional caregiver profile to attract families
- 💬 **Real-time Chat** — Communicate with families seamlessly
- 🔔 **Live Notifications** — Get notified on new bookings & messages instantly

### 🛡️ Admin
- 👥 **User Management** — View, manage, activate/deactivate users
- 🧑‍⚕️ **Caregiver Management** — Approve/manage caregiver applications & profiles
- 📆 **Booking Oversight** — Monitor and manage all platform bookings
- 🔔 **Live Notifications** — Platform-wide real-time updates

---

## ⚡ Real-Time Features

Care24 uses **Socket.io** to power live updates across all dashboards:

- 💬 Live chat between families and caregivers
- 🔔 Real-time in-app notifications (new bookings, messages, status changes)
- 📡 Instant dashboard updates without page refresh

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **Routing** | React Router DOM v6 |
| **Real-time** | Socket.io Client v4 |
| **HTTP Client** | Axios |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast + Sonner |
| **PDF Export** | React to PDF |
| **Drag & Drop** | React Draggable |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
Care24-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Route-level pages
│   │   ├── admin/          # Admin dashboard & pages
│   │   ├── caregiver/      # Caregiver dashboard & pages
│   │   └── family/         # Family/user dashboard & pages
│   ├── context/            # React context (auth, socket, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service layer (Axios)
│   └── utils/              # Helper utilities
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/chiragdhiman99/Care24-frontend.git

# 2. Navigate to the project directory
cd Care24-frontend

# 3. Install dependencies
npm install

# 4. Create your environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Running the App

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

App will be running at **`http://localhost:5173`** 🎉

---

## 🔗 Backend Repository

This is the **frontend** of Care24. The backend (Node.js / Express / MongoDB) is maintained separately.

> 🔧 Backend Repo: *(Add your backend repo link here)*

---

## 📸 Screenshots

> *(Add screenshots of your dashboards here — Family, Caregiver, Admin)*

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ by [Chirag Dhiman](https://github.com/chiragdhiman99)

⭐ Star this repo if you found it helpful!

</div>
