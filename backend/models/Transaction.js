const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product reference is required']
  },
  type: {
    type: String,
    enum: {
      values: ['stock-in', 'stock-out'],
      message: '{VALUE} is not a valid transaction type'
    },
    required: [true, 'Transaction type is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Transaction quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  note: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
