import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getFarms, getCrops, getSoilReports, getWeather, getOrders, getPestAlerts } from '../services/api';
import { 
  Sprout, 
  Layers, 
  Microscope, 
  CloudSun, 
  ShoppingBag, 
  AlertTriangle, 
  PlusCircle, 
  ArrowRight,
  Droplets,
  Wind,
  CheckCircle2,
  Calendar
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [soilReports, setSoilReports] = useState([]);
  const [weather, setWeather] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pestAlerts, setPestAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [farmsRes, cropsRes, soilRes, weatherRes, ordersRes, pestRes] = await Promise.all([
          getFarms().catch(() => ({ data: { data: [] } })),
          getCrops().catch(() => ({ data: { data: [] } })),
          getSoilReports().catch(() => ({ data: { data: [] } })),
          getWeather({ district: user?.location?.district || 'Indore' }).catch(() => ({ data: { data: null } })),
          getOrders().catch(() => ({ data: { data: [] } })),
          getPestAlerts().catch(() => ({ data: { data: [] } })),
        ]);

        setFarms(farmsRes.data.data || []);
        setCrops(cropsRes.data.data || []);
        setSoilReports(soilRes.data.data || []);
        setWeather(weatherRes.data.data || null);
        setOrders(ordersRes.data.data || []);
        setPestAlerts(pestRes.data.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Average soil score
  const avgSoilScore = soilReports.length > 0 
    ? Math.round(soilReports.reduce((acc, curr) => acc + (curr.overallScore || 70), 0) / soilReports.length)
    : 78;

  const pendingOrdersCount = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;

  return (
    <div className="container py-4">
      {/* Welcome Banner */}
      <div className="card border-0 rounded-4 shadow-sm text-white mb-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #143823 0%, #1e5e3a 100%)' }}>
        <div className="card-body p-4 p-md-5">
          <div className="row align-items-center justify-content-between">
            <div className="col-lg-8">
              <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold mb-2">
                🌾 {user?.role === 'admin' ? 'Administrator' : 'Verified Farmer'}
              </span>
              <h2 className="fw-bold mb-2">
                {t('dashboard.welcome')} {user?.name || 'Farmer'}!
              </h2>
              <p className="text-light opacity-90 mb-0">
                {t('dashboard.subtitle')}
              </p>
              {user?.location?.district && (
                <div className="small text-light opacity-75 mt-2">
                  📍 Region: {user.location.village ? `${user.location.village}, ` : ''}{user.location.district}, {user.location.state}
                </div>
              )}
            </div>

            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              <div className="d-inline-flex flex-column bg-white bg-opacity-10 p-3 rounded-3 text-start border border-white border-opacity-25">
                <small className="text-light opacity-75">Local Meteorological Advisory</small>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <CloudSun size={28} className="text-warning" />
                  <div>
                    <h5 className="mb-0 fw-bold">{weather?.current?.temperature || 31}°C</h5>
                    <small className="text-warning fw-semibold">{weather?.agriculturalAdvisory?.sprayingCondition || 'Favorable'} for Spraying</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card h-100 p-3 border-0 shadow-sm rounded-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <small className="text-muted fw-semibold">{t('dashboard.totalFarms')}</small>
                <h3 className="fw-bold text-dark mt-1 mb-0">{farms.length}</h3>
              </div>
              <div className="stat-icon-wrapper bg-primary-soft">
                <Layers size={22} className="text-success" />
              </div>
            </div>
            <Link to="/farms" className="small text-success text-decoration-none mt-3 d-flex align-items-center gap-1">
              <span>Manage Land</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card h-100 p-3 border-0 shadow-sm rounded-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <small className="text-muted fw-semibold">{t('dashboard.activeCrops')}</small>
                <h3 className="fw-bold text-dark mt-1 mb-0">{crops.length}</h3>
              </div>
              <div className="stat-icon-wrapper bg-info-soft">
                <Sprout size={22} className="text-primary" />
              </div>
            </div>
            <Link to="/crops" className="small text-primary text-decoration-none mt-3 d-flex align-items-center gap-1">
              <span>View Cycles</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card h-100 p-3 border-0 shadow-sm rounded-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <small className="text-muted fw-semibold">{t('dashboard.soilHealthAvg')}</small>
                <h3 className="fw-bold text-dark mt-1 mb-0">{avgSoilScore}/100</h3>
              </div>
              <div className="stat-icon-wrapper bg-warning-soft">
                <Microscope size={22} className="text-warning" />
              </div>
            </div>
            <Link to="/soil" className="small text-warning text-decoration-none mt-3 d-flex align-items-center gap-1">
              <span>Soil Reports</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card h-100 p-3 border-0 shadow-sm rounded-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <small className="text-muted fw-semibold">{t('dashboard.pendingOrders')}</small>
                <h3 className="fw-bold text-dark mt-1 mb-0">{pendingOrdersCount}</h3>
              </div>
              <div className="stat-icon-wrapper bg-danger-soft">
                <ShoppingBag size={22} className="text-danger" />
              </div>
            </div>
            <Link to="/orders" className="small text-danger text-decoration-none mt-3 d-flex align-items-center gap-1">
              <span>Track Orders</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Left Column: Crop Stages & Activity */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                <Sprout size={20} className="text-success" />
                <span>{t('dashboard.cropTimeline')}</span>
              </h5>
              <Link to="/crops" className="btn btn-sm btn-outline-success rounded-pill px-3">
                {t('crops.addCropBtn')}
              </Link>
            </div>

            {crops.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <Sprout size={36} className="text-muted mb-2 opacity-50" />
                <p className="small mb-2">No active crops registered yet.</p>
                <Link to="/crops" className="btn btn-sm btn-success rounded-pill">
                  Register Your First Crop
                </Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {crops.slice(0, 4).map((crop) => (
                  <div key={crop._id} className="p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold mb-0 text-dark">{crop.cropName}</h6>
                        <small className="text-muted">{crop.variety} • Season: {crop.season}</small>
                      </div>
                      <span className={`badge ${crop.healthStatus === 'Healthy' ? 'bg-success' : crop.healthStatus === 'Attention Needed' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                        {crop.healthStatus}
                      </span>
                    </div>

                    <div className="small text-muted mb-1 d-flex justify-content-between">
                      <span>Growth Stage: <strong>{crop.currentStage}</strong></span>
                      <span>Planted: {new Date(crop.plantingDate).toLocaleDateString()}</span>
                    </div>

                    {/* Stage Progress Bar */}
                    <div className="progress" style={{ height: 6 }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{
                          width: crop.currentStage === 'Land Preparation' ? '15%'
                            : crop.currentStage === 'Sowing / Seedling' ? '30%'
                            : crop.currentStage === 'Vegetative Growth' ? '55%'
                            : crop.currentStage === 'Flowering / Fruiting' ? '75%'
                            : crop.currentStage === 'Maturity / Ripening' ? '90%'
                            : '100%'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Pest Alerts Notification Banner */}
          {pestAlerts.length > 0 && (
            <div className="card border-0 shadow-sm rounded-4 p-4 border-start border-danger border-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                  <AlertTriangle size={22} className="text-danger" />
                  <h6 className="fw-bold mb-0 text-danger">Regional Agricultural Pest Warnings</h6>
                </div>
                <Link to="/weather" className="small text-danger fw-bold">View Treatments →</Link>
              </div>
              <p className="small text-muted mb-2">
                Outbreak reported in surrounding districts. Review organic and chemical remedies:
              </p>
              <div className="d-flex flex-wrap gap-2">
                {pestAlerts.map(p => (
                  <span key={p._id} className="badge bg-danger-subtle text-danger border border-danger border-opacity-25 px-2 py-1">
                    ⚠️ {p.pestName} (Affects: {p.affectedCrops.join(', ')})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Weather Summary & Quick Actions */}
        <div className="col-lg-4">
          {/* Weather Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <CloudSun size={20} className="text-warning" />
              <span>{t('dashboard.weatherHeading')}</span>
            </h6>

            <div className="text-center py-2 border-bottom mb-3">
              <h2 className="display-5 fw-bold mb-0 text-dark">
                {weather?.current?.temperature || 31}°C
              </h2>
              <span className="text-muted small">{weather?.current?.condition || 'Clear & Sunny'}</span>
            </div>

            <div className="row g-2 text-center small mb-3">
              <div className="col-4 p-2 bg-light rounded-2">
                <Droplets size={16} className="text-primary mb-1" />
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Humidity</div>
                <div className="fw-bold">{weather?.current?.humidity || 55}%</div>
              </div>
              <div className="col-4 p-2 bg-light rounded-2">
                <Wind size={16} className="text-secondary mb-1" />
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Wind</div>
                <div className="fw-bold">{weather?.current?.windSpeed || 12} km/h</div>
              </div>
              <div className="col-4 p-2 bg-light rounded-2">
                <CloudSun size={16} className="text-warning mb-1" />
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Rain Prob</div>
                <div className="fw-bold">{weather?.current?.rainfall || 5}%</div>
              </div>
            </div>

            <div className="p-3 bg-success-subtle rounded-3 small">
              <span className="fw-bold text-success d-block mb-1">Agronomic Spraying Advisory:</span>
              <span className="text-success-emphasis">
                {weather?.agriculturalAdvisory?.irrigationAdvice || 'Standard evening irrigation schedule recommended.'}
              </span>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h6 className="fw-bold mb-3 text-dark">{t('dashboard.quickActions')}</h6>
            <div className="d-grid gap-2">
              <Link to="/farms" className="btn btn-outline-success text-start py-2 px-3 rounded-3 d-flex align-items-center justify-content-between">
                <span>{t('dashboard.addFarm')}</span>
                <PlusCircle size={18} />
              </Link>
              <Link to="/crops" className="btn btn-outline-success text-start py-2 px-3 rounded-3 d-flex align-items-center justify-content-between">
                <span>{t('dashboard.addCrop')}</span>
                <PlusCircle size={18} />
              </Link>
              <Link to="/soil" className="btn btn-outline-warning text-dark text-start py-2 px-3 rounded-3 d-flex align-items-center justify-content-between">
                <span>{t('dashboard.testSoil')}</span>
                <Microscope size={18} />
              </Link>
              <Link to="/market" className="btn btn-outline-primary text-start py-2 px-3 rounded-3 d-flex align-items-center justify-content-between">
                <span>{t('dashboard.viewMarket')}</span>
                <ShoppingBag size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
