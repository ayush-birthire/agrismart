const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

// @desc    Get all crops for user's farms
// @route   GET /api/crops
// @access  Private
const getCrops = async (req, res, next) => {
  try {
    const { farmId, status, stage } = req.query;
    let query = {};

    if (req.user.role !== 'admin') {
      query.farmer = req.user._id;
    }

    if (farmId) query.farm = farmId;
    if (status) query.healthStatus = status;
    if (stage) query.currentStage = stage;

    const crops = await Crop.find(query)
      .populate('farm', 'name location totalArea soilType')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: crops.length,
      data: crops,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single crop by ID
// @route   GET /api/crops/:id
// @access  Private
const getCropById = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id)
      .populate('farm', 'name location totalArea soilType irrigationType')
      .populate('farmer', 'name email phone');

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop record not found' });
    }

    if (req.user.role !== 'admin' && crop.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this crop record' });
    }

    res.json({
      success: true,
      data: crop,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new crop record under a farm
// @route   POST /api/crops
// @access  Private
const createCrop = async (req, res, next) => {
  try {
    const { farm, cropName, variety, season, areaPlanted, plantingDate, expectedHarvestDate, currentStage, healthStatus, notes } = req.body;

    if (!farm || !cropName || !plantingDate) {
      return res.status(400).json({
        success: false,
        message: 'Farm ID, crop name, and planting date are required',
      });
    }

    // Verify farm ownership
    const farmRecord = await Farm.findById(farm);
    if (!farmRecord) {
      return res.status(404).json({ success: false, message: 'Specified farm does not exist' });
    }

    if (req.user.role !== 'admin' && farmRecord.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to add crop to this farm' });
    }

    const crop = await Crop.create({
      farm,
      farmer: req.user._id,
      cropName,
      variety: variety || 'Standard',
      season: season || 'Kharif (Monsoon)',
      areaPlanted: areaPlanted || { value: 1, unit: 'Acres' },
      plantingDate,
      expectedHarvestDate,
      currentStage: currentStage || 'Sowing / Seedling',
      healthStatus: healthStatus || 'Healthy',
      notes: notes || '',
    });

    // Also update cropsGrown list in Farm document if not already included
    if (!farmRecord.cropsGrown.includes(cropName)) {
      farmRecord.cropsGrown.push(cropName);
      await farmRecord.save();
    }

    res.status(201).json({
      success: true,
      message: 'Crop record added successfully',
      data: crop,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update crop details or status
// @route   PUT /api/crops/:id
// @access  Private
const updateCrop = async (req, res, next) => {
  try {
    let crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (req.user.role !== 'admin' && crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this crop' });
    }

    crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Crop record updated successfully',
      data: crop,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add activity log to crop (e.g. Irrigation, Spraying)
// @route   POST /api/crops/:id/activity
// @access  Private
const addActivityLog = async (req, res, next) => {
  try {
    const { activityType, description, cost, date } = req.body;

    if (!activityType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Activity type and description are required',
      });
    }

    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (req.user.role !== 'admin' && crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to log activity on this crop' });
    }

    crop.activityLogs.unshift({
      activityType,
      description,
      cost: cost || 0,
      date: date || new Date(),
    });

    await crop.save();

    res.status(201).json({
      success: true,
      message: 'Activity logged successfully',
      data: crop.activityLogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete crop record
// @route   DELETE /api/crops/:id
// @access  Private
const deleteCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (req.user.role !== 'admin' && crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this crop' });
    }

    await crop.deleteOne();

    res.json({
      success: true,
      message: 'Crop record removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCrops, getCropById, createCrop, updateCrop, addActivityLog, deleteCrop };

