# 🌾 AgriSmart - Smart Agricultural Management Platform

> **Empowering farmers through digital technology, scientific agronomic insights, real-time meteorology, and agricultural marketplace access.**  
> *Built with the complete MERN Stack (MongoDB, Express.js, React.js, Node.js).*

---

## 📌 Project Overview & Problem Statement

Agriculture is the economic backbone of millions of livelihoods, yet smallholder and commercial farmers continually face challenges from erratic weather fluctuations, insidious pest infestations, nutrient-depleted soil, and fragmented supply chains.

**AgriSmart** is a production-grade, smart farming management web application tailored to bridge traditional farming with modern digital tools. It provides an intuitive, **bilingual (English & Hindi)**, mobile-responsive digital ecosystem that allows farmers to make data-driven decisions, maximize crop yields, prevent disease losses, and directly procure certified agricultural resources.

---

## 🌟 Core Modules & Epics (Aligned with SkillWallet Curriculum)

| # | Epic / Module | Key Features & Implementation |
|---|---|---|
| 1 | **Role-Based Security & Auth** | Dual-role authentication (**Farmer** vs. **Admin**) powered by **JWT (JSON Web Tokens)** and **bcrypt** password encryption with secure session handling. |
| 2 | **Farm Profile Management** | Comprehensive land parcel registration, soil classification (Black, Alluvial, Loamy), GPS district coordinates, and irrigation systems (Drip, Sprinkler). |
| 3 | **Crop Monitoring & Health** | Track planting dates, expected harvest schedules, phenological growth stages (Sowing → Vegetative → Flowering → Harvested), and log field activity interventions with cost tracking. |
| 4 | **Soil Health Diagnostic Analysis** | Lab/sensor input evaluation for Nitrogen (N), Phosphorus (P), Potassium (K), pH, Organic Carbon, and Moisture with **automated health scoring (0-100)** and tailored scientific agronomic recommendations. |
| 5 | **Weather Forecasting & Pest Alerts** | Hyperlocal 7-day meteorological forecasts, spraying suitability advisories, and active regional pest warnings with organic bio-remedies and chemical treatments. |
| 6 | **Agri Marketplace & Order Tracking** | Full e-commerce catalog for certified seeds, fertilizers, bio-pesticides, and irrigation tools with cart management, simulated checkout, and **live shipment status tracking (`Placed` → `Processing` → `Dispatched` → `Delivered`)**. |
| 7 | **Kisan Community & Agronomist Forum** | Farmer discussion boards and dedicated **Certified Agronomist Consultation** threads for disease diagnosis and government subsidy advice. |
| 8 | **Admin Command Center** | Centralized oversight dashboard for platform metrics, user role management, content moderation, and shipment status fulfillment. |

---

## 🛠️ Technology Stack

- **Frontend**: React.js 18 (Vite), Bootstrap 5, Lucide Icons, Axios, React Router v6.
- **Backend**: Node.js (v16+), Express.js RESTful API, Morgan Logger, Centralized Error Handling.
- **Database**: MongoDB (Atlas cloud-ready with seamless in-memory fallback), Mongoose ODM.
- **Security**: JSON Web Tokens (JWT), bcryptjs password hashing, Role-Based Route Guards.
- **Internationalization**: Full bilingual support (English & हिन्दी) with instant language toggle.
- **API Testing**: Postman Collection JSON included (`postman/AgriSmart_API_Collection.postman_collection.json`).

---

## 🚀 Quick Start Guide (How to Run Locally)

### Prerequisites
Make sure **Node.js (v16 or higher)** is installed on your computer.

### Step 1: Install Dependencies
Open your terminal in the project root directory and run:
```bash
npm run install:all
```
*(This installs all required packages for both the backend and frontend).*

### Step 2: Seed Demo Data (Optional but Recommended)
Populate your database with realistic farms, crops, active pest outbreaks, and marketplace catalog items:
```bash
npm run seed
```

### Step 3: Run the Full Platform
Start both the Backend API and Frontend web client with a single command:
```bash
npm start
```

- **Frontend Web Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Login Credentials

For convenience during evaluation, the platform includes pre-configured demo accounts:

| Role | Email | Password | Description |
|---|---|---|---|
| **Farmer** | `farmer@agrismart.org` | `farmerpassword123` | Pre-configured with active farms, crops, and order history |
| **Admin** | `admin@agrismart.org` | `adminpassword123` | Full access to Admin Portal, user directory, and order status controls |
| **Ayush** | `ayush@agrismart.org` | `ayushpassword123` | Hindi-default farmer profile with chickpea crop cycles |

*(The login page also provides one-click autofill buttons for these accounts).*

---

## 🧪 Postman API Collection Testing

A complete Postman collection is included in the [`postman/`](./postman/) directory:
1. Open Postman.
2. Click **Import** and select `postman/AgriSmart_API_Collection.postman_collection.json`.
3. Test endpoints across Authentication, Farms, Crops, Soil Diagnostics, Weather, and Orders.

---

## 📁 Project Architecture & Directory Structure

```text
agrismart/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection and resilience handlers
│   │   ├── controllers/     # Business logic for all 8 functional modules
│   │   ├── data/            # Seeder script with rich agricultural demo datasets
│   │   ├── middleware/      # JWT auth, role validation (RBAC), and error handlers
│   │   ├── models/          # Mongoose schemas (Users, Farms, Crops, Orders, Soil, Weather)
│   │   ├── routes/          # Express route definitions
│   │   └── server.js        # Express application entrypoint
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, ProtectedRoute, LanguageSwitcher
│   │   ├── context/         # AuthContext (JWT session) and LanguageContext (EN/HI)
│   │   ├── pages/           # 10 Responsive screens (Dashboard, Farms, Crops, Soil, etc.)
│   │   ├── services/        # Axios API client functions
│   │   ├── translations/    # Bilingual dictionaries (en.json and hi.json)
│   │   ├── App.jsx          # Route hierarchy
│   │   └── main.jsx         # React DOM mount point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── postman/                 # Exportable Postman collection for evaluator grading
├── .gitignore               # Clean git exclusions
├── README.md                # Comprehensive project documentation
└── run-app.js               # Concurrent single-command runner
```

---

## 📜 Evaluation & Submission Compliance

- ✅ **6 Epics & 19 Functional Tasks Covered**: Complete CRUD for all entities.
- ✅ **Referential Integrity**: MongoDB document schemas strictly link farmers to their respective farms, crops, and orders.
- ✅ **Zero Cost**: Built entirely using open-source, free tools, free database tiers, and zero paid APIs.
- ✅ **Rural Accessibility**: Clean iconography, high color contrast, bilingual language toggles, and mobile-first responsive layout.

---
*Created by Ayush Birthire for SmartBridge / SkillWallet Full-Stack MERN Evaluation.*

