const express = require('express');
const router = express.Router();
const { getSoilReports, getSoilReportById, createSoilReport, deleteSoilReport } = require('../controllers/soilController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getSoilReports)
  .post(createSoilReport);

router.route('/:id')
  .get(getSoilReportById)
  .delete(deleteSoilReport);

module.exports = router;

