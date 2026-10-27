import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrismart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Farms API
export const getFarms = () => api.get('/farms');
export const getFarmById = (id) => api.get(`/farms/${id}`);
export const createFarm = (data) => api.post('/farms', data);
export const updateFarm = (id, data) => api.put(`/farms/${id}`, data);
export const deleteFarm = (id) => api.delete(`/farms/${id}`);

// Crops API
export const getCrops = (params) => api.get('/crops', { params });
export const getCropById = (id) => api.get(`/crops/${id}`);
export const createCrop = (data) => api.post('/crops', data);
export const updateCrop = (id, data) => api.put(`/crops/${id}`, data);
export const addCropActivity = (id, data) => api.post(`/crops/${id}/activity`, data);
export const deleteCrop = (id) => api.delete(`/crops/${id}`);

// Soil Health API
export const getSoilReports = (params) => api.get('/soil', { params });
export const getSoilReportById = (id) => api.get(`/soil/${id}`);
export const createSoilReport = (data) => api.post('/soil', data);
export const deleteSoilReport = (id) => api.delete(`/soil/${id}`);

// Weather & Pest API
export const getWeather = (params) => api.get('/weather', { params });
export const getPestAlerts = (params) => api.get('/weather/pest-alerts', { params });
export const createPestAlert = (data) => api.post('/weather/pest-alerts', data);

// Marketplace & Orders API
export const getResources = (params) => api.get('/resources', { params });
export const createResource = (data) => api.post('/resources', data);
export const getOrders = () => api.get('/orders');
export const createOrder = (data) => api.post('/orders', data);
export const updateOrderStatus = (id, data) => api.put(`/orders/${id}/status`, data);

// Community Forum & Expert Consultation API
export const getForumPosts = (params) => api.get('/forum', { params });
export const getForumPostById = (id) => api.get(`/forum/${id}`);
export const createForumPost = (data) => api.post('/forum', data);
export const addForumReply = (id, data) => api.post(`/forum/${id}/reply`, data);
export const upvoteForumPost = (id) => api.put(`/forum/${id}/upvote`);

// Admin API
export const getAdminStats = () => api.get('/admin/stats');
export const getAdminUsers = () => api.get('/admin/users');
export const updateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role });

export default api;

