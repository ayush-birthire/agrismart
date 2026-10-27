import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getSoilReports, getFarms, createSoilReport, deleteSoilReport } from '../services/api';
import { Microscope, Plus, CheckCircle2, AlertCircle, HelpCircle, Trash2, ArrowUpRight, TrendingUp } from 'lucide-react';

const SoilAnalysis = () => {
  const { t } = useLanguage();
  const [reports, setReports] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    farm: '',
    phLevel: 6.8,
    nitrogen: 320,
    phosphorus: 22,
    potassium: 195,
    organicCarbon: 0.72,
    moisture: 24,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [reportsRes, farmsRes] = await Promise.all([
        getSoilReports(),
        getFarms(),
      ]);
      setReports(reportsRes.data.data || []);
      setFarms(farmsRes.data.data || []);
      if (farmsRes.data.data && farmsRes.data.data.length > 0) {
        setFormData(p => ({ ...p, farm: farmsRes.data.data[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load soil reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSoilReport(formData);
      setFeedback({ type: 'success', message: 'Soil test analysis generated successfully!' });
      setShowModal(false);
      loadData();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Failed to submit soil test.' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this soil test record?')) {
      try {
        await deleteSoilReport(id);
        setFeedback({ type: 'info', message: 'Soil report removed.' });
        loadData();
      } catch (err) {
        setFeedback({ type: 'danger', message: 'Failed to delete report.' });
      }
    }
  };

  const latestReport = reports.length > 0 ? reports[0] : null;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Microscope className="text-success" size={28} />
            <span>{t('soil.title')}</span>
          </h2>
          <p className="text-muted small mb-0">{t('soil.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-success d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm fw-semibold"
        >
          <Plus size={18} />
          <span>{t('soil.newTestBtn')}</span>
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
          {/* Latest Soil Report Spotlight */}
          {latestReport && (
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center pb-3 border-bottom mb-4">
                <div>
                  <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill mb-1">
                    Latest Soil Diagnosis • {new Date(latestReport.sampleDate).toLocaleDateString()}
                  </span>
                  <h4 className="fw-bold mb-0 text-dark">
                    Farm: {latestReport.farm?.name || 'Assigned Farm'}
                  </h4>
                </div>
                <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
                  <div className="text-end">
                    <small className="text-muted d-block">{t('soil.healthScore')}</small>
                    <span className="h3 fw-bold text-success mb-0">{latestReport.overallScore}/100</span>
                  </div>
                  <span className={`badge px-3 py-2 fs-6 rounded-pill ${latestReport.status === 'Optimal' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {latestReport.status}
                  </span>
                </div>
              </div>

              {/* N-P-K Visual Metric Bars */}
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-bold small text-dark">Nitrogen (N)</span>
                      <span className="small text-muted">{latestReport.nitrogen} kg/ha (Target: 280-560)</span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div
                        className={`progress-bar ${latestReport.nitrogen < 280 ? 'bg-danger' : 'bg-success'}`}
                        style={{ width: `${Math.min(100, (latestReport.nitrogen / 560) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-bold small text-dark">Phosphorus (P)</span>
                      <span className="small text-muted">{latestReport.phosphorus} kg/ha (Target: 15-35)</span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div
                        className={`progress-bar ${latestReport.phosphorus < 15 ? 'bg-warning' : 'bg-success'}`}
                        style={{ width: `${Math.min(100, (latestReport.phosphorus / 35) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-bold small text-dark">Potassium (K)</span>
                      <span className="small text-muted">{latestReport.potassium} kg/ha (Target: 140-280)</span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div
                        className={`progress-bar ${latestReport.potassium < 140 ? 'bg-warning' : 'bg-success'}`}
                        style={{ width: `${Math.min(100, (latestReport.potassium / 280) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-bold small text-dark">Soil pH Level</span>
                      <span className="small text-muted">{latestReport.phLevel} (Ideal: 6.0 - 7.5)</span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div
                        className={`progress-bar ${latestReport.phLevel < 6 ? 'bg-danger' : latestReport.phLevel > 7.5 ? 'bg-warning' : 'bg-success'}`}
                        style={{ width: `${Math.min(100, (latestReport.phLevel / 14) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-bold small text-dark">Organic Carbon</span>
                      <span className="small text-muted">{latestReport.organicCarbon}% (Target: &gt;0.75%)</span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div
                        className="progress-bar bg-info"
                        style={{ width: `${Math.min(100, (latestReport.organicCarbon / 1.5) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-bold small text-dark">Soil Moisture</span>
                      <span className="small text-muted">{latestReport.moisture}% (Target: 20-35%)</span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div
                        className="progress-bar bg-primary"
                        style={{ width: `${Math.min(100, (latestReport.moisture / 40) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actionable Scientific Recommendations */}
              <div className="p-3 bg-success-subtle rounded-4">
                <h6 className="fw-bold text-success mb-2 d-flex align-items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{t('soil.recommendations')}</span>
                </h6>
                <div className="d-flex flex-column gap-2">
                  {latestReport.recommendations?.map((rec, i) => (
                    <div key={i} className="small bg-white p-2 rounded-2 border d-flex align-items-start gap-2">
                      <span className={`badge mt-1 ${rec.priority === 'High' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                        {rec.priority}
                      </span>
                      <div>
                        <strong>{rec.category}: </strong>
                        <span>{rec.tip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Historical Soil Reports Table */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold mb-3 text-dark">Historical Soil Health Records</h5>
            {reports.length === 0 ? (
              <p className="text-muted small">No soil tests logged yet. Click 'New Soil Test Analysis' above.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Sample Date</th>
                      <th>Farm</th>
                      <th>pH</th>
                      <th>Nitrogen (N)</th>
                      <th>Phosphorus (P)</th>
                      <th>Potassium (K)</th>
                      <th>Score</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r._id}>
                        <td>{new Date(r.sampleDate).toLocaleDateString()}</td>
                        <td className="fw-semibold">{r.farm?.name || 'Farm'}</td>
                        <td>{r.phLevel}</td>
                        <td>{r.nitrogen} kg/ha</td>
                        <td>{r.phosphorus} kg/ha</td>
                        <td>{r.potassium} kg/ha</td>
                        <td><strong className="text-success">{r.overallScore}</strong></td>
                        <td>
                          <span className={`badge ${r.status === 'Optimal' ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="btn btn-sm btn-outline-danger border-0 p-1 rounded-circle"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal: Add Soil Test */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom px-4">
                <h5 className="modal-title fw-bold text-dark">{t('soil.newTestBtn')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
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

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">pH Level (0 - 14) *</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="14"
                        className="form-control"
                        value={formData.phLevel}
                        onChange={(e) => setFormData(p => ({ ...p, phLevel: Number(e.target.value) }))}
                        required
                      />
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>Ideal: 6.0 to 7.5</small>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Nitrogen (N) kg/ha *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.nitrogen}
                        onChange={(e) => setFormData(p => ({ ...p, nitrogen: Number(e.target.value) }))}
                        required
                      />
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>Target: 280 - 560 kg/ha</small>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Phosphorus (P) kg/ha *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.phosphorus}
                        onChange={(e) => setFormData(p => ({ ...p, phosphorus: Number(e.target.value) }))}
                        required
                      />
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>Target: 15 - 35 kg/ha</small>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Potassium (K) kg/ha *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.potassium}
                        onChange={(e) => setFormData(p => ({ ...p, potassium: Number(e.target.value) }))}
                        required
                      />
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>Target: 140 - 280 kg/ha</small>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Organic Carbon (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.organicCarbon}
                        onChange={(e) => setFormData(p => ({ ...p, organicCarbon: Number(e.target.value) }))}
                      />
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>Target: &gt; 0.75%</small>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Soil Moisture (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.moisture}
                        onChange={(e) => setFormData(p => ({ ...p, moisture: Number(e.target.value) }))}
                      />
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>Target: 20% - 35%</small>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success rounded-pill px-4 fw-semibold">
                    Generate Analysis
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

export default SoilAnalysis;
