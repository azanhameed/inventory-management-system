# Inventory Management System (INVENTO)

INVENTO is a premium, full-stack Inventory Management System built on the MERN stack. It features real-time stock logging, statistical dashboard analysis, and directory directories for categories, suppliers, and items.

---

## 🚀 Features

- **Dynamic Analytics Dashboard**:
  - Stat cards summarizing key inventory indicators (Product counts, Category counts, Supplier counts, Low stock alerts, Total inventory valuation).
  - Elegant graphical representation using Recharts displaying top products by quantity.
  - Real-time tabular warnings for low stock items.
  - Quick-view log showing recent inventory transaction activities.
- **Product Directory**:
  - Add, edit, view, and delete product profiles.
  - Advanced search filters mapping names and SKUs.
  - Inline quick-adjust quantity editor with checkmark confirmation.
  - Low stock warning flags tied directly to custom thresholds.
- **Category Classification**:
  - Complete category setup with descriptions.
  - Real-time calculation displaying the exact number of active products inside each category.
- **Supplier Vendor Registry**:
  - Detailed supplier files recording name, email, phone numbers, and physical addresses.
- **Transactions Logger**:
  - Unified chronological ledger capturing all stock movements.
  - Color-coded transaction rows (Green background for **Stock In**, Red background for **Stock Out**).
  - Validation to prevent negative stock-out changes.

---

## 🛠️ Technologies Used

### Backend
- **Node.js** & **Express JS** for the REST API server.
- **MongoDB** & **Mongoose** for the database schema definition.
- **dotenv** for environment configuration.
- **cors** for handling cross-origin requests.

### Frontend
- **React JS** (scaffolded via **Vite**) for the client application.
- **Redux Toolkit** & **React Redux** for global state management.
- **React Router DOM** for navigation layout and URL routing.
- **Axios** for HTTP API communications.
- **Recharts** for rendering high-fidelity dashboard charts.
- **React Icons** for modern SVG interface iconography.
- **React Toastify** for elegant status/error toast notifications.
- **Vanilla CSS** with CSS Custom Properties for responsive layouts.

---

## ⚙️ Environment Variables (Backend)

Create a `.env` file inside the `backend/` folder. Refer to the `.env.example` for keys:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/inventory_db
```

- `PORT`: The port number on which the backend server will run (defaults to `5000`).
- `MONGO_URI`: The MongoDB Atlas connection string or local MongoDB instance URI.

---

## 🛠️ Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v16+ recommended).
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster configured, or MongoDB running locally.

### Step 1: Clone and Scaffolding
Ensure you are in the project root directory.

### Step 2: Backend Setup
1. Navigate into the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file as described in the **Environment Variables** section.
4. Run the development server:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000` and automatically connect to MongoDB.

### Step 3: Frontend Setup
1. Navigate into the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will boot up at `http://localhost:5173/`. Open this URL in your web browser.
