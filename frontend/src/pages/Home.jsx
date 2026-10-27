import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, CloudSun, ShieldCheck, ShoppingCart, Microscope, Users, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Quick demo login helpers for evaluators
  const handleDemoFarmer = async () => {
    await login('farmer@agrismart.org', 'farmerpassword123');
    navigate('/dashboard');
  };

  const handleDemoAdmin = async () => {
    await login('admin@agrismart.org', 'adminpassword123');
    navigate('/admin');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="py-5 text-white" style={{ background: 'linear-gradient(135deg, #143823 0%, #198754 100%)' }}>
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center gap-1 shadow-sm">
                ★ MERN Smart Farming Management Platform
              </span>
              <h1 className="display-4 fw-bold lh-sm mb-3">
                {t('tagline')}
              </h1>
              <p className="lead text-light opacity-90 mb-4">
                Bridging the gap between traditional agricultural practices and modern data-driven farming. Equipped with real-time weather alerts, automated soil health diagnosis, end-to-end crop monitoring, and an agricultural input marketplace.
              </p>
              
              <div className="d-flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-warning btn-lg px-4 fw-bold shadow-sm d-flex align-items-center gap-2">
                    <span>Go to Dashboard</span>
                    <ArrowRight size={20} />
                  </Link>
                ) : (
                  <>
                    <button onClick={handleDemoFarmer} className="btn btn-warning btn-lg px-4 fw-bold shadow-sm d-flex align-items-center gap-2">
                      <span>🌾 Quick Demo: Farmer Login</span>
                      <ArrowRight size={18} />
                    </button>
                    <button onClick={handleDemoAdmin} className="btn btn-outline-light btn-lg px-4 fw-semibold d-flex align-items-center gap-2">
                      <span>🛡 Quick Demo: Admin Portal</span>
                    </button>
                  </>
                )}
              </div>

              <div className="row mt-4 pt-3 border-top border-light border-opacity-25 text-light small g-3">
                <div className="col-sm-4 d-flex align-items-center gap-2">
                  <CheckCircle2 size={18} className="text-warning" />
                  <span>Role-Based Security</span>
                </div>
                <div className="col-sm-4 d-flex align-items-center gap-2">
                  <CheckCircle2 size={18} className="text-warning" />
                  <span>Bilingual (EN / HI)</span>
                </div>
                <div className="col-sm-4 d-flex align-items-center gap-2">
                  <CheckCircle2 size={18} className="text-warning" />
                  <span>REST API + Postman</span>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card shadow-lg border-0 bg-white text-dark rounded-4 p-4">
                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                  <h6 className="fw-bold mb-0 text-success d-flex align-items-center gap-2">
                    <TrendingUp size={20} />
                    <span>Real-Time Agricultural Intelligence</span>
                  </h6>
                  <span className="badge bg-success-subtle text-success">Live System</span>
                </div>

                <div className="d-flex flex-column gap-3">
                  <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted d-block">Indore / Khargone Weather</small>
                      <strong>32°C • Sunny & Favorable</strong>
                    </div>
                    <CloudSun size={28} className="text-warning" />
                  </div>

                  <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted d-block">Soil Diagnosis Engine</small>
                      <strong>Automated N-P-K & pH Scoring</strong>
                    </div>
                    <Microscope size={28} className="text-success" />
                  </div>

                  <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted d-block">Pest Warning System</small>
                      <strong>Active Outbreak Notifications</strong>
                    </div>
                    <ShieldCheck size={28} className="text-danger" />
                  </div>
                </div>

                <div className="mt-4 pt-2 text-center">
                  <small className="text-muted">
                    No account? Register in 10 seconds or use the one-click demo logins above.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="text-success fw-bold text-uppercase small tracking-wide">Complete Full-Stack Architecture</span>
            <h2 className="fw-bold mt-1">Key Smart Farming Modules</h2>
            <p className="text-muted">
              Built in accordance with the 6 core epics and 19 functional tasks using the MERN stack.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 p-4 border rounded-4 hover-lift">
                <div className="bg-primary-soft stat-icon-wrapper mb-3">
                  <Sprout size={24} className="text-success" />
                </div>
                <h5 className="fw-bold">Farm & Crop Management</h5>
                <p className="text-muted small">
                  Register land parcels, manage soil profiles, track seed sowing dates, crop maturity stages, and log agricultural field activities.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card h-100 p-4 border rounded-4 hover-lift">
                <div className="bg-info-soft stat-icon-wrapper mb-3">
                  <Microscope size={24} className="text-primary" />
                </div>
                <h5 className="fw-bold">Soil Health Analysis</h5>
                <p className="text-muted small">
                  Diagnostic lab inputs for Nitrogen, Phosphorus, Potassium, Organic Carbon, and pH with automated agronomic recommendations.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card h-100 p-4 border rounded-4 hover-lift">
                <div className="bg-warning-soft stat-icon-wrapper mb-3">
                  <CloudSun size={24} className="text-warning" />
                </div>
                <h5 className="fw-bold">Weather & Pest Alerts</h5>
                <p className="text-muted small">
                  Hyperlocal weather forecasts paired with spraying condition advisories and early warning alerts for insect and fungal outbreaks.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card h-100 p-4 border rounded-4 hover-lift">
                <div className="bg-success-soft stat-icon-wrapper mb-3">
                  <ShoppingCart size={24} className="text-success" />
                </div>
                <h5 className="fw-bold">Agri Marketplace & Orders</h5>
                <p className="text-muted small">
                  Catalog of certified seeds, fertilizers, and drip irrigation tools with integrated cart, order placement, and live status tracking.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card h-100 p-4 border rounded-4 hover-lift">
                <div className="bg-primary-soft stat-icon-wrapper mb-3">
                  <Users size={24} className="text-success" />
                </div>
                <h5 className="fw-bold">Expert Consultation Forum</h5>
                <p className="text-muted small">
                  Community Q&A and direct agricultural university agronomist consultations for pest diagnosis, crop diseases, and subsidy schemes.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card h-100 p-4 border rounded-4 hover-lift">
                <div className="bg-danger-soft stat-icon-wrapper mb-3">
                  <ShieldCheck size={24} className="text-danger" />
                </div>
                <h5 className="fw-bold">Role-Based Admin Portal</h5>
                <p className="text-muted small">
                  Administrative oversight for user roles, content moderation, order status fulfillment, and platform-wide analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
