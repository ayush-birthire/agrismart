const WeatherData = require('../models/WeatherData');
const PestAlert = require('../models/PestAlert');

// Realistic dynamic weather generator for agricultural regions
const generateAgriculturalWeatherData = (district = 'Bhopal', state = 'Madhya Pradesh') => {
  const weatherConditions = [
    { cond: 'Sunny / Clear', icon: 'sun', min: 22, max: 34, rain: 0, spray: 'Favorable', irr: 'Light evening irrigation recommended' },
    { cond: 'Partly Cloudy', icon: 'cloud-sun', min: 21, max: 31, rain: 5, spray: 'Favorable', irr: 'Normal irrigation schedule' },
    { cond: 'Scattered Showers', icon: 'cloud-rain', min: 20, max: 28, rain: 25, spray: 'Unfavorable', irr: 'Postpone irrigation; soil has sufficient moisture' },
    { cond: 'Heavy Rain Warning', icon: 'cloud-lightning', min: 19, max: 26, rain: 65, spray: 'Unfavorable', irr: 'Ensure field drainage channels are cleared' },
    { cond: 'Humid & Overcast', icon: 'cloud', min: 23, max: 32, rain: 15, spray: 'Caution', irr: 'Monitor for fungal spores due to high humidity' },
  ];

  const now = new Date();
  const dayIndex = now.getDay() % weatherConditions.length;
  const currentSetup = weatherConditions[dayIndex];

  // 7-day forecast
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const forecast = [];
  for (let i = 0; i < 7; i++) {
    const fDate = new Date();
    fDate.setDate(now.getDate() + i);
    const item = weatherConditions[(dayIndex + i) % weatherConditions.length];
    forecast.push({
      day: days[fDate.getDay()],
      date: fDate,
      tempMin: item.min,
      tempMax: item.max,
      condition: item.cond,
      rainProbability: item.rain,
      icon: item.icon,
    });
  }

  return {
    location: { district, state, latitude: 23.2599, longitude: 77.4126 },
    current: {
      temperature: currentSetup.max - 2,
      feelsLike: currentSetup.max,
      humidity: currentSetup.rain > 20 ? 82 : 55,
      rainfall: currentSetup.rain,
      windSpeed: 12.4,
      condition: currentSetup.cond,
      uvIndex: 7,
      icon: currentSetup.icon,
    },
    forecast,
    agriculturalAdvisory: {
      sprayingCondition: currentSetup.spray,
      irrigationAdvice: currentSetup.irr,
      pestRiskLevel: currentSetup.rain > 30 ? 'High' : 'Low',
    },
    recordedAt: now,
  };
};

// @desc    Get current weather & agricultural forecast
// @route   GET /api/weather
// @access  Public / Private
const getWeather = async (req, res, next) => {
  try {
    const district = req.query.district || 'Indore';
    const state = req.query.state || 'Madhya Pradesh';

    // Check if recent weather data was recorded in MongoDB within the last 30 minutes
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    let weatherRecord = await WeatherData.findOne({
      'location.district': new RegExp(district, 'i'),
      recordedAt: { $gte: thirtyMinsAgo },
    }).sort({ recordedAt: -1 });

    if (!weatherRecord) {
      // Generate realistic dynamic agricultural data
      const weatherPayload = generateAgriculturalWeatherData(district, state);
      weatherRecord = await WeatherData.create(weatherPayload);
    }

    res.json({
      success: true,
      data: weatherRecord,
    });
  } catch (error) {
    // Return generated response even if MongoDB has a transient error
    const fallbackData = generateAgriculturalWeatherData(req.query.district || 'Indore', req.query.state || 'Madhya Pradesh');
    res.json({
      success: true,
      data: fallbackData,
    });
  }
};

// @desc    Get all active pest alerts
// @route   GET /api/weather/pest-alerts
// @access  Public / Private
const getPestAlerts = async (req, res, next) => {
  try {
    const { crop, region } = req.query;
    let query = { active: true };

    if (crop) query.affectedCrops = { $in: [new RegExp(crop, 'i')] };
    if (region) query.affectedRegions = { $in: [new RegExp(region, 'i')] };

    const alerts = await PestAlert.find(query).sort({ reportedDate: -1 });

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new pest alert (Admin only)
// @route   POST /api/weather/pest-alerts
// @access  Private / Admin
const createPestAlert = async (req, res, next) => {
  try {
    const alert = await PestAlert.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Pest alert published successfully',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pest alert (Admin only)
// @route   PUT /api/weather/pest-alerts/:id
// @access  Private / Admin
const updatePestAlert = async (req, res, next) => {
  try {
    const alert = await PestAlert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Pest alert not found' });
    }
    res.json({
      success: true,
      message: 'Pest alert updated successfully',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWeather, getPestAlerts, createPestAlert, updatePestAlert };

