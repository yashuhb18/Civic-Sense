const Issue = require('../models/Issue');
const path = require('path');
const fs = require('fs');

exports.getAllIssues = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    
    const issues = await Issue.find(filter)
      .populate('reportedBy', 'name email')
      .populate('upvotes', 'name')
      .sort({ createdAt: -1 });
    
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.userId })
      .populate('upvotes', 'name')
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const parsedLocation = JSON.parse(location);
    
    const issue = new Issue({
      title,
      description,
      category,
      location: parsedLocation,
      imageUrl: `/uploads/${req.file.filename}`,
      reportedBy: req.userId
    });
    
    await issue.save();
    res.status(201).json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    issue.status = status;
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
    
    // Delete image file
    const imagePath = path.join(__dirname, '..', issue.imageUrl);
    if (fs.existsSync(imagePath)) {
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