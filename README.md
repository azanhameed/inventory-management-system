# INVENTO - Inventory Management System

A full-stack inventory management web application built with React JS, Express JS, and MongoDB Atlas.

## Live Demo
- Frontend: https://inventory-management-system-nu-cyan.vercel.app
- Backend API: https://inventory-management-system-production-0bfd.up.railway.app

## Project Description
INVENTO is a fully functional inventory management system that allows businesses to manage their products, categories, suppliers, and stock transactions. It includes role-based authentication, a dashboard with charts, and full CRUD operations.

## Features
- JWT-based Authentication (Login & Register)
- Role-based Access Control (Admin & Staff)
- Dashboard with stats cards and bar charts
- Product Management with image upload
- Category Management
- Supplier Management
- Stock Transactions (Stock In / Stock Out)
- Low stock alerts
- Search and filter products
- Responsive UI design
- Admin Panel for user management

## Technologies Used
### Frontend
- React JS (Vite)
- Redux Toolkit
- React Router DOM
- Axios
- Recharts
- React Toastify
- React Icons

### Backend
- Node.js
- Express JS
- Mongoose
- JSON Web Token (JWT)
- Bcrypt JS
- Multer (image upload)
- Dotenv
- CORS

### Database
- MongoDB Atlas

### Deployment
- Frontend: Vercel
- Backend: Railway

## Folder Structure
inventory-management-system/
├── frontend/         # React JS frontend
│   ├── src/
│   │   ├── api/      # Axios instance and API functions
│   │   ├── components/   # Navbar, Sidebar, Layout
│   │   ├── pages/    # Dashboard, Products, Categories, Suppliers, Transactions
│   │   ├── store/    # Redux store and slices
│   │   └── App.jsx
├── backend/          # Express JS backend
│   ├── config/       # Database connection
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Auth and upload middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   └── server.js

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Git

### Environment Variables

Create a `.env` file in the `backend` folder:
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret

Create a `.env` file in the `frontend` folder:
VITE_API_URL=your_backend_url/api

### Installation & Running Locally

#### Backend
cd backend
npm install
npm run dev

#### Frontend
cd frontend
npm install
npm run dev

Frontend runs on: http://localhost:5173
Backend runs on: http://localhost:5000

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Products
- GET /api/products
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id
- PATCH /api/products/:id/quantity
- POST /api/products/:id/image

### Categories
- GET /api/categories
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id

### Suppliers
- GET /api/suppliers
- POST /api/suppliers
- PUT /api/suppliers/:id
- DELETE /api/suppliers/:id

### Transactions
- GET /api/transactions
- POST /api/transactions

### Dashboard
- GET /api/dashboard

## Git Repository
https://github.com/azanhameed/inventory-management-system

## Developed By
Azan Hameed
Enterprise Application Development - Semester Project
Sukkur IBA University - 2026
