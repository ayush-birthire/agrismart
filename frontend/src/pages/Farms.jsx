import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getFarms, createFarm, deleteFarm } from '../services/api';
import { Layers, Plus, Trash2, MapPin, Droplet, Sprout, AlertCircle, CheckCircle2 } from 'lucide-react';

const Farms = () => {
  const { t } = useLanguage();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    location: {
      address: '',
      village: '',
      district: '',
      state: 'Madhya Pradesh',
      pincode: '',
    },
    totalArea: {
      value: 5,
      unit: 'Acres',
    },
    soilType: 'Black',
    irrigationType: 'Drip',
    cropsGrown: '',
    notes: '',
  });

  const loadFarms = async () => {
    try {
      setLoading(true);
      const res = await getFarms();
      setFarms(res.data.data || []);
    } catch (err) {
      console.error('Failed to load farms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        cropsGrown: formData.cropsGrown ? formData.cropsGrown.split(',').map(s => s.trim()) : [],
      };
      await createFarm(payload);
      setFeedback({ type: 'success', message: 'Farm profile registered successfully!' });
      setShowModal(false);
      // Reset form
      setFormData({
        name: '',
        location: { address: '', village: '', district: '', state: 'Madhya Pradesh', pincode: '' },
        totalArea: { value: 5, unit: 'Acres' },
        soilType: 'Black',
        irrigationType: 'Drip',
        cropsGrown: '',
        notes: '',
      });
      loadFarms();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Failed to create farm' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this farm profile and all linked crops?')) {
      try {
        await deleteFarm(id);
        setFeedback({ type: 'info', message: 'Farm profile removed.' });
        loadFarms();
      } catch (err) {
        setFeedback({ type: 'danger', message: 'Failed to delete farm.' });
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Layers className="text-success" size={28} />
            <span>{t('farms.title')}</span>
          </h2>
          <p className="text-muted small mb-0">{t('farms.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-success d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm fw-semibold"
        >
          <Plus size={18} />
          <span>{t('farms.addFarmBtn')}</span>
        </button>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show py-2 mb-4`} role="alert">
          {feedback.message}
          <button type="button" className="btn-close" onClick={() => setFeedback(null)}></button>
        </div>
      )}

      {/* Farms List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : farms.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <Layers size={48} className="text-muted opacity-50 mx-auto mb-3" />
          <h5 className="fw-semibold text-dark">No Farms Found</h5>
          <p className="text-muted small mb-3">{t('farms.noFarms')}</p>
          <button onClick={() => setShowModal(true)} className="btn btn-success rounded-pill px-4 mx-auto">
            {t('farms.addFarmBtn')}
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {farms.map((farm) => (
            <div key={farm._id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 position-relative">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-bold text-dark mb-1">{farm.name}</h5>
                    <div className="text-muted small d-flex align-items-center gap-1">
                      <MapPin size={14} className="text-secondary" />
                      <span>{farm.location?.district}, {farm.location?.state}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(farm._id)}
                    className="btn btn-sm btn-outline-danger border-0 p-1 rounded-circle"
                    title="Delete Farm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="row g-2 mb-3 small">
                  <div className="col-6">
                    <div className="p-2 bg-light rounded-3">
                      <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Land Area</span>
                      <strong className="text-dark">{farm.totalArea?.value} {farm.totalArea?.unit}</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 bg-light rounded-3">
                      <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Soil Type</span>
                      <strong className="text-dark">{farm.soilType}</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 bg-light rounded-3">
                      <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Irrigation</span>
                      <strong className="text-dark">{farm.irrigationType}</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 bg-light rounded-3">
                      <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Managed By</span>
                      <strong className="text-dark">{farm.farmer?.name || 'Owner'}</strong>
                    </div>
                  </div>
                </div>

                {farm.cropsGrown && farm.cropsGrown.length > 0 && (
                  <div className="mb-3">
                    <span className="text-muted small d-block mb-1">Crops Cultivated:</span>
                    <div className="d-flex flex-wrap gap-1">
                      {farm.cropsGrown.map((crop, i) => (
                        <span key={i} className="badge bg-success-subtle text-success border border-success border-opacity-25">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {farm.notes && (
                  <p className="text-muted small mb-0 mt-auto pt-2 border-top">
                    {farm.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add New Farm */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom px-4">
                <h5 className="modal-title fw-bold text-dark">{t('farms.addFarmBtn')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreateFarm}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Farm Profile Name *</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="e.g. Kisan Samriddhi Estate"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Area Value *</label>
                      <input
                        type="number"
                        name="totalArea.value"
                        className="form-control"
                        value={formData.totalArea.value}
                        onChange={handleChange}
                        required
                        min="0.1"
                        step="0.1"
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Unit</label>
                      <select
                        name="totalArea.unit"
                        className="form-select"
                        value={formData.totalArea.unit}
                        onChange={handleChange}
                      >
                        <option value="Acres">Acres</option>
                        <option value="Hectares">Hectares</option>
                        <option value="Bigha">Bigha</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">District *</label>
                      <input
                        type="text"
                        name="location.district"
                        className="form-control"
                        placeholder="e.g. Khargone / Indore"
                        value={formData.location.district}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">State *</label>
                      <input
                        type="text"
                        name="location.state"
                        className="form-control"
                        value={formData.location.state}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Soil Type</label>
                      <select
                        name="soilType"
                        className="form-select"
                        value={formData.soilType}
                        onChange={handleChange}
                      >
                        <option value="Black">Black Soil (Regur)</option>
                        <option value="Alluvial">Alluvial Soil</option>
                        <option value="Red">Red & Yellow Soil</option>
                        <option value="Loamy">Loamy Soil</option>
                        <option value="Sandy">Sandy Soil</option>
                        <option value="Clay">Clay Soil</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Irrigation System</label>
                      <select
                        name="irrigationType"
                        className="form-select"
                        value={formData.irrigationType}
                        onChange={handleChange}
                      >
                        <option value="Drip">Drip Irrigation (Micro)</option>
                        <option value="Sprinkler">Sprinkler Irrigation</option>
                        <option value="Canal">Canal / Surface</option>
                        <option value="Tube Well">Tube Well / Borewell</option>
                        <option value="Rainfed">Rainfed (Monsoon)</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Crops Cultivated (Comma separated)</label>
                      <input
                        type="text"
                        name="cropsGrown"
                        className="form-control"
                        placeholder="e.g. Wheat, Soybean, Cotton, Chickpeas"
                        value={formData.cropsGrown}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Farm Notes & Features</label>
                      <textarea
                        name="notes"
                        rows="2"
                        className="form-control"
                        placeholder="e.g. Solar pump installed, organic compost pits present."
                        value={formData.notes}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success rounded-pill px-4 fw-semibold">
                    Save Farm Profile
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

export default Farms;
