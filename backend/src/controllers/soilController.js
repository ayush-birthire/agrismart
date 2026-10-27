const SoilReport = require('../models/SoilReport');
const Farm = require('../models/Farm');

// Utility: Evaluate soil health and generate tailored agronomic recommendations
const analyzeSoilMetrics = (phLevel, nitrogen, phosphorus, potassium, organicCarbon, moisture) => {
  const recommendations = [];
  let score = 100;
  let status = 'Optimal';

  // 1. pH Level Analysis (Ideal: 6.0 - 7.5)
  if (phLevel < 6.0) {
    score -= 15;
    status = 'Acidic';
    recommendations.push({
      category: 'pH Balance',
      tip: `Soil pH is acidic (${phLevel}). Apply agricultural lime (calcium carbonate) or dolomite at 1-2 tons/ha to raise pH and improve nutrient uptake.`,
      priority: 'High',
    });
  } else if (phLevel > 7.5) {
    score -= 15;
    status = 'Alkaline';
    recommendations.push({
      category: 'pH Balance',
      tip: `Soil pH is alkaline (${phLevel}). Apply gypsum (calcium sulphate) or organic compost to lower pH and release locked micronutrients.`,
      priority: 'High',
    });
  }

  // 2. Nitrogen (N) Analysis (Ideal: 280 - 560 kg/ha)
  if (nitrogen < 280) {
    score -= 15;
    recommendations.push({
      category: 'Nitrogen (N) Deficiency',
      tip: `Low nitrogen (${nitrogen} kg/ha). Apply split doses of Urea or incorporate leguminous green manure crops (dhaincha/sunhemp) to boost vegetative vigor.`,
      priority: 'High',
    });
  } else if (nitrogen > 560) {
    score -= 5;
    recommendations.push({
      category: 'Excess Nitrogen',
      tip: `Excessive nitrogen (${nitrogen} kg/ha). Reduce synthetic nitrogen fertilizers to prevent vegetative overgrowth and pest susceptibility.`,
      priority: 'Medium',
    });
  }

  // 3. Phosphorus (P) Analysis (Ideal: 15 - 35 kg/ha)
  if (phosphorus < 15) {
    score -= 10;
    recommendations.push({
      category: 'Phosphorus (P) Deficiency',
      tip: `Low phosphorus (${phosphorus} kg/ha). Apply Single Super Phosphate (SSP) or Diammonium Phosphate (DAP) during land preparation to enhance root development.`,
      priority: 'High',
    });
  }

  // 4. Potassium (K) Analysis (Ideal: 140 - 280 kg/ha)
  if (potassium < 140) {
    score -= 10;
    recommendations.push({
      category: 'Potassium (K) Deficiency',
      tip: `Low potassium (${potassium} kg/ha). Apply Muriate of Potash (MOP) to increase drought tolerance, disease resistance, and grain filling.`,
      priority: 'Medium',
    });
  }

  // 5. Organic Carbon (Ideal: > 0.75%)
  if (organicCarbon < 0.5) {
    score -= 10;
    recommendations.push({
      category: 'Organic Matter',
      tip: `Low organic carbon (${organicCarbon}%). Incorporate well-decomposed Farmyard Manure (FYM) or Vermicompost at 5-10 tons/ha.`,
      priority: 'Medium',
    });
  }

  // 6. Moisture (Ideal: 20% - 35%)
  if (moisture < 15) {
    score -= 10;
    recommendations.push({
      category: 'Soil Moisture',
      tip: `Soil moisture is low (${moisture}%). Schedule drip irrigation cycle and apply organic mulching (crop residues) to reduce evaporation loss.`,
      priority: 'High',
    });
  }

  const finalScore = Math.max(20, Math.min(100, score));
  if (finalScore < 60) status = 'Deficient';
  else if (finalScore >= 60 && finalScore < 80) status = 'Moderate';
  else if (status === 'Acidic' || status === 'Alkaline') { /* keep pH classification */ }
  else status = 'Optimal';

  return { finalScore, status, recommendations };
};

// @desc    Get all soil reports for user's farms
// @route   GET /api/soil
// @access  Private
const getSoilReports = async (req, res, next) => {
  try {
    const { farmId } = req.query;
    let query = {};

    if (req.user.role !== 'admin') {
      query.farmer = req.user._id;
    }

    if (farmId) query.farm = farmId;

    const reports = await SoilReport.find(query)
      .populate('farm', 'name location totalArea soilType')
      .sort({ sampleDate: -1 });

    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single soil report by ID
// @route   GET /api/soil/:id
// @access  Private
const getSoilReportById = async (req, res, next) => {
  try {
    const report = await SoilReport.findById(req.params.id)
      .populate('farm', 'name location totalArea soilType irrigationType')
      .populate('farmer', 'name email phone');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Soil report not found' });
    }

    if (req.user.role !== 'admin' && report.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to access this soil report' });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new soil test record & run automatic analysis
// @route   POST /api/soil
// @access  Private
const createSoilReport = async (req, res, next) => {
  try {
    const { farm, phLevel, nitrogen, phosphorus, potassium, organicCarbon, moisture, sampleDate } = req.body;

    if (!farm || phLevel === undefined || nitrogen === undefined || phosphorus === undefined || potassium === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Farm, pH Level, Nitrogen, Phosphorus, and Potassium parameters are required',
      });
    }

    // Verify farm ownership
    const farmRecord = await Farm.findById(farm);
    if (!farmRecord) {
      return res.status(404).json({ success: false, message: 'Specified farm does not exist' });
    }

    if (req.user.role !== 'admin' && farmRecord.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to add soil report to this farm' });
    }

    // Compute scientific agronomic score & recommendations
    const { finalScore, status, recommendations } = analyzeSoilMetrics(
      Number(phLevel),
      Number(nitrogen),
      Number(phosphorus),
      Number(potassium),
      Number(organicCarbon || 0.5),
      Number(moisture || 20)
    );

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

    res.status(201).json({
      success: true,
      message: 'Soil health analysis generated successfully',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete soil test report
// @route   DELETE /api/soil/:id
// @access  Private
const deleteSoilReport = async (req, res, next) => {
  try {
    const report = await SoilReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Soil report not found' });
    }

    if (req.user.role !== 'admin' && report.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this report' });
    }

    await report.deleteOne();

    res.json({
      success: true,
      message: 'Soil report removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSoilReports, getSoilReportById, createSoilReport, deleteSoilReport };

