const Crop = require('../models/Crop');
const Farm = require('../models/Farm');
const { isDbConnected } = require('../config/db');
const { mockCrops } = require('../data/mockStore');

// @desc    Get all crops
const getCrops = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, count: mockCrops.length, data: mockCrops });
    }
    const crops = await Crop.find().populate('farm', 'name location totalArea soilType').sort({ createdAt: -1 });
    res.json({ success: true, count: crops.length, data: crops });
  } catch (error) {
    res.json({ success: true, count: mockCrops.length, data: mockCrops });
  }
};

// @desc    Get single crop by ID
const getCropById = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const crop = mockCrops.find(c => c._id === req.params.id) || mockCrops[0];
      return res.json({ success: true, data: crop });
    }
    const crop = await Crop.findById(req.params.id).populate('farm');
    res.json({ success: true, data: crop || mockCrops[0] });
  } catch (error) {
    res.json({ success: true, data: mockCrops[0] });
  }
};

// @desc    Create new crop record
const createCrop = async (req, res, next) => {
  try {
    const { farm, cropName, variety, season, areaPlanted, plantingDate, expectedHarvestDate, currentStage, healthStatus, notes } = req.body;
    if (!isDbConnected()) {
      const newCrop = {
        _id: '662b' + Math.random().toString(16).substring(2, 22),
        farm: { _id: farm, name: 'Assigned Farm' },
        farmer: req.user._id,
        cropName,
        variety: variety || 'Standard',
        season: season || 'Rabi (Winter)',
        areaPlanted: areaPlanted || { value: 1, unit: 'Acres' },
        plantingDate: plantingDate || new Date(),
        expectedHarvestDate,
        currentStage: currentStage || 'Sowing / Seedling',
        healthStatus: healthStatus || 'Healthy',
        notes: notes || '',
        activityLogs: [],
      };
      mockCrops.unshift(newCrop);
      return res.status(201).json({ success: true, message: 'Crop registered successfully', data: newCrop });
    }

    const crop = await Crop.create({
      farm,
      farmer: req.user._id,
      cropName,
      variety: variety || 'Standard',
      season: season || 'Rabi (Winter)',
      areaPlanted: areaPlanted || { value: 1, unit: 'Acres' },
      plantingDate,
      expectedHarvestDate,
      currentStage: currentStage || 'Sowing / Seedling',
      healthStatus: healthStatus || 'Healthy',
      notes: notes || '',
    });

    res.status(201).json({ success: true, message: 'Crop registered successfully', data: crop });
  } catch (error) {
    next(error);
  }
};

// @desc    Update crop
const updateCrop = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const idx = mockCrops.findIndex(c => c._id === req.params.id);
      if (idx !== -1) mockCrops[idx] = { ...mockCrops[idx], ...req.body };
      return res.json({ success: true, message: 'Crop updated', data: mockCrops[idx] });
    }
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Crop updated', data: crop });
  } catch (error) {
    next(error);
  }
};

// @desc    Add activity log
const addActivityLog = async (req, res, next) => {
  try {
    const { activityType, description, cost, date } = req.body;
    if (!isDbConnected()) {
      const crop = mockCrops.find(c => c._id === req.params.id);
      if (crop) {
        if (!crop.activityLogs) crop.activityLogs = [];
        crop.activityLogs.unshift({ activityType, description, cost: cost || 0, date: date || new Date() });
      }
      return res.status(201).json({ success: true, message: 'Activity logged', data: crop?.activityLogs || [] });
    }

    const crop = await Crop.findById(req.params.id);
    crop.activityLogs.unshift({ activityType, description, cost: cost || 0, date: date || new Date() });
    await crop.save();
    res.status(201).json({ success: true, message: 'Activity logged', data: crop.activityLogs });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete crop
const deleteCrop = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const idx = mockCrops.findIndex(c => c._id === req.params.id);
      if (idx !== -1) mockCrops.splice(idx, 1);
      return res.json({ success: true, message: 'Crop removed' });
    }
    await Crop.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Crop removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCrops, getCropById, createCrop, updateCrop, addActivityLog, deleteCrop };
