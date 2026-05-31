# Expense Tracker with Analytics

A full-stack application built using the MERN stack (MongoDB, Express, React, Node.js). This app provides a robust platform for tracking expenses, managing budgets, and visualizing spending habits.

## 🌟 Key Features

### Backend (Node.js & Express)
- **User Authentication:** Secure login and registration using JSON Web Tokens (JWT) and bcrypt.
- **Expense Management:** Full CRUD operations for daily expenses with custom categories.
- **Budget Tracking:** Set and track weekly/monthly budgets with automatic limit comparisons.
- **Analytics & Reports:** Aggregation pipelines for statistics, plus PDF and CSV export options.
- **Automated Background Jobs:** Built-in scheduler (`node-cron`) for recurring tasks.

### Frontend (React & Vite)
- **Modern UI:** Built with an eye-catching "Glassmorphism" effect, dark mode (`#0f172a`), and responsive design.
- **Interactive Charts:** Visual breakdowns of categories and spending trends using Recharts.
- **Secure State:** Context-driven authentication with JWTs stored safely.
- **Live Tracking:** Dynamic progress bars that alert you when budgets are exceeded.

## 🛠️ Technology Stack

- **Frontend:** React, Vite, React Router DOM, Axios, Recharts, Lucide React, pure CSS.
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Bcryptjs, Node-Cron, PDFKit, Swagger UI.

## 🚀 How to Run Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running on the default port `27017`.

### 2. Setup the Backend
Open a terminal in the root directory and navigate to the backend folder:
```bash
cd backend
npm install
```
Configure your environment variables by checking the `.env` file in the `backend` folder:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/expense_tracker
USE_REDIS=false
JWT_SECRET=supersecretjwtkey_change_in_production
JWT_EXPIRES_IN=1d
...
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a **new** terminal window and navigate to the frontend folder:
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

### 4. Access the App
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API & Swagger Docs:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 📁 Project Structure

```text
.
├── backend/            # Express Server, Mongoose Models, API routes
└── frontend/           # React SPA, Vite config, Components, CSS
```
