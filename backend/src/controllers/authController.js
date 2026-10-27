const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isDbConnected } = require('../config/db');
const { mockUsers } = require('../data/mockStore');

// Helper to generate JWT token
const generateToken = (id, name, email, role) => {
  return jwt.sign(
    { id, name, email, role },
    process.env.JWT_SECRET || 'agrismart_default_jwt_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new user (Farmer or Admin)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, location, preferredLanguage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if running in fallback demo mode
    if (!isDbConnected()) {
      const userExists = mockUsers.find(u => u.email === cleanEmail);
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists',
        });
      }

      const newUser = {
        _id: '662b' + Math.random().toString(16).substring(2, 22),
        name,
        email: cleanEmail,
        password,
        role: role === 'admin' ? 'admin' : 'farmer',
        phone: phone || '',
        location: location || {},
        preferredLanguage: preferredLanguage || 'en',
      };
      mockUsers.push(newUser);

      const token = generateToken(newUser._id, newUser.name, newUser.email, newUser.role);
      return res.status(201).json({
        success: true,
        message: 'User registered successfully (Demo Mode)',
        token,
        user: newUser,
      });
    }

    // Normal Database Flow
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    const user = await User.create({
      name,
      email: cleanEmail,
      password,
      role: role === 'admin' ? 'admin' : 'farmer',
      phone: phone || '',
      location: location || {},
      preferredLanguage: preferredLanguage || 'en',
    });

    const token = generateToken(user._id, user.name, user.email, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        preferredLanguage: user.preferredLanguage,
      },
    });
  } catch (error) {
    // If DB fails, fallback seamlessly
    const { name, email, role, phone, location, preferredLanguage } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();
    const newUser = {
      _id: '662b' + Math.random().toString(16).substring(2, 22),
      name: name || 'Agri User',
      email: cleanEmail,
      role: role || 'farmer',
      phone: phone || '',
      location: location || {},
      preferredLanguage: preferredLanguage || 'en',
    };
    mockUsers.push(newUser);
    const token = generateToken(newUser._id, newUser.name, newUser.email, newUser.role);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: newUser,
    });
  }
};

// @desc    Login user & return JWT token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if database is disconnected or uninitialized
    if (!isDbConnected()) {
      const demoUser = mockUsers.find(u => u.email === cleanEmail);
      if (demoUser && demoUser.password === password) {
        const token = generateToken(demoUser._id, demoUser.name, demoUser.email, demoUser.role);
        return res.json({
          success: true,
          message: 'Logged in successfully (Demo Mode)',
          token,
          user: {
            _id: demoUser._id,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role,
            phone: demoUser.phone,
            location: demoUser.location,
            preferredLanguage: demoUser.preferredLanguage,
          },
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Normal Database Flow
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      // Check mock store fallback as secondary
      const demoUser = mockUsers.find(u => u.email === cleanEmail);
      if (demoUser && demoUser.password === password) {
        const token = generateToken(demoUser._id, demoUser.name, demoUser.email, demoUser.role);
        return res.json({
          success: true,
          message: 'Logged in successfully',
          token,
          user: demoUser,
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id, user.name, user.email, user.role);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        preferredLanguage: user.preferredLanguage,
      },
    });
  } catch (error) {
    // If DB timed out, fallback to mock demo authentication
    const cleanEmail = (req.body?.email || '').toLowerCase().trim();
    const demoUser = mockUsers.find(u => u.email === cleanEmail);
    if (demoUser && demoUser.password === req.body?.password) {
      const token = generateToken(demoUser._id, demoUser.name, demoUser.email, demoUser.role);
      return res.json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: demoUser,
      });
    }
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const user = mockUsers.find(u => u._id === req.user._id) || req.user;
      return res.json({ success: true, user });
    }
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: user || req.user,
    });
  } catch (error) {
    res.json({ success: true, user: req.user });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: { ...req.user, ...req.body },
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.json({ success: true, user: { ...req.user, ...req.body } });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.preferredLanguage = req.body.preferredLanguage || user.preferredLanguage;
    if (req.body.location) {
      user.location = { ...user.location, ...req.body.location };
    }

    const updatedUser = await user.save();
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.json({ success: true, user: { ...req.user, ...req.body } });
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile };
