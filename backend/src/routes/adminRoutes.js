const express = require('express');
const router = express.Router();
const { getSystemStats, getAllUsers, updateUserRole } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin')); // Strictly restricted to admin users only

router.get('/stats', getSystemStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router;

