# 🌍 ResQMap - AidSync

<div align="center">
  <h3>A Unified Disaster Relief & Resource Management System</h3>
  <p>Streamlining emergency responses, resource distribution, and real-time mapping during crises.</p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
</p>

---

## 🚀 Overview

**ResQMap (AidSync)** is a comprehensive disaster management and logistics platform designed to help agencies, volunteers, and affected individuals coordinate effectively during emergencies. 

By integrating real-time situational awareness with interactive mapping and resource tracking, ResQMap ensures that vital supplies (food, water, medical aid) reach those most in need.

## ✨ Key Features

- 🗺️ **Interactive Relief Map**: Real-time visualization of disaster zones, resource distribution points, and heatmap layers using **Leaflet**.
- 📍 **Intelligent Route Planning**: Built-in routing systems to calculate safe and optimal paths for aid delivery using the interactive map.
- 🚨 **Emergency Alert System**: Dynamic alert banners to quickly broadcast critical warnings and priority updates to all active users.
- 📊 **Resource Analytics Dashboard**: Insightful real-time charts and metrics powered by **Recharts** to monitor aid levels, distribution status, and active requests.
- 🔐 **Secure Authentication**: Robust user access control driven by **Firebase Authentication** and Firebase Admin API.
- 📱 **Fully Responsive UI**: A beautifully crafted, modern user interface utilizing **Tailwind CSS** and Lucide icons, ensuring usability on any device in the field.
- ⚡ **High Performance API**: Fast, reliable Node.js/Express backend connected to a MongoDB cluster for real-time CRUD operations.

## 🏗️ Architecture

ResQMap follows a decoupled client-server architecture:

- **Frontend (`/Frontend`)**: Built with React and Vite. Handles user interaction, mapping (`react-leaflet`), chart visualization, and state management. Communicates with the backend REST API.
- **Backend (`/Backend`)**: Built with Node.js and Express. Manages the business logic, resource allocations, request processing, and connects to MongoDB (`mongoose`) for persistent storage.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 19 (via Vite)
- **Styling**: Tailwind CSS
- **Maps & Geospatial**: React Leaflet, Leaflet Heat
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Authentication**: Firebase Auth
- **HTTP Client**: Axios

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Firebase Admin SDK
- **Security & Utilities**: CORS, Dotenv

---

## 📦 Getting Started

Follow these steps to set up the project locally on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/coder-Yash886/ResQMap.git
cd ResQMap
```

### 2. Set up Environment Variables

**Frontend Configuration (`Frontend/.env`)**
Create a `.env` file in the `Frontend` directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:5000/api
```

**Backend Configuration (`Backend/.env`)**
Create a `.env` file in the `Backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FIREBASE_SERVICE_ACCOUNT_KEY=path_to_or_stringified_firebase_admin_key
```

### 3. Run the Backend Server
```bash
cd Backend
npm install
npm run dev
```
*The backend API will start running on `http://localhost:5000/`*

### 4. Run the Frontend Development Server
Open a new terminal window:
```bash
cd Frontend
npm install
npm run dev
```
*The frontend will start running on `http://localhost:5173/`*

---

## 🤝 How to Contribute

We welcome contributions to make ResQMap better! 

1. **Pull the latest changes** from the `main` branch to avoid conflicts:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes** with descriptive messages:
   ```bash
   git add .
   git commit -m "feat: added an amazing feature"
   ```
4. **Push your branch** to GitHub:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request (PR)** on GitHub with a detailed description of your changes.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

<div align="center">
  <br>
  <i>Built with ❤️ to make a difference during critical times.</i>
</div>
