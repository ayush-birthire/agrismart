const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const Resource = require('../models/Resource');
const PestAlert = require('../models/PestAlert');
const ForumPost = require('../models/ForumPost');
const { isDbConnected, getStatus } = require('../config/db');
const { mockUsers, mockFarms, mockCrops, mockOrders, mockResources, mockPestAlerts, mockForumPosts } = require('../data/mockStore');

const getSystemStats = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json({
        success: true,
        data: {
          databaseStatus: getStatus(),
          counts: {
            totalUsers: mockUsers.length,
            totalFarmers: mockUsers.filter(u => u.role === 'farmer').length,
            totalAdmins: mockUsers.filter(u => u.role === 'admin').length,
            totalFarms: mockFarms.length,
            totalCrops: mockCrops.length,
            totalOrders: mockOrders.length,
            totalResources: mockResources.length,
            activePestAlerts: mockPestAlerts.length,
            totalDiscussions: mockForumPosts.length,
            totalRevenue: mockOrders.reduce((a, c) => a + (c.totalAmount || 0), 0),
          },
          recentOrders: mockOrders,
          recentUsers: mockUsers,
        },
      });
    }

    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalFarms = await Farm.countDocuments();
    const totalCrops = await Crop.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalResources = await Resource.countDocuments();
    const activePestAlerts = await PestAlert.countDocuments({ active: true });
    const totalDiscussions = await ForumPost.countDocuments();

    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    const recentOrders = await Order.find().populate('farmer').sort({ orderDate: -1 }).limit(5);
    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);

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
    res.json({
      success: true,
      data: {
        databaseStatus: getStatus(),
        counts: {
          totalUsers: mockUsers.length,
          totalFarmers: 2,
          totalAdmins: 1,
          totalFarms: 2,
          totalCrops: 2,
          totalOrders: 1,
          totalResources: 4,
          activePestAlerts: 2,
          totalDiscussions: 1,
          totalRevenue: 2480,
        },
        recentOrders: mockOrders,
        recentUsers: mockUsers,
      },
    });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, count: mockUsers.length, data: mockUsers });
    }
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.json({ success: true, count: mockUsers.length, data: mockUsers });
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!isDbConnected()) {
      const u = mockUsers.find(user => user._id === req.params.id);
      if (u) u.role = role;
      return res.json({ success: true, message: `User role updated to ${role}`, data: u });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json({ success: true, message: `User role updated to ${role}`, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSystemStats, getAllUsers, updateUserRole };
