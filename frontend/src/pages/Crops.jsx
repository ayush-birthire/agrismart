import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getCrops, getFarms, createCrop, updateCrop, addCropActivity, deleteCrop } from '../services/api';
import { Sprout, Plus, Calendar, Clock, Activity, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';

const Crops = () => {
  const { t } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    farm: '',
    cropName: '',
    variety: 'Standard',
    season: 'Rabi (Winter)',
    areaPlanted: { value: 2, unit: 'Acres' },
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
    currentStage: 'Sowing / Seedling',
    healthStatus: 'Healthy',
    notes: '',
  });

  const [activityData, setActivityData] = useState({
    activityType: 'Irrigation',
    description: '',
    cost: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [cropsRes, farmsRes] = await Promise.all([
        getCrops(),
        getFarms(),
      ]);
      setCrops(cropsRes.data.data || []);
      setFarms(farmsRes.data.data || []);
      if (farmsRes.data.data && farmsRes.data.data.length > 0) {
        setFormData(prev => ({ ...prev, farm: farmsRes.data.data[0]._id }));
      }
    } catch (err) {
      console.error('Error loading crops:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCrop = async (e) => {
    e.preventDefault();
    try {
      await createCrop(formData);
      setFeedback({ type: 'success', message: 'Crop cycle registered successfully!' });
      setShowAddModal(false);
      loadData();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Failed to create crop' });
    }
  };

  const handleStageChange = async (cropId, newStage) => {
    try {
      await updateCrop(cropId, { currentStage: newStage });
      setFeedback({ type: 'success', message: `Stage updated to ${newStage}` });
      loadData();
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to update growth stage' });
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!selectedCrop) return;
    try {
      await addCropActivity(selectedCrop._id, activityData);
      setFeedback({ type: 'success', message: 'Activity logged successfully!' });
      setShowActivityModal(false);
      setActivityData({
        activityType: 'Irrigation',
        description: '',
        cost: 0,
        date: new Date().toISOString().split('T')[0],
      });
      loadData();
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to log activity.' });
    }
  };

  const handleDelete = async (cropId) => {
    if (window.confirm('Delete this crop monitoring record?')) {
      try {
        await deleteCrop(cropId);
        setFeedback({ type: 'info', message: 'Crop record deleted.' });
        loadData();
      } catch (err) {
        setFeedback({ type: 'danger', message: 'Failed to delete crop.' });
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Sprout className="text-success" size={28} />
            <span>{t('crops.title')}</span>
          </h2>
          <p className="text-muted small mb-0">{t('crops.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-success d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm fw-semibold"
        >
          <Plus size={18} />
          <span>{t('crops.addCropBtn')}</span>
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
      ) : crops.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <Sprout size={48} className="text-muted opacity-50 mx-auto mb-3" />
          <h5 className="fw-semibold text-dark">No Crops Registered</h5>
          <p className="text-muted small mb-3">{t('crops.noCrops')}</p>
          <button onClick={() => setShowAddModal(true)} className="btn btn-success rounded-pill px-4 mx-auto">
            {t('crops.addCropBtn')}
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {crops.map((crop) => (
            <div key={crop._id} className="col-lg-6">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-bold text-dark mb-1">{crop.cropName}</h5>
                    <span className="text-muted small">
                      {crop.variety} • Farm: <strong>{crop.farm?.name || 'Assigned Farm'}</strong>
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge ${crop.healthStatus === 'Healthy' ? 'bg-success' : crop.healthStatus === 'Attention Needed' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                      {crop.healthStatus}
                    </span>
                    <button
                      onClick={() => handleDelete(crop._id)}
                      className="btn btn-sm btn-outline-danger border-0 p-1 rounded-circle"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="row g-2 mb-3 small">
                  <div className="col-sm-4">
                    <div className="p-2 bg-light rounded-3">
                      <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Season</span>
                      <strong className="text-dark">{crop.season}</strong>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="p-2 bg-light rounded-3">
                      <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Planted Date</span>
                      <strong className="text-dark">{new Date(crop.plantingDate).toLocaleDateString()}</strong>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="p-2 bg-light rounded-3">
                      <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Planted Area</span>
                      <strong className="text-dark">{crop.areaPlanted?.value || 1} {crop.areaPlanted?.unit || 'Acres'}</strong>
                    </div>
                  </div>
                </div>

                {/* Growth Stage Selector */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted d-flex justify-content-between mb-1">
                    <span>Phenological Growth Stage:</span>
                    <span className="text-success fw-bold">{crop.currentStage}</span>
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={crop.currentStage}
                    onChange={(e) => handleStageChange(crop._id, e.target.value)}
                  >
                    <option value="Land Preparation">1. Land Preparation</option>
                    <option value="Sowing / Seedling">2. Sowing / Seedling</option>
                    <option value="Vegetative Growth">3. Vegetative Growth</option>
                    <option value="Flowering / Fruiting">4. Flowering / Fruiting</option>
                    <option value="Maturity / Ripening">5. Maturity / Ripening</option>
                    <option value="Harvested">6. Harvested</option>
                  </select>
                </div>

                {/* Activity Logs Timeline */}
                <div className="p-3 bg-light rounded-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small fw-bold text-dark d-flex align-items-center gap-1">
                      <Activity size={16} className="text-success" />
                      <span>Activity Log ({crop.activityLogs?.length || 0})</span>
                    </span>
                    <button
                      onClick={() => { setSelectedCrop(crop); setShowActivityModal(true); }}
                      className="btn btn-xs btn-outline-success rounded-pill px-2 py-1"
                      style={{ fontSize: '0.75rem' }}
                    >
                      + Log Activity
                    </button>
                  </div>

                  {crop.activityLogs && crop.activityLogs.length > 0 ? (
                    <div className="d-flex flex-column gap-2" style={{ maxHeight: 110, overflowY: 'auto' }}>
                      {crop.activityLogs.slice(0, 3).map((act, idx) => (
                        <div key={idx} className="small d-flex justify-content-between border-bottom pb-1">
                          <div>
                            <span className="badge bg-secondary-subtle text-dark me-1">{act.activityType}</span>
                            <span>{act.description}</span>
                          </div>
                          <span className="text-muted text-nowrap" style={{ fontSize: '0.75rem' }}>
                            {new Date(act.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="small text-muted mb-0">No field interventions logged yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Crop */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom px-4">
                <h5 className="modal-title fw-bold text-dark">{t('crops.addCropBtn')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleCreateCrop}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Target Farm *</label>
                      <select
                        className="form-select"
                        value={formData.farm}
                        onChange={(e) => setFormData(p => ({ ...p, farm: e.target.value }))}
                        required
                      >
                        {farms.map(f => (
                          <option key={f._id} value={f._id}>{f.name} ({f.location?.district})</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Crop Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Wheat, Cotton, Soybean, Chickpeas"
                        value={formData.cropName}
                        onChange={(e) => setFormData(p => ({ ...p, cropName: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Variety / Hybrid</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Sharbati C-306, BT-II"
                        value={formData.variety}
                        onChange={(e) => setFormData(p => ({ ...p, variety: e.target.value }))}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Season</label>
                      <select
                        className="form-select"
                        value={formData.season}
                        onChange={(e) => setFormData(p => ({ ...p, season: e.target.value }))}
                      >
                        <option value="Rabi (Winter)">Rabi (Winter)</option>
                        <option value="Kharif (Monsoon)">Kharif (Monsoon)</option>
                        <option value="Zaid (Summer)">Zaid (Summer)</option>
                        <option value="Perennial">Perennial</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Planting / Sowing Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.plantingDate}
                        onChange={(e) => setFormData(p => ({ ...p, plantingDate: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Expected Harvest Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.expectedHarvestDate}
                        onChange={(e) => setFormData(p => ({ ...p, expectedHarvestDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success rounded-pill px-4 fw-semibold">
                    Register Crop
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Log Activity */}
      {showActivityModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom px-4">
                <h5 className="modal-title fw-bold text-dark">
                  Log Activity for {selectedCrop?.cropName}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowActivityModal(false)}></button>
              </div>
              <form onSubmit={handleAddActivity}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Activity Type *</label>
                    <select
                      className="form-select"
                      value={activityData.activityType}
                      onChange={(e) => setActivityData(p => ({ ...p, activityType: e.target.value }))}
                    >
                      <option value="Irrigation">Irrigation (Watering)</option>
                      <option value="Fertilizer Application">Fertilizer Application</option>
                      <option value="Pesticide Spray">Pesticide / Fungicide Spray</option>
                      <option value="Weeding">Weeding / Intercultural</option>
                      <option value="Soil Test">Soil Health Test</option>
                      <option value="Inspection">Field Scouting & Inspection</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description *</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      placeholder="e.g. Applied 50kg Neem-Coated Urea with drip flush."
                      value={activityData.description}
                      onChange={(e) => setActivityData(p => ({ ...p, description: e.target.value }))}
                      required
                    ></textarea>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Input Cost (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={activityData.cost}
                        onChange={(e) => setActivityData(p => ({ ...p, cost: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={activityData.date}
                        onChange={(e) => setActivityData(p => ({ ...p, date: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowActivityModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success rounded-pill px-4 fw-semibold">
                    Save Log
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

export default Crops;

