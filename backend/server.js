require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Inventory API is running" });
});

// Import protect middleware
const { protect } = require('./middleware/auth');

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/categories', protect, require('./routes/categoryRoutes'));
app.use('/api/suppliers', protect, require('./routes/supplierRoutes'));
app.use('/api/products', protect, require('./routes/productRoutes'));
app.use('/api/transactions', protect, require('./routes/transactionRoutes'));
app.use('/api/dashboard', protect, require('./routes/dashboardRoutes'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
