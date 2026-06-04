const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductQuantity,
  deleteProduct,
  uploadProductImage
} = require('../controllers/productController');
const upload = require('../middleware/upload');
const { adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getAllProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(adminOnly, deleteProduct);

router.route('/:id/quantity')
  .patch(adminOnly, updateProductQuantity);

router.route('/:id/image')
  .post(upload.single('image'), uploadProductImage);

module.exports = router;
