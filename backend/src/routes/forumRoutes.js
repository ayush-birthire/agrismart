const express = require('express');
const router = express.Router();
const { getForumPosts, getForumPostById, createForumPost, addReply, upvotePost, deleteForumPost } = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getForumPosts);
router.get('/:id', getForumPostById);

router.post('/', protect, createForumPost);
router.post('/:id/reply', protect, addReply);
router.put('/:id/upvote', protect, upvotePost);
router.delete('/:id', protect, deleteForumPost);

module.exports = router;

