const express = require('express');
const router = express.Router();
const {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');

const { adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getAllSuppliers)
  .post(createSupplier);

router.route('/:id')
  .put(updateSupplier)
  .delete(adminOnly, deleteSupplier);

module.exports = router;
