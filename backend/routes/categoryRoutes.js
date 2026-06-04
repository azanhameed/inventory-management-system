const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const { adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getAllCategories)
  .post(createCategory);

router.route('/:id')
  .put(updateCategory)
  .delete(adminOnly, deleteCategory);

module.exports = router;
