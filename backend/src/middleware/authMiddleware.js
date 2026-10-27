const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agrismart_default_jwt_secret');

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        // Fallback for mocked or seeded demo sessions
        req.user = {
          _id: decoded.id,
          name: decoded.name || 'Agri User',
          email: decoded.email || 'user@agrismart.org',
          role: decoded.role || 'farmer',
        };
      }

      return next();
    } catch (error) {
      console.error('[Auth Error]: Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Invalid or expired authentication token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No authentication token provided',
    });
  }
};

module.exports = { protect };

