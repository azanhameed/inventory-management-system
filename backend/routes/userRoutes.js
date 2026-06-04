const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, getUserStats } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(protect, adminOnly, getAllUsers);

router.route('/stats')
  .get(protect, adminOnly, getUserStats);

router.route('/:id/role')
  .put(protect, adminOnly, updateUserRole);

module.exports = router;
