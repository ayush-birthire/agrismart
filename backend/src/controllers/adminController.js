const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const Resource = require('../models/Resource');
const PestAlert = require('../models/PestAlert');
const ForumPost = require('../models/ForumPost');
const { getStatus } = require('../config/db');

// @desc    Get comprehensive system analytics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private / Admin
const getSystemStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const totalFarms = await Farm.countDocuments();
    const totalCrops = await Crop.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalResources = await Resource.countDocuments();
    const activePestAlerts = await PestAlert.countDocuments({ active: true });
    const totalDiscussions = await ForumPost.countDocuments();

    // Calculate total order revenue
    const orders = await Order.find({ paymentStatus: 'Completed' });
    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('farmer', 'name email phone')
      .sort({ orderDate: -1 })
      .limit(5);

    // Recent user signups
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        databaseStatus: getStatus(),
        counts: {
          totalUsers,
          totalFarmers,
          totalAdmins,
          totalFarms,
          totalCrops,
          totalOrders,
          totalResources,
          activePestAlerts,
          totalDiscussions,
          totalRevenue,
        },
        recentOrders,
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list (Admin only)
// @route   GET /api/admin/users
// @access  Private / Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or status (Admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private / Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['farmer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSystemStats, getAllUsers, updateUserRole };

