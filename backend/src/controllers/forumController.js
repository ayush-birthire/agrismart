const ForumPost = require('../models/ForumPost');

// @desc    Get all community forum posts / expert consultations
// @route   GET /api/forum
// @access  Public / Private
const getForumPosts = async (req, res, next) => {
  try {
    const { category, type, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (type === 'consultation') {
      query.isExpertConsultation = true;
    } else if (type === 'community') {
      query.isExpertConsultation = false;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const posts = await ForumPost.find(query)
      .populate('author', 'name role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single forum post by ID
// @route   GET /api/forum/:id
// @access  Public / Private
const getForumPostById = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name role')
      .populate('replies.author', 'name role');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Discussion post not found' });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new post or consultation request
// @route   POST /api/forum
// @access  Private
const createForumPost = async (req, res, next) => {
  try {
    const { title, content, category, isExpertConsultation, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content description are required',
      });
    }

    const post = await ForumPost.create({
      title,
      content,
      author: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      category: category || 'General Discussion',
      isExpertConsultation: Boolean(isExpertConsultation),
      status: isExpertConsultation ? 'Under Review' : 'Open',
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      message: isExpertConsultation ? 'Expert consultation query submitted' : 'Community discussion published',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add reply / advice to a post
// @route   POST /api/forum/:id/reply
// @access  Private
const addReply = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Reply content cannot be blank' });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const isExpert = req.user.role === 'admin' || req.user.role === 'expert';

    post.replies.push({
      author: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      content,
      isExpertReply: isExpert,
    });

    if (isExpert && post.isExpertConsultation) {
      post.status = 'Answered by Expert';
    }

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Reply posted successfully',
      data: post.replies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote a post
// @route   PUT /api/forum/:id/upvote
// @access  Private
const upvotePost = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.upvotes += 1;
    await post.save();

    res.json({
      success: true,
      upvotes: post.upvotes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post (Owner or Admin)
// @route   DELETE /api/forum/:id
// @access  Private
const deleteForumPost = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (req.user.role !== 'admin' && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this post' });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getForumPosts, getForumPostById, createForumPost, addReply, upvotePost, deleteForumPost };

