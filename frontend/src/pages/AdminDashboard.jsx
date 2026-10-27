import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getAdminStats, getAdminUsers, updateUserRole, updateOrderStatus, createPestAlert } from '../services/api';
import { ShieldCheck, Users, ShoppingBag, Layers, AlertTriangle, CheckCircle2, TrendingUp, Plus, Database } from 'lucide-react';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPestModal, setShowPestModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [pestData, setPestData] = useState({
    pestName: '',
    scientificName: '',
    affectedCrops: '',
    severity: 'High',
    symptoms: '',
    organicTreatment: '',
    chemicalTreatment: '',
    affectedRegions: 'Madhya Pradesh',
  });

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
      ]);
      setStats(statsRes.data.data || null);
      setUsers(usersRes.data.data || []);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { orderStatus: newStatus });
      setFeedback({ type: 'success', message: `Order status updated to ${newStatus}` });
      loadAdminData();
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to update order status' });
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'farmer' : 'admin';
    try {
      await updateUserRole(userId, newRole);
      setFeedback({ type: 'success', message: `User role changed to ${newRole}` });
      loadAdminData();
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to update user role' });
    }
  };

  const handleCreatePest = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...pestData,
        affectedCrops: pestData.affectedCrops.split(',').map(s => s.trim()),
        symptoms: pestData.symptoms.split(',').map(s => s.trim()),
        affectedRegions: pestData.affectedRegions.split(',').map(s => s.trim()),
      };
      await createPestAlert(payload);
      setFeedback({ type: 'success', message: 'New agricultural pest alert broadcasted successfully!' });
      setShowPestModal(false);
      loadAdminData();
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to create pest alert' });
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold mb-1">
            🛡 Central Administrative Command
          </span>
          <h2 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <ShieldCheck className="text-warning" size={28} />
            <span>{t('admin.title')}</span>
          </h2>
          <p className="text-muted small mb-0">{t('admin.subtitle')}</p>
        </div>

        <button
          onClick={() => setShowPestModal(true)}
          className="btn btn-danger d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm fw-semibold"
        >
          <AlertTriangle size={18} />
          <span>Broadcast Pest Alert</span>
        </button>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show py-2 mb-4`} role="alert">
          {feedback.message}
          <button type="button" className="btn-close" onClick={() => setFeedback(null)}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <>
          {/* Top Analytics Cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-lg-3">
              <div className="card h-100 p-3 border-0 shadow-sm rounded-4 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted fw-semibold">Total Users</small>
                    <h3 className="fw-bold text-dark mt-1 mb-0">{stats?.counts?.totalUsers || 0}</h3>
                    <small className="text-success">{stats?.counts?.totalFarmers || 0} Farmers • {stats?.counts?.totalAdmins || 0} Admins</small>
                  </div>
                  <div className="stat-icon-wrapper bg-primary-soft">
                    <Users size={22} className="text-success" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="card h-100 p-3 border-0 shadow-sm rounded-4 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted fw-semibold">Registered Land</small>
                    <h3 className="fw-bold text-dark mt-1 mb-0">{stats?.counts?.totalFarms || 0}</h3>
                    <small className="text-muted">{stats?.counts?.totalCrops || 0} active crops</small>
                  </div>
                  <div className="stat-icon-wrapper bg-info-soft">
                    <Layers size={22} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="card h-100 p-3 border-0 shadow-sm rounded-4 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted fw-semibold">{t('admin.totalRevenue')}</small>
                    <h3 className="fw-bold text-success mt-1 mb-0">₹{stats?.counts?.totalRevenue || 0}</h3>
                    <small className="text-muted">{stats?.counts?.totalOrders || 0} orders processed</small>
                  </div>
                  <div className="stat-icon-wrapper bg-warning-soft">
                    <ShoppingBag size={22} className="text-warning" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="card h-100 p-3 border-0 shadow-sm rounded-4 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted fw-semibold">Active Pest Alerts</small>
                    <h3 className="fw-bold text-danger mt-1 mb-0">{stats?.counts?.activePestAlerts || 0}</h3>
                    <small className="text-danger">Regional outbreaks</small>
                  </div>
                  <div className="stat-icon-wrapper bg-danger-soft">
                    <AlertTriangle size={22} className="text-danger" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Database Health Card */}
          <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-light border">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
              <div className="d-flex align-items-center gap-2">
                <Database size={20} className="text-success" />
                <strong className="text-dark">Database Status:</strong>
                <span className="badge bg-success-subtle text-success">
                  {stats?.databaseStatus?.connected ? 'Connected to MongoDB' : 'Online'}
                </span>
                <span className="small text-muted">Host: {stats?.databaseStatus?.host}</span>
              </div>
              <span className="small text-muted">
                Relational integrity maintained across Users, Farms, Crops, Orders, & WeatherData.
              </span>
            </div>
          </div>

          <div className="row g-4 mb-4">
            {/* Orders Management */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                <h5 className="fw-bold mb-3 text-dark">{t('admin.recentOrders')}</h5>
                {stats?.recentOrders?.length === 0 ? (
                  <p className="small text-muted">No orders to manage.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 small">
                      <thead className="table-light">
                        <tr>
                          <th>Order Ref</th>
                          <th>Farmer</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats?.recentOrders?.map((ord) => (
                          <tr key={ord._id}>
                            <td className="fw-semibold">{ord.orderNumber}</td>
                            <td>{ord.farmer?.name || 'Farmer'}</td>
                            <td className="fw-bold text-success">₹{ord.totalAmount}</td>
                            <td>
                              <span className="badge bg-secondary-subtle text-dark">
                                {ord.orderStatus}
                              </span>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                style={{ fontSize: '0.75rem' }}
                                value={ord.orderStatus}
                                onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                              >
                                <option value="Placed">Placed</option>
                                <option value="Processing">Processing</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* User Directory */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                <h5 className="fw-bold mb-3 text-dark">{t('admin.userManagement')}</h5>
                <div className="d-flex flex-column gap-2" style={{ maxHeight: 350, overflowY: 'auto' }}>
                  {users.map((u) => (
                    <div key={u._id} className="p-2 bg-light rounded-3 d-flex justify-content-between align-items-center small">
                      <div>
                        <strong className="text-dark d-block">{u.name}</strong>
                        <span className="text-muted">{u.email}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge ${u.role === 'admin' ? 'bg-warning text-dark' : 'bg-success'}`}>
                          {u.role}
                        </span>
                        <button
                          onClick={() => handleRoleToggle(u._id, u.role)}
                          className="btn btn-xs btn-outline-secondary p-1"
                          style={{ fontSize: '0.7rem' }}
                          title="Toggle Admin / Farmer"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal: Broadcast Pest Alert */}
      {showPestModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom px-4">
                <h5 className="modal-title fw-bold text-danger d-flex align-items-center gap-2">
                  <AlertTriangle size={20} />
                  <span>Broadcast Agricultural Pest Alert</span>
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowPestModal(false)}></button>
              </div>
              <form onSubmit={handleCreatePest}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Pest Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Pink Bollworm"
                        value={pestData.pestName}
                        onChange={(e) => setPestData(p => ({ ...p, pestName: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Scientific Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Pectinophora gossypiella"
                        value={pestData.scientificName}
                        onChange={(e) => setPestData(p => ({ ...p, scientificName: e.target.value }))}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Affected Crops (Comma separated) *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Cotton, Okra"
                        value={pestData.affectedCrops}
                        onChange={(e) => setPestData(p => ({ ...p, affectedCrops: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Severity Level</label>
                      <select
                        className="form-select"
                        value={pestData.severity}
                        onChange={(e) => setPestData(p => ({ ...p, severity: e.target.value }))}
                      >
                        <option value="Severe">Severe Outbreak</option>
                        <option value="High">High Risk</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Low">Low / Preventive</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Symptoms (Comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Rosetted flowers, bore holes in bolls, larval feeding"
                        value={pestData.symptoms}
                        onChange={(e) => setPestData(p => ({ ...p, symptoms: e.target.value }))}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Organic / Bio-Remedy</label>
                      <textarea
                        rows="2"
                        className="form-control"
                        placeholder="e.g. Install 8 pheromone traps per acre and release Trichogramma wasps."
                        value={pestData.organicTreatment}
                        onChange={(e) => setPestData(p => ({ ...p, organicTreatment: e.target.value }))}
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Chemical Treatment</label>
                      <textarea
                        rows="2"
                        className="form-control"
                        placeholder="e.g. Spray Emamectin Benzoate 5% SG @ 4g/10L water."
                        value={pestData.chemicalTreatment}
                        onChange={(e) => setPestData(p => ({ ...p, chemicalTreatment: e.target.value }))}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowPestModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger rounded-pill px-4 fw-semibold">
                    Broadcast Outbreak Alert
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

export default AdminDashboard;

