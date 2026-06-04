const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate({
        path: 'product',
        populate: [
          { path: 'category' },
          { path: 'supplier' }
        ]
      })
      .sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new transaction (stock-in or stock-out)
// @route   POST /api/transactions
// @access  Public
const createTransaction = async (req, res) => {
  try {
    const { product: productId, type, quantity, note } = req.body;

    if (!productId || !type || !quantity) {
      return res.status(400).json({ message: 'Product, type, and quantity are required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    if (type !== 'stock-in' && type !== 'stock-out') {
      return res.status(400).json({ message: 'Invalid transaction type (must be stock-in or stock-out)' });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate new quantity
    let newQuantity = product.quantity;
    if (type === 'stock-in') {
      newQuantity += quantity;
    } else if (type === 'stock-out') {
      if (product.quantity < quantity) {
        return res.status(400).json({
          message: `Insufficient stock. Available: ${product.quantity}, Requested: ${quantity}`
        });
      }
      newQuantity -= quantity;
    }

    // Create the transaction
    const transaction = await Transaction.create({
      product: productId,
      type,
      quantity,
      note
    });

    // Update product stock
    product.quantity = newQuantity;
    await product.save();

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate({
        path: 'product',
        populate: [
          { path: 'category' },
          { path: 'supplier' }
        ]
      });

    res.status(201).json(populatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTransactions,
  createTransaction
};
