const mongoose = require('mongoose');

const pestAlertSchema = new mongoose.Schema({
  pestName: {
    type: String,
    required: true,
    trim: true,
  },
  scientificName: {
    type: String,
    default: '',
  },
  affectedCrops: [{
    type: String,
    required: true,
  }],
  severity: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Severe'],
    default: 'Moderate',
  },
  symptoms: [{
    type: String,
  }],
  preventionAdvice: [{
    type: String,
  }],
  organicTreatment: {
    type: String,
    default: '',
  },
  chemicalTreatment: {
    type: String,
    default: '',
  },
  affectedRegions: [{
    type: String,
  }],
  active: {
    type: Boolean,
    default: true,
  },
  reportedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PestAlert', pestAlertSchema);

