const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a farm name'],
    trim: true,
  },
  location: {
    address: { type: String, default: '' },
    village: { type: String, default: '' },
    district: { type: String, required: [true, 'District is required'] },
    state: { type: String, required: [true, 'State is required'] },
    pincode: { type: String, default: '' },
  },
  totalArea: {
    value: { type: Number, required: [true, 'Area value is required'] },
    unit: { type: String, enum: ['Acres', 'Hectares', 'Bigha'], default: 'Acres' },
  },
  soilType: {
    type: String,
    enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy', 'Clay', 'Loamy', 'Other'],
    default: 'Loamy',
  },
  irrigationType: {
    type: String,
    enum: ['Drip', 'Sprinkler', 'Canal', 'Tube Well', 'Rainfed', 'Other'],
    default: 'Drip',
  },
  cropsGrown: [{
    type: String,
    trim: true,
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

module.exports = mongoose.model('Farm', farmSchema);

