const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: [true, 'Crop must be linked to a Farm'],
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cropName: {
    type: String,
    required: [true, 'Please provide crop name (e.g. Wheat, Rice, Cotton)'],
    trim: true,
  },
  variety: {
    type: String,
    trim: true,
    default: 'Standard',
  },
  season: {
    type: String,
    enum: ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)', 'Perennial'],
    default: 'Kharif (Monsoon)',
  },
  areaPlanted: {
    value: { type: Number, default: 1 },
    unit: { type: String, default: 'Acres' },
  },
  plantingDate: {
    type: Date,
    required: [true, 'Planting date is required'],
  },
  expectedHarvestDate: {
    type: Date,
  },
  currentStage: {
    type: String,
    enum: ['Land Preparation', 'Sowing / Seedling', 'Vegetative Growth', 'Flowering / Fruiting', 'Maturity / Ripening', 'Harvested'],
    default: 'Sowing / Seedling',
  },
  healthStatus: {
    type: String,
    enum: ['Healthy', 'Good', 'Attention Needed', 'Critical'],
    default: 'Healthy',
  },
  activityLogs: [{
    activityType: {
      type: String,
      enum: ['Irrigation', 'Fertilizer Application', 'Pesticide Spray', 'Weeding', 'Soil Test', 'Inspection', 'Other'],
      required: true,
    },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
    cost: { type: Number, default: 0 },
  }],
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Crop', cropSchema);

