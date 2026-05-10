const Issue = require('../models/Issue');
const path = require('path');
const fs = require('fs');

exports.getAllIssues = async (req, res) => {
  try {
    const { category, status, priority, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (status) {
      filter.status = status === 'submitted' ? { $in: ['pending', 'submitted'] } : status;
    }
    if (priority) filter.priority = priority;
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const count = await Issue.countDocuments(filter);
    const issues = await Issue.find(filter)
      .populate('reportedBy', 'name email')
      .populate('upvotes', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    res.json({
      issues,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalIssues: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserIssues = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = { reportedBy: req.userId };
    
    const count = await Issue.countDocuments(filter);
    const issues = await Issue.find(filter)
      .populate('upvotes', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    res.json({
      issues,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalIssues: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('upvotes', 'name');
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createIssue = async (req, res) => {
  try {
    const { 
      title, description, category, location, priority = 'Medium',
      aiPriorityScore, impactSummary, department
    } = req.body;

    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;

    let imageUrl = '';
    if (req.file) {
      // Convert buffer to Base64 string
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const mimeType = req.file.mimetype;
      imageUrl = `data:${mimeType};base64,${b64}`;
    }

    const issue = new Issue({
      title,
      description,
      category,
      priority,
      aiPriorityScore: aiPriorityScore || 0,
      impactSummary: impactSummary || '',
      department: department || 'General',
      location: parsedLocation,
      imageUrl: imageUrl,
      reportedBy: req.userId,
      status: 'submitted',
      timeline: [{
        status: 'submitted',
        message: 'Problem reported by citizen',
        timestamp: new Date()
      }]
    });
    
    await issue.save();
    res.status(201).json(issue);
  } catch (error) {
    console.error('Submission Error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Data validation failed: ' + Object.values(error.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.updateIssueStatus = async (req, res) => {
  try {
    const { status, priority, message } = req.body;
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    if (status && status !== issue.status) {
      issue.status = status;
      issue.timeline.push({
        status,
        message: message || `Status updated to ${status}`,
        timestamp: Date.now()
      });
    }
    
    if (priority && priority !== issue.priority) {
      issue.priority = priority;
      issue.timeline.push({
        status: issue.status,
        message: `Priority changed to ${priority}`,
        timestamp: Date.now()
      });
    }
    
    issue.updatedAt = Date.now();
    await issue.save();
    
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    const imagePath = issue.imageUrl ? path.join(__dirname, '..', issue.imageUrl) : null;
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    await issue.deleteOne();
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    const hasUpvoted = issue.upvotes.includes(req.userId);
    
    if (hasUpvoted) {
      issue.upvotes = issue.upvotes.filter(id => id.toString() !== req.userId);
    } else {
      issue.upvotes.push(req.userId);
    }
    
    await issue.save();
    res.json({ upvoteCount: issue.upvotes.length, hasUpvoted: !hasUpvoted });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getIssueStats = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const pendingIssues = await Issue.countDocuments({ status: { $in: ['pending', 'submitted'] } });
    const inProgressIssues = await Issue.countDocuments({ status: 'in-progress' });
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
    const emergencyIssues = await Issue.countDocuments({ priority: 'Emergency' });
    
    const categoryStats = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const statusStats = await Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const departmentStats = await Issue.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    const avgResolutionTime = await Issue.aggregate([
      { $match: { status: 'resolved' } },
      { 
        $project: { 
          resolutionTime: { $subtract: ['$updatedAt', '$createdAt'] } 
        } 
      },
      { $group: { _id: null, avgTime: { $avg: '$resolutionTime' } } }
    ]);

    const monthlyTrends = await Issue.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          emergency: { $sum: { $cond: [{ $eq: ['$priority', 'Emergency'] }, 1, 0] } }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const recentActivity = await Issue.find()
      .populate('reportedBy', 'name')
      .sort({ updatedAt: -1 })
      .limit(10);

    const heatPoints = await Issue.find({}, { location: 1, aiPriorityScore: 1 });

    res.json({
      total: totalIssues,
      pending: pendingIssues,
      inProgress: inProgressIssues,
      resolved: resolvedIssues,
      emergency: emergencyIssues,
      byCategory: categoryStats,
      byStatus: statusStats,
      byDepartment: departmentStats,
      avgResolutionTime: avgResolutionTime[0]?.avgTime || 0,
      heatPoints: heatPoints.map(p => ({
        lat: p.location.lat,
        lng: p.location.lng,
        intensity: (p.aiPriorityScore || 50) / 100
      })),
      monthlyTrends: monthlyTrends.map(item => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        complaints: item.count,
        resolved: item.resolved,
        emergency: item.emergency
      })),
      recentActivity: recentActivity.map(act => ({
        id: act._id,
        user: act.reportedBy?.name,
        title: act.title,
        status: act.status,
        priority: act.priority,
        time: act.updatedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
