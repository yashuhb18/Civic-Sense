const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', authMiddleware, issueController.getAllIssues);
router.post('/analyze-image', authMiddleware, upload.single('image'), aiController.analyzeImage);
router.get('/stats', authMiddleware, adminMiddleware, issueController.getIssueStats);
router.get('/my-issues', authMiddleware, issueController.getUserIssues);
router.get('/:id', authMiddleware, issueController.getIssueById);
router.post('/', authMiddleware, upload.single('image'), issueController.createIssue);
router.put('/:id', authMiddleware, adminMiddleware, issueController.updateIssueStatus);
router.delete('/:id', authMiddleware, adminMiddleware, issueController.deleteIssue);
router.post('/:id/upvote', authMiddleware, issueController.upvoteIssue);

module.exports = router;