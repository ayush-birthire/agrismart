import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, authError } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const setDemoCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="bg-success text-white p-2 rounded-3 d-inline-flex mb-2">
                <Sprout size={32} />
              </div>
              <h3 className="fw-bold">{t('nav.login')} to {t('brandName')}</h3>
              <p className="text-muted small">Enter your email and password to access your farm dashboard</p>
            </div>

            {authError && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                <AlertCircle size={18} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Mail size={18} className="text-muted" />
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0"
                    placeholder="e.g. farmer@agrismart.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Lock size={18} className="text-muted" />
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-success w-100 py-2 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <span>{t('nav.login')}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Autofill Section */}
            <div className="mt-4 pt-3 border-top">
              <small className="text-muted fw-semibold d-block mb-2 text-center">
                Quick Demo Accounts (Click to autofill):
              </small>
              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  onClick={() => setDemoCredentials('farmer@agrismart.org', 'farmerpassword123')}
                  className="btn btn-sm btn-outline-success d-flex align-items-center justify-content-between px-3 py-2 text-start rounded-3"
                >
                  <div className="d-flex align-items-center gap-2">
                    <UserCheck size={16} />
                    <span><strong>Farmer:</strong> Ramesh Patel</span>
                  </div>
                  <span className="badge bg-success-subtle text-success">Farmer Role</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('admin@agrismart.org', 'adminpassword123')}
                  className="btn btn-sm btn-outline-warning text-dark d-flex align-items-center justify-content-between px-3 py-2 text-start rounded-3"
                >
                  <div className="d-flex align-items-center gap-2">
                    <ShieldCheck size={16} className="text-warning" />
                    <span><strong>Admin:</strong> System Administrator</span>
                  </div>
                  <span className="badge bg-warning-subtle text-warning">Admin Role</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('ayush@agrismart.org', 'ayushpassword123')}
                  className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-between px-3 py-2 text-start rounded-3"
                >
                  <div className="d-flex align-items-center gap-2">
                    <UserCheck size={16} />
                    <span><strong>Ayush:</strong> Ayush Birthire</span>
                  </div>
                  <span className="badge bg-primary-subtle text-primary">Farmer Role</span>
                </button>
              </div>
            </div>

            <div className="text-center mt-4">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/register" className="small fw-bold text-success text-decoration-none">
                {t('nav.register')} here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

