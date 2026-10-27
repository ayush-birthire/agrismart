import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Globe, User, LogOut, ShieldAlert, ShoppingBag, CloudSun, Layers, MessageSquare, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-2" style={{ backgroundColor: '#143823' }}>
      <div className="container-fluid px-lg-4">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-success fs-4" to="/">
          <div className="bg-success text-white p-1 rounded-3 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
            <Sprout size={24} />
          </div>
          <span className="text-white">{t('brandName')}</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className={`nav-link px-3 ${isActive('/dashboard') ? 'active text-success fw-bold' : 'text-light'}`} to="/dashboard">
                    {t('nav.dashboard')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link px-3 ${isActive('/farms') ? 'active text-success fw-bold' : 'text-light'}`} to="/farms">
                    {t('nav.farms')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link px-3 ${isActive('/crops') ? 'active text-success fw-bold' : 'text-light'}`} to="/crops">
                    {t('nav.crops')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link px-3 ${isActive('/soil') ? 'active text-success fw-bold' : 'text-light'}`} to="/soil">
                    {t('nav.soil')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link px-3 ${isActive('/weather') ? 'active text-success fw-bold' : 'text-light'}`} to="/weather">
                    {t('nav.weather')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link px-3 ${isActive('/market') ? 'active text-success fw-bold' : 'text-light'}`} to="/market">
                    {t('nav.market')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link px-3 ${isActive('/orders') ? 'active text-success fw-bold' : 'text-light'}`} to="/orders">
                    {t('nav.orders')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link px-3 ${isActive('/forum') ? 'active text-success fw-bold' : 'text-light'}`} to="/forum">
                    {t('nav.forum')}
                  </Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/admin') ? 'active text-warning fw-bold' : 'text-warning'}`} to="/admin">
                      ★ {t('nav.admin')}
                    </Link>
                  </li>
                )}
              </>
            ) : (
              <li className="nav-item">
                <Link className={`nav-link px-3 ${isActive('/') ? 'active text-success fw-bold' : 'text-light'}`} to="/">
                  Home
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {/* Language Switcher */}
            <div className="btn-group btn-group-sm bg-secondary bg-opacity-25 rounded-pill p-1">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 fw-bold ${lang === 'en' ? 'btn-success text-white' : 'btn-outline-secondary text-light border-0'}`}
                onClick={() => toggleLanguage('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 fw-bold ${lang === 'hi' ? 'btn-success text-white' : 'btn-outline-secondary text-light border-0'}`}
                onClick={() => toggleLanguage('hi')}
              >
                हिन्दी
              </button>
            </div>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-2 py-1">
                  {user.role === 'admin' ? '🛡 Admin' : '🌾 Farmer'}
                </span>
                <span className="text-light small fw-medium d-none d-md-inline">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 rounded-pill px-3"
                  title="Logout"
                >
                  <LogOut size={16} />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-outline-light rounded-pill px-3">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn btn-sm btn-success rounded-pill px-3">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

