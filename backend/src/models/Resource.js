const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Resource name is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['Seeds', 'Fertilizers', 'Bio-Pesticides', 'Equipment & Tools', 'Irrigation Kits', 'Soil Enhancers'],
    required: true,
  },
  brand: {
    type: String,
    default: 'AgriQuality',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  unit: {
    type: String,
    enum: ['kg', 'liter', 'bag (50kg)', 'packet', 'piece', 'set'],
    default: 'kg',
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 100,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resource', resourceSchema);

