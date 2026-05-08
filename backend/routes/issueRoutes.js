const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', authMiddleware, issueController.getAllIssues);
router.get('/my-issues', authMiddleware, issueController.getUserIssues);
router.post('/', authMiddleware, upload.single('image'), issueController.createIssue);
router.put('/:id', authMiddleware, issueController.updateIssueStatus);
router.delete('/:id', authMiddleware, issueController.deleteIssue);
router.post('/:id/upvote', authMiddleware, issueController.upvoteIssue);

module.exports = router;