const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  createTransaction
} = require('../controllers/transactionController');

router.route('/')
  .get(getAllTransactions)
  .post(createTransaction);

module.exports = router;
