const User = require('../models/User');

// @desc    Get all registered users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a user's role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || (role !== 'admin' && role !== 'staff')) {
      return res.status(400).json({ message: 'Invalid role. Must be admin or staff.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Do not allow the last admin to demote themselves
    if (user.role === 'admin' && role === 'staff') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1 && user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'Cannot demote the only remaining admin' });
      }
    }

    user.role = role;
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get system user statistics
// @route   GET /api/users/stats
// @access  Private/Admin
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const staffCount = await User.countDocuments({ role: 'staff' });

    res.status(200).json({
      totalUsers,
      adminCount,
      staffCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  getUserStats
};
