const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductQuantity,
  deleteProduct
} = require('../controllers/productController');

router.route('/')
  .get(getAllProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

router.route('/:id/quantity')
  .patch(updateProductQuantity);

module.exports = router;
