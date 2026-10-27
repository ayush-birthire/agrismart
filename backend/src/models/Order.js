const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    village: { type: String, default: '' },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Direct UPI / NetBanking (Test Sandbox)', 'Kisan Credit Card (Simulated)'],
    default: 'Cash on Delivery',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Refunded'],
    default: 'Pending',
  },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Placed',
  },
  statusTimeline: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
  }],
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate order number before saving
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    this.orderNumber = `ORD-AGRI-${randomSuffix}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);

