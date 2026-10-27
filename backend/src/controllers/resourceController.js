const Resource = require('../models/Resource');
const { isDbConnected } = require('../config/db');
const { mockResources } = require('../data/mockStore');

const getResources = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const { category, search } = req.query;
      let list = [...mockResources];
      if (category && category !== 'All') {
        list = list.filter(r => r.category === category);
      }
      if (search) {
        list = list.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()));
      }
      return res.json({ success: true, count: list.length, data: list });
    }

    const { category, search } = req.query;
    let query = { isApproved: true };
    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    const resources = await Resource.find(query);
    res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    res.json({ success: true, count: mockResources.length, data: mockResources });
  }
};

const getResourceById = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const item = mockResources.find(r => r._id === req.params.id) || mockResources[0];
      return res.json({ success: true, data: item });
    }
    const resource = await Resource.findById(req.params.id);
    res.json({ success: true, data: resource || mockResources[0] });
  } catch (error) {
    res.json({ success: true, data: mockResources[0] });
  }
};

const createResource = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const item = { _id: '662b' + Math.random().toString(16).substring(2, 22), ...req.body };
      mockResources.push(item);
      return res.status(201).json({ success: true, message: 'Resource added', data: item });
    }
    const resource = await Resource.create(req.body);
    res.status(201).json({ success: true, message: 'Resource added', data: resource });
  } catch (error) {
    next(error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const idx = mockResources.findIndex(r => r._id === req.params.id);
      if (idx !== -1) mockResources[idx] = { ...mockResources[idx], ...req.body };
      return res.json({ success: true, message: 'Resource updated', data: mockResources[idx] });
    }
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Resource updated', data: resource });
  } catch (error) {
    next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const idx = mockResources.findIndex(r => r._id === req.params.id);
      if (idx !== -1) mockResources.splice(idx, 1);
      return res.json({ success: true, message: 'Resource removed' });
    }
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Resource removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getResources, getResourceById, createResource, updateResource, deleteResource };
