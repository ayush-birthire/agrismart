const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilReport = require('../models/SoilReport');
const { isDbConnected } = require('../config/db');
const { mockFarms } = require('../data/mockStore');

// @desc    Get all farms for the logged-in user
const getFarms = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, count: mockFarms.length, data: mockFarms });
    }
    let query = {};
    if (req.user.role !== 'admin') {
      query.farmer = req.user._id;
    }
    const farms = await Farm.find(query).populate('farmer', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, count: farms.length, data: farms });
  } catch (error) {
    res.json({ success: true, count: mockFarms.length, data: mockFarms });
  }
};

// @desc    Get single farm by ID
const getFarmById = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const farm = mockFarms.find(f => f._id === req.params.id) || mockFarms[0];
      return res.json({ success: true, data: farm });
    }
    const farm = await Farm.findById(req.params.id).populate('farmer', 'name email phone');
    if (!farm) {
      const fallback = mockFarms.find(f => f._id === req.params.id) || mockFarms[0];
      return res.json({ success: true, data: fallback });
    }
    const crops = await Crop.find({ farm: farm._id }).sort({ createdAt: -1 });
    const latestSoilReport = await SoilReport.findOne({ farm: farm._id }).sort({ sampleDate: -1 });
    res.json({
      success: true,
      data: { ...farm.toObject(), crops, latestSoilReport },
    });
  } catch (error) {
    res.json({ success: true, data: mockFarms[0] });
  }
};

// @desc    Create new farm profile
const createFarm = async (req, res, next) => {
  try {
    const { name, location, totalArea, soilType, irrigationType, cropsGrown, notes } = req.body;
    if (!name || !location?.district || !location?.state || !totalArea?.value) {
      return res.status(400).json({
        success: false,
        message: 'Please provide farm name, district, state, and total area size',
      });
    }

    if (!isDbConnected()) {
      const newFarm = {
        _id: '662b' + Math.random().toString(16).substring(2, 22),
        farmer: { _id: req.user._id, name: req.user.name },
        name,
        location,
        totalArea,
        soilType: soilType || 'Loamy',
        irrigationType: irrigationType || 'Drip',
        cropsGrown: cropsGrown || [],
        notes: notes || '',
        createdAt: new Date(),
      };
      mockFarms.unshift(newFarm);
      return res.status(201).json({ success: true, message: 'Farm profile created successfully', data: newFarm });
    }

    const farm = await Farm.create({
      farmer: req.user._id,
      name,
      location,
      totalArea,
      soilType: soilType || 'Loamy',
      irrigationType: irrigationType || 'Drip',
      cropsGrown: cropsGrown || [],
      notes: notes || '',
    });

    res.status(201).json({ success: true, message: 'Farm profile created successfully', data: farm });
  } catch (error) {
    next(error);
  }
};

// @desc    Update farm profile
const updateFarm = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const idx = mockFarms.findIndex(f => f._id === req.params.id);
      if (idx !== -1) mockFarms[idx] = { ...mockFarms[idx], ...req.body };
      return res.json({ success: true, message: 'Farm profile updated successfully', data: mockFarms[idx] });
    }
    const farm = await Farm.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Farm profile updated successfully', data: farm });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete farm profile
const deleteFarm = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const idx = mockFarms.findIndex(f => f._id === req.params.id);
      if (idx !== -1) mockFarms.splice(idx, 1);
      return res.json({ success: true, message: 'Farm removed successfully' });
    }
    await Farm.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Farm removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFarms, getFarmById, createFarm, updateFarm, deleteFarm };
