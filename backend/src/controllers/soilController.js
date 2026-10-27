const SoilReport = require('../models/SoilReport');
const Farm = require('../models/Farm');
const { isDbConnected } = require('../config/db');
const { mockSoilReports } = require('../data/mockStore');

const analyzeSoilMetrics = (phLevel, nitrogen, phosphorus, potassium, organicCarbon, moisture) => {
  const recommendations = [];
  let score = 100;
  let status = 'Optimal';

  if (phLevel < 6.0) {
    score -= 15;
    status = 'Acidic';
    recommendations.push({
      category: 'pH Balance',
      tip: `Soil pH is acidic (${phLevel}). Apply agricultural lime (calcium carbonate) at 1-2 tons/ha to raise pH and improve nutrient uptake.`,
      priority: 'High',
    });
  } else if (phLevel > 7.5) {
    score -= 15;
    status = 'Alkaline';
    recommendations.push({
      category: 'pH Balance',
      tip: `Soil pH is alkaline (${phLevel}). Apply gypsum (calcium sulphate) or organic compost to lower pH.`,
      priority: 'High',
    });
  }

  if (nitrogen < 280) {
    score -= 15;
    recommendations.push({
      category: 'Nitrogen (N) Deficiency',
      tip: `Low nitrogen (${nitrogen} kg/ha). Apply split doses of Urea or incorporate green manure crops to boost vigor.`,
      priority: 'High',
    });
  }

  if (phosphorus < 15) {
    score -= 10;
    recommendations.push({
      category: 'Phosphorus (P) Deficiency',
      tip: `Low phosphorus (${phosphorus} kg/ha). Apply Single Super Phosphate (SSP) to enhance root development.`,
      priority: 'High',
    });
  }

  if (potassium < 140) {
    score -= 10;
    recommendations.push({
      category: 'Potassium (K) Deficiency',
      tip: `Low potassium (${potassium} kg/ha). Apply MOP to increase drought and disease resistance.`,
      priority: 'Medium',
    });
  }

  const finalScore = Math.max(20, Math.min(100, score));
  if (finalScore < 60) status = 'Deficient';
  else if (finalScore >= 60 && finalScore < 80) status = 'Moderate';

  return { finalScore, status, recommendations };
};

// @desc    Get all soil reports
const getSoilReports = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, count: mockSoilReports.length, data: mockSoilReports });
    }
    const reports = await SoilReport.find().populate('farm').sort({ sampleDate: -1 });
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.json({ success: true, count: mockSoilReports.length, data: mockSoilReports });
  }
};

// @desc    Get single soil report
const getSoilReportById = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const report = mockSoilReports.find(r => r._id === req.params.id) || mockSoilReports[0];
      return res.json({ success: true, data: report });
    }
    const report = await SoilReport.findById(req.params.id).populate('farm');
    res.json({ success: true, data: report || mockSoilReports[0] });
  } catch (error) {
    res.json({ success: true, data: mockSoilReports[0] });
  }
};

// @desc    Create soil report
const createSoilReport = async (req, res, next) => {
  try {
    const { farm, phLevel, nitrogen, phosphorus, potassium, organicCarbon, moisture, sampleDate } = req.body;
    const { finalScore, status, recommendations } = analyzeSoilMetrics(
      Number(phLevel),
      Number(nitrogen),
      Number(phosphorus),
      Number(potassium),
      Number(organicCarbon || 0.5),
      Number(moisture || 20)
    );

    if (!isDbConnected()) {
      const newReport = {
        _id: '662b' + Math.random().toString(16).substring(2, 22),
        farm: { _id: farm, name: 'Assigned Farm' },
        farmer: req.user._id,
        sampleDate: sampleDate || new Date(),
        phLevel: Number(phLevel),
        nitrogen: Number(nitrogen),
        phosphorus: Number(phosphorus),
        potassium: Number(potassium),
        organicCarbon: Number(organicCarbon || 0.5),
        moisture: Number(moisture || 20),
        overallScore: finalScore,
        status,
        recommendations,
      };
      mockSoilReports.unshift(newReport);
      return res.status(201).json({ success: true, message: 'Soil health analysis generated successfully', data: newReport });
    }

    const report = await SoilReport.create({
      farm,
      farmer: req.user._id,
      sampleDate: sampleDate || new Date(),
      phLevel: Number(phLevel),
      nitrogen: Number(nitrogen),
      phosphorus: Number(phosphorus),
      potassium: Number(potassium),
      organicCarbon: Number(organicCarbon || 0.5),
      moisture: Number(moisture || 20),
      overallScore: finalScore,
      status,
      recommendations,
    });

    res.status(201).json({ success: true, message: 'Soil health analysis generated successfully', data: report });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete report
const deleteSoilReport = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const idx = mockSoilReports.findIndex(r => r._id === req.params.id);
      if (idx !== -1) mockSoilReports.splice(idx, 1);
      return res.json({ success: true, message: 'Soil report removed' });
    }
    await SoilReport.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Soil report removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSoilReports, getSoilReportById, createSoilReport, deleteSoilReport };
