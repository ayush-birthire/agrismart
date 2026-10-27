const ForumPost = require('../models/ForumPost');
const { isDbConnected } = require('../config/db');
const { mockForumPosts } = require('../data/mockStore');

const getForumPosts = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, count: mockForumPosts.length, data: mockForumPosts });
    }
    const posts = await ForumPost.find().sort({ createdAt: -1 });
    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.json({ success: true, count: mockForumPosts.length, data: mockForumPosts });
  }
};

const getForumPostById = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const post = mockForumPosts.find(p => p._id === req.params.id) || mockForumPosts[0];
      return res.json({ success: true, data: post });
    }
    const post = await ForumPost.findById(req.params.id);
    res.json({ success: true, data: post || mockForumPosts[0] });
  } catch (error) {
    res.json({ success: true, data: mockForumPosts[0] });
  }
};

const createForumPost = async (req, res, next) => {
  try {
    const { title, content, category, isExpertConsultation, tags } = req.body;
    if (!isDbConnected()) {
      const post = {
        _id: '662b' + Math.random().toString(16).substring(2, 22),
        title,
        content,
        author: req.user._id,
        authorName: req.user.name,
        authorRole: req.user.role,
        category: category || 'General Discussion',
        isExpertConsultation: Boolean(isExpertConsultation),
        status: isExpertConsultation ? 'Under Review' : 'Open',
        tags: tags || [],
        upvotes: 0,
        replies: [],
        createdAt: new Date(),
      };
      mockForumPosts.unshift(post);
      return res.status(201).json({ success: true, message: 'Discussion published', data: post });
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
    res.status(201).json({ success: true, message: 'Discussion published', data: post });
  } catch (error) {
    next(error);
  }
};

const addReply = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!isDbConnected()) {
      const post = mockForumPosts.find(p => p._id === req.params.id);
      if (post) {
        if (!post.replies) post.replies = [];
        const isExpert = req.user.role === 'admin' || req.user.role === 'expert';
        post.replies.push({
          authorName: req.user.name,
          content,
          isExpertReply: isExpert,
          createdAt: new Date(),
        });
        if (isExpert && post.isExpertConsultation) post.status = 'Answered by Expert';
      }
      return res.status(201).json({ success: true, message: 'Reply posted', data: post?.replies || [] });
    }

    const post = await ForumPost.findById(req.params.id);
    post.replies.push({
      author: req.user._id,
      authorName: req.user.name,
      content,
      isExpertReply: req.user.role === 'admin',
      createdAt: new Date(),
    });
    await post.save();
    res.status(201).json({ success: true, message: 'Reply posted', data: post.replies });
  } catch (error) {
    next(error);
  }
};

const upvotePost = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const post = mockForumPosts.find(p => p._id === req.params.id);
      if (post) post.upvotes = (post.upvotes || 0) + 1;
      return res.json({ success: true, upvotes: post?.upvotes || 1 });
    }
    const post = await ForumPost.findById(req.params.id);
    post.upvotes += 1;
    await post.save();
    res.json({ success: true, upvotes: post.upvotes });
  } catch (error) {
    next(error);
  }
};

const deleteForumPost = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const idx = mockForumPosts.findIndex(p => p._id === req.params.id);
      if (idx !== -1) mockForumPosts.splice(idx, 1);
      return res.json({ success: true, message: 'Post removed' });
    }
    await ForumPost.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Post removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getForumPosts, getForumPostById, createForumPost, addReply, upvotePost, deleteForumPost };
