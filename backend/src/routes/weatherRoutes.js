const express = require('express');
const router = express.Router();
const { getWeather, getPestAlerts, createPestAlert, updatePestAlert } = require('../controllers/weatherController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getWeather);
router.get('/pest-alerts', getPestAlerts);
router.post('/pest-alerts', protect, authorize('admin'), createPestAlert);
router.put('/pest-alerts/:id', protect, authorize('admin'), updatePestAlert);

module.exports = router;

