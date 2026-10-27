const Resource = require('../models/Resource');

// @desc    Get all agricultural resources (seeds, fertilizers, equipment)
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res, next) => {
  try {
    const { category, search, sort } = req.query;
    let query = { isApproved: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    let queryExec = Resource.find(query);

    if (sort === 'price_asc') queryExec = queryExec.sort({ price: 1 });
    else if (sort === 'price_desc') queryExec = queryExec.sort({ price: -1 });
    else queryExec = queryExec.sort({ createdAt: -1 });

    const resources = await queryExec;

    res.json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Agricultural resource not found' });
    }

    res.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new resource listing (Admin only)
// @route   POST /api/resources
// @access  Private / Admin
const createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create({
      ...req.body,
      approvedBy: req.user._id,
      isApproved: true,
    });

    res.status(201).json({
      success: true,
      message: 'Agricultural resource listed successfully',
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resource details / stock (Admin only)
// @route   PUT /api/resources/:id
// @access  Private / Admin
const updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.json({
      success: true,
      message: 'Resource details updated successfully',
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resource (Admin only)
// @route   DELETE /api/resources/:id
// @access  Private / Admin
const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    await resource.deleteOne();

    res.json({
      success: true,
      message: 'Resource removed from catalog',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getResources, getResourceById, createResource, updateResource, deleteResource };

