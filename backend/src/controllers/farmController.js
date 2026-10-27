const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilReport = require('../models/SoilReport');

// @desc    Get all farms for the logged-in user (or all if admin)
// @route   GET /api/farms
// @access  Private
const getFarms = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.farmer = req.user._id;
    }

    const farms = await Farm.find(query).populate('farmer', 'name email phone').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: farms.length,
      data: farms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single farm by ID with its crops & latest soil report
// @route   GET /api/farms/:id
// @access  Private
const getFarmById = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id).populate('farmer', 'name email phone');

    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm profile not found' });
    }

    // Ownership check (unless admin)
    if (req.user.role !== 'admin' && farm.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this farm' });
    }

    // Relational fetching of associated crops and soil reports
    const crops = await Crop.find({ farm: farm._id }).sort({ createdAt: -1 });
    const latestSoilReport = await SoilReport.findOne({ farm: farm._id }).sort({ sampleDate: -1 });

    res.json({
      success: true,
      data: {
        ...farm.toObject(),
        crops,
        latestSoilReport,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new farm profile
// @route   POST /api/farms
// @access  Private
const createFarm = async (req, res, next) => {
  try {
    const { name, location, totalArea, soilType, irrigationType, cropsGrown, notes } = req.body;

    if (!name || !location?.district || !location?.state || !totalArea?.value) {
      return res.status(400).json({
        success: false,
        message: 'Please provide farm name, district, state, and total area size',
      });
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

    res.status(201).json({
      success: true,
      message: 'Farm profile created successfully',
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update farm profile
// @route   PUT /api/farms/:id
// @access  Private
const updateFarm = async (req, res, next) => {
  try {
    let farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    if (req.user.role !== 'admin' && farm.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this farm' });
    }

    farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Farm profile updated successfully',
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete farm profile
// @route   DELETE /api/farms/:id
// @access  Private
const deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    if (req.user.role !== 'admin' && farm.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this farm' });
    }

    // Cascade delete associated crops & soil reports
    await Crop.deleteMany({ farm: farm._id });
    await SoilReport.deleteMany({ farm: farm._id });
    await farm.deleteOne();

    res.json({
      success: true,
      message: 'Farm profile and all associated crop records removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFarms, getFarmById, createFarm, updateFarm, deleteFarm };

