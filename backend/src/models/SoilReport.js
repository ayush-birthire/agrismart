const mongoose = require('mongoose');

const soilReportSchema = new mongoose.Schema({
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true,
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sampleDate: {
    type: Date,
    default: Date.now,
  },
  phLevel: {
    type: Number,
    required: [true, 'pH Level is required (e.g. 6.5)'],
    min: 0,
    max: 14,
  },
  nitrogen: { // kg/ha
    type: Number,
    required: [true, 'Nitrogen (N) value is required'],
  },
  phosphorus: { // kg/ha
    type: Number,
    required: [true, 'Phosphorus (P) value is required'],
  },
  potassium: { // kg/ha
    type: Number,
    required: [true, 'Potassium (K) value is required'],
  },
  organicCarbon: { // percentage
    type: Number,
    default: 0.5,
  },
  moisture: { // percentage
    type: Number,
    default: 20,
  },
  overallScore: {
    type: Number, // 0 - 100
    default: 75,
  },
  status: {
    type: String,
    enum: ['Optimal', 'Moderate', 'Deficient', 'Acidic', 'Alkaline'],
    default: 'Optimal',
  },
  recommendations: [{
    category: { type: String, default: 'General' },
    tip: { type: String, required: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SoilReport', soilReportSchema);

