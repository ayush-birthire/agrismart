const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  location: {
    district: { type: String, required: true },
    state: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  current: {
    temperature: { type: Number, required: true }, // Celsius
    feelsLike: { type: Number },
    humidity: { type: Number, required: true }, // %
    rainfall: { type: Number, default: 0 }, // mm
    windSpeed: { type: Number, default: 0 }, // km/h
    condition: { type: String, required: true }, // Sunny, Rainy, Cloudy, etc.
    uvIndex: { type: Number, default: 5 },
    icon: { type: String, default: 'clear-day' },
  },
  forecast: [{
    day: { type: String },
    date: { type: Date },
    tempMin: { type: Number },
    tempMax: { type: Number },
    condition: { type: String },
    rainProbability: { type: Number }, // %
    icon: { type: String },
  }],
  agriculturalAdvisory: {
    sprayingCondition: { type: String, enum: ['Favorable', 'Caution', 'Unfavorable'], default: 'Favorable' },
    irrigationAdvice: { type: String, default: 'Standard irrigation schedule' },
    pestRiskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  },
  recordedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('WeatherData', weatherDataSchema);

