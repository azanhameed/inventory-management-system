const Product = require('../models/Product');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');
const Transaction = require('../models/Transaction');

// @desc    Get dashboard summary statistics
// @route   GET /api/dashboard/stats
// @access  Public
const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();

    // Calculate total inventory value
    const products = await Product.find({}, 'price quantity');
    const totalStockValue = products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

    // Get count of products with low stock
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
    });
    const lowStockCount = lowStockProducts.length;

    // Get recent 5 transactions
    const recentTransactions = await Transaction.find()
      .populate('product', 'name SKU')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalProducts,
      totalCategories,
      totalSuppliers,
      totalStockValue,
      lowStockCount,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats
};
