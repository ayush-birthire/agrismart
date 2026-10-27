const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorRole: {
    type: String,
    enum: ['farmer', 'admin', 'expert'],
    default: 'farmer',
  },
  category: {
    type: String,
    enum: ['Crop Advisory', 'Soil & Fertilizers', 'Pest Management', 'Market & Mandi Rates', 'Government Schemes & Subsidies', 'General Discussion'],
    default: 'General Discussion',
  },
  isExpertConsultation: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Open', 'Under Review', 'Answered by Expert', 'Resolved'],
    default: 'Open',
  },
  tags: [{
    type: String,
  }],
  replies: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    authorName: { type: String, required: true },
    authorRole: { type: String, default: 'farmer' },
    content: { type: String, required: true },
    isExpertReply: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }],
  upvotes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ForumPost', forumPostSchema);

