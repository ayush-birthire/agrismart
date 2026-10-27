import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Heart, ShieldCheck, Cpu } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-auto border-top border-secondary border-opacity-25" style={{ backgroundColor: '#0f2919' }}>
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-success text-white p-1 rounded-3">
                <Sprout size={24} />
              </div>
              <h5 className="mb-0 fw-bold text-white">{t('brandName')}</h5>
            </div>
            <p className="text-secondary small pe-lg-4">
              {t('tagline')}. A comprehensive full-stack smart farming platform integrating real-time meteorology, scientific soil analysis, automated pest alert notifications, and an agricultural marketplace.
            </p>
            <div className="d-flex gap-2 flex-wrap">
              <span className="badge bg-secondary bg-opacity-25 text-success border border-success border-opacity-25">MongoDB</span>
              <span className="badge bg-secondary bg-opacity-25 text-success border border-success border-opacity-25">Express.js</span>
              <span className="badge bg-secondary bg-opacity-25 text-success border border-success border-opacity-25">React.js</span>
              <span className="badge bg-secondary bg-opacity-25 text-success border border-success border-opacity-25">Node.js</span>
              <span className="badge bg-secondary bg-opacity-25 text-success border border-success border-opacity-25">JWT & bcrypt</span>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <h6 className="text-white fw-semibold mb-3">Smart Farming Modules</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li>Farm Profile & Land Records</li>
              <li>Phenological Crop Stage Tracking</li>
              <li>Automated Soil NPK Diagnosis</li>
              <li>Hyperlocal Weather & Pest Alerts</li>
              <li>Agricultural Input Marketplace</li>
              <li>KVK Expert Advisory Forum</li>
            </ul>
          </div>

          <div className="col-6 col-lg-4">
            <h6 className="text-white fw-semibold mb-3">Architecture & Standards</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li className="d-flex align-items-center gap-2">
                <ShieldCheck size={16} className="text-success" />
                <span>Role-Based Access Control (Farmer / Admin)</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Cpu size={16} className="text-success" />
                <span>RESTful Architecture with Referencing</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Heart size={16} className="text-success" />
                <span>Bilingual Accessibility (English & Hindi)</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary border-opacity-25 my-3" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary">
          <p className="mb-2 mb-md-0">
            © {new Date().getFullYear()} AgriSmart Platform. Built with MERN Stack.
          </p>
          <p className="mb-0">
            Ready for Evaluation & Portfolio Submission.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
