import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getForumPosts, createForumPost, addForumReply, upvoteForumPost } from '../services/api';
import { MessageSquare, ThumbsUp, Send, Plus, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';

const CommunityForum = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'consultation', 'community'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Crop Advisory',
    isExpertConsultation: false,
    tags: '',
  });

  const loadPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeTab === 'consultation') params.type = 'consultation';
      else if (activeTab === 'community') params.type = 'community';
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const res = await getForumPosts(params);
      setPosts(res.data.data || []);
    } catch (err) {
      console.error('Failed to load forum posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [activeTab, selectedCategory]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(s => s.trim()) : [],
      };
      await createForumPost(payload);
      setFeedback({ type: 'success', message: 'Question/Discussion published successfully!' });
      setShowModal(false);
      setFormData({
        title: '',
        content: '',
        category: 'Crop Advisory',
        isExpertConsultation: false,
        tags: '',
      });
      loadPosts();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Failed to submit post' });
    }
  };

  const handleReply = async (postId) => {
    const text = replyText[postId];
    if (!text || !text.trim()) return;

    try {
      await addForumReply(postId, { content: text.trim() });
      setReplyText(prev => ({ ...prev, [postId]: '' }));
      loadPosts();
    } catch (err) {
      alert('Failed to submit reply');
    }
  };

  const handleUpvote = async (postId) => {
    try {
      await upvoteForumPost(postId);
      setPosts(prev =>
        prev.map(p => (p._id === postId ? { ...p, upvotes: (p.upvotes || 0) + 1 } : p))
      );
    } catch (err) {
      console.error('Upvote failed');
    }
  };

  const categories = [
    'All',
    'Crop Advisory',
    'Soil & Fertilizers',
    'Pest Management',
    'Market & Mandi Rates',
    'Government Schemes & Subsidies',
    'General Discussion',
  ];

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <MessageSquare className="text-success" size={28} />
            <span>{t('forum.title')}</span>
          </h2>
          <p className="text-muted small mb-0">{t('forum.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-success d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm fw-semibold"
        >
          <Plus size={18} />
          <span>{t('forum.askQuestion')}</span>
        </button>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show py-2 mb-4`} role="alert">
          {feedback.message}
          <button type="button" className="btn-close" onClick={() => setFeedback(null)}></button>
        </div>
      )}

      {/* Tabs & Category Filter */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <ul className="nav nav-pills gap-1">
            <li className="nav-item">
              <button
                className={`nav-link rounded-pill px-3 py-1 fw-bold ${activeTab === 'all' ? 'active bg-success text-white' : 'text-dark'}`}
                onClick={() => setActiveTab('all')}
              >
                {t('forum.allTopics')}
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link rounded-pill px-3 py-1 fw-bold ${activeTab === 'consultation' ? 'active bg-success text-white' : 'text-dark'}`}
                onClick={() => setActiveTab('consultation')}
              >
                🎓 {t('forum.consultationOnly')}
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link rounded-pill px-3 py-1 fw-bold ${activeTab === 'community' ? 'active bg-success text-white' : 'text-dark'}`}
                onClick={() => setActiveTab('community')}
              >
                💬 Farmer Peer Community
              </button>
            </li>
          </ul>

          <div className="d-flex flex-wrap gap-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-xs rounded-pill px-2 py-1 ${selectedCategory === cat ? 'btn-outline-success active' : 'btn-light text-muted'}`}
                style={{ fontSize: '0.75rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Discussions Feed */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <MessageSquare size={48} className="text-muted opacity-50 mx-auto mb-3" />
          <h5 className="fw-semibold text-dark">No Discussions Found</h5>
          <p className="text-muted small">Be the first to ask an agronomist or start a farmer discussion.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {posts.map((post) => (
            <div key={post._id} className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-secondary-subtle text-dark fw-semibold">
                    {post.category}
                  </span>
                  {post.isExpertConsultation && (
                    <span className="badge bg-warning-subtle text-dark border border-warning border-opacity-50">
                      🎓 Agronomist Query
                    </span>
                  )}
                  <span className={`badge ${post.status === 'Answered by Expert' ? 'bg-success' : 'bg-info text-dark'}`}>
                    {post.status}
                  </span>
                </div>
                <small className="text-muted">
                  {new Date(post.createdAt).toLocaleDateString()}
                </small>
              </div>

              <h5 className="fw-bold text-dark mb-2">{post.title}</h5>
              <p className="text-muted small mb-3">{post.content}</p>

              {post.tags && post.tags.length > 0 && (
                <div className="d-flex gap-1 mb-3 flex-wrap">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="badge bg-light text-muted border" style={{ fontSize: '0.7rem' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3 text-muted small">
                <span>Asked by: <strong>{post.authorName || 'Farmer'}</strong></span>
                <button
                  onClick={() => handleUpvote(post._id)}
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 rounded-pill px-3 py-1"
                >
                  <ThumbsUp size={14} />
                  <span>Helpful ({post.upvotes || 0})</span>
                </button>
              </div>

              {/* Replies Thread */}
              <div className="ps-3 border-start border-3 border-success border-opacity-25 mb-3">
                <h6 className="fw-bold small text-muted mb-2">
                  {t('forum.replies')} ({post.replies?.length || 0})
                </h6>

                {post.replies && post.replies.length > 0 ? (
                  <div className="d-flex flex-column gap-2 mb-3">
                    {post.replies.map((reply, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-3 ${reply.isExpertReply ? 'bg-success-subtle border border-success border-opacity-25' : 'bg-light'}`}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="d-flex align-items-center gap-1">
                            <strong className="small text-dark">{reply.authorName}</strong>
                            {reply.isExpertReply && (
                              <span className="badge bg-success text-white ms-1" style={{ fontSize: '0.65rem' }}>
                                ✓ Verified Agronomist
                              </span>
                            )}
                          </div>
                          <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <p className="small text-dark mb-0">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="small text-muted mb-2">No replies yet. Be the first to advise.</p>
                )}
              </div>

              {/* Reply Input Box */}
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Type an answer or agricultural tip..."
                  value={replyText[post._id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [post._id]: e.target.value })}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleReply(post._id); }}
                />
                <button
                  onClick={() => handleReply(post._id)}
                  className="btn btn-sm btn-success rounded-pill px-3 d-flex align-items-center gap-1 text-nowrap"
                >
                  <Send size={14} />
                  <span>{t('forum.postReply')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Ask Question */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom px-4">
                <h5 className="modal-title fw-bold text-dark">{t('forum.askQuestion')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreatePost}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Subject / Question Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. How to manage yellow rust on wheat in winter?"
                      value={formData.title}
                      onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Category *</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                      >
                        <option value="Crop Advisory">Crop Advisory</option>
                        <option value="Soil & Fertilizers">Soil & Fertilizers</option>
                        <option value="Pest Management">Pest Management</option>
                        <option value="Market & Mandi Rates">Market & Mandi Rates</option>
                        <option value="Government Schemes & Subsidies">Government Schemes & Subsidies</option>
                        <option value="General Discussion">General Discussion</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Topic Tags (Comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Wheat, Fertilizer, Subsidy"
                        value={formData.tags}
                        onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Detailed Description / Observation *</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      placeholder="Describe the soil symptoms, leaf discoloration, insect patterns, or scheme query in detail..."
                      value={formData.content}
                      onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                      required
                    ></textarea>
                  </div>

                  <div className="form-check form-switch p-3 bg-light rounded-3">
                    <input
                      className="form-check-input ms-0 me-2"
                      type="checkbox"
                      id="expertSwitch"
                      checked={formData.isExpertConsultation}
                      onChange={(e) => setFormData(p => ({ ...p, isExpertConsultation: e.target.checked }))}
                    />
                    <label className="form-check-label fw-bold text-dark small" htmlFor="expertSwitch">
                      Tag for Certified Agricultural University Agronomist Consultation
                    </label>
                    <small className="text-muted d-block ms-4" style={{ fontSize: '0.75rem' }}>
                      Marks this post for review and response by authorized agronomy experts.
                    </small>
                  </div>
                </div>

                <div className="modal-footer border-top px-4 py-3">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success rounded-pill px-4 fw-semibold">
                    Publish Query
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityForum;
