# 🌍 ResQMap

<div align="center">
  <h3>A Unified Disaster Relief & Resource Management System</h3>
  <p>Streamlining emergency responses, resource distribution, and real-time mapping during crises.</p>
</div>

---

## 🚀 Overview

**ResQMap (AidSync)** is a disaster management platform that helps agencies, volunteers, and victims coordinate during emergencies. It provides real-time situational awareness, resource tracking, and analytics to ensure aid reaches those in need.

---

## ✨ Key Features

- 🗺️ Interactive Relief Map (React Leaflet)
- 🚨 Emergency Alert System
- 📊 Resource Analytics Dashboard (Recharts)
- 📱 Responsive UI (Tailwind CSS)
- ⚡ Fast & Reliable (Vite + Node)

---

## 🛠️ Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Leaflet, Recharts, Lucide React

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT-based auth

---

## 📁 Full Project Folder Structure

```
ResQMap/
├── Frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── eslint.config.js
│   ├── README.md
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── main.jsx
│       ├── index.css
│       ├── App.css
│       ├── App.jsx
│       ├── assets/
│       │   ├── hero.png
│       │   ├── react.svg
│       │   └── vite.svg
│       ├── components/
│       │   ├── AuthGuard.jsx
│       │   ├── EmergencyBanner.jsx
│       │   ├── ErrorBoundary.jsx
│       │   ├── FilterBar.jsx
│       │   ├── HeatmapLayer.jsx
│       │   ├── LoadingSpinner.jsx
│       │   ├── ResourceCard.jsx
│       │   ├── ResourceChart.jsx
│       │   ├── ResourceMap.jsx
│       │   ├── RoutePlanner.jsx
│       │   ├── Sidebar.jsx
│       │   ├── StatCard.jsx
│       │   ├── StatusBadge.jsx
│       │   └── Toast.jsx
│       ├── contexts/
│       │   └── AuthContext.jsx
│       ├── hooks/
│       │   └── useWebSocket.js
│       ├── layouts/
│       │   └── DashboardLayout.jsx
│       ├── pages/
│       │   ├── CreateResource.jsx
│       │   ├── Dashboard.jsx
│       │   ├── FilterPage.jsx
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   └── ResourceDetail.jsx
│       ├── routes/
│       │   └── AppRoutes.jsx
│       ├── services/
│       │   ├── api.js
│       │   └── resources.js
│       └── utils/
│           ├── constants.js
│           └── validators.js

├── Backend/
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── allocationController.js
│       │   ├── authController.js
│       │   ├── healthController.js
│       │   ├── reportController.js
│       │   ├── requestController.js
│       │   └── resourceController.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   └── errorMiddleware.js
│       ├── models/
│       │   ├── Request.js
│       │   ├── Resource.js
│       │   └── User.js
│       ├── routes/
│       │   ├── allocationRoutes.js
│       │   ├── authRoutes.js
│       │   ├── healthRoutes.js
│       │   ├── reportRoutes.js
│       │   ├── requestRoutes.js
│       │   └── resourceRoutes.js
│       └── utils/
│           └── resourceValidation.js

└── README.md
```

---

## 🔧 Quick Setup (PowerShell)

1) Clone the repo

```powershell
git clone https://github.com/coder-Yash886/ResQMap.git; cd "ResQMap"
```

2) Frontend

```powershell
cd Frontend; npm install; npm run dev
```

- Visit: http://localhost:5173/

3) Backend

```powershell
cd Backend; npm install
# create a .env file (example below)
# development: npm run dev  (uses nodemon)
npm run dev
# or: npm start
```

### Backend/.env example

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=replace_with_a_strong_secret
PORT=5000
```

---

If you want, I can add a `Backend/.env.example` file to the repository and update `Frontend/src/services/api.js` with an environment-based API URL. Let me know which additional details you want included.

