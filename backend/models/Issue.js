const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Roads', 'Water', 'Electricity', 'Waste', 'Safety', 'Others']
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: String
  },
  imageUrl: {
    type: String,
    default: ''
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'under-review', 'team-assigned', 'in-progress', 'resolved', 'rejected'],
    default: 'submitted'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Emergency'],
    default: 'Medium'
  },
  aiPriorityScore: {
    type: Number,
    default: 0
  },
  impactSummary: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: 'General'
  },
  timeline: [{
    status: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Issue', issueSchema);
