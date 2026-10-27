import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Lock, Mail, User, Phone, MapPin, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer',
    phone: '',
    location: {
      village: '',
      district: '',
      state: '',
    },
    preferredLanguage: 'en',
  });

  const { register, loading, authError } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-9 col-lg-7">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="bg-success text-white p-2 rounded-3 d-inline-flex mb-2">
                <Sprout size={32} />
              </div>
              <h3 className="fw-bold">Create an {t('brandName')} Account</h3>
              <p className="text-muted small">Join the smart farming network with role-based access</p>
            </div>

            {authError && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                <AlertCircle size={18} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Full Name *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <User size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      name="name"
                      className="form-control border-start-0"
                      placeholder="e.g. Ramesh Patel"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Email Address *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Mail size={18} className="text-muted" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control border-start-0"
                      placeholder="farmer@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Password *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Lock size={18} className="text-muted" />
                    </span>
                    <input
                      type="password"
                      name="password"
                      className="form-control border-start-0"
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Account Role *</label>
                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="farmer">🌾 Farmer (Manage farms, crops, orders)</option>
                    <option value="admin">🛡 Admin (Platform moderation, orders, alerts)</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Phone size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      name="phone"
                      className="form-control border-start-0"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Preferred Interface Language</label>
                  <select
                    name="preferredLanguage"
                    className="form-select"
                    value={formData.preferredLanguage}
                    onChange={handleChange}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                  </select>
                </div>
              </div>

              <div className="card bg-light border-0 p-3 mb-4 rounded-3">
                <h6 className="fw-semibold text-muted small mb-2 d-flex align-items-center gap-1">
                  <MapPin size={16} />
                  <span>Geographic Location</span>
                </h6>
                <div className="row g-2">
                  <div className="col-md-4">
                    <input
                      type="text"
                      name="location.village"
                      className="form-control form-control-sm"
                      placeholder="Village / Town"
                      value={formData.location.village}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      name="location.district"
                      className="form-control form-control-sm"
                      placeholder="District (e.g. Khargone)"
                      value={formData.location.district}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      name="location.state"
                      className="form-control form-control-sm"
                      placeholder="State (e.g. Madhya Pradesh)"
                      value={formData.location.state}
                      onChange={handleChange}
                    />
                  </div>
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
                    <span>Create {formData.role === 'admin' ? 'Admin' : 'Farmer'} Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="small fw-bold text-success text-decoration-none">
                {t('nav.login')} here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

