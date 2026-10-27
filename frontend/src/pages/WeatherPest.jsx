import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getWeather, getPestAlerts } from '../services/api';
import { CloudSun, Droplets, Wind, AlertTriangle, ShieldCheck, Search, ShieldAlert, Sparkles } from 'lucide-react';

const WeatherPest = () => {
  const { t } = useLanguage();
  const [district, setDistrict] = useState('Indore');
  const [searchDistrict, setSearchDistrict] = useState('Indore');
  const [weather, setWeather] = useState(null);
  const [pestAlerts, setPestAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async (targetDistrict) => {
    try {
      setLoading(true);
      const [wRes, pRes] = await Promise.all([
        getWeather({ district: targetDistrict }),
        getPestAlerts(),
      ]);
      setWeather(wRes.data.data || null);
      setPestAlerts(pRes.data.data || []);
    } catch (err) {
      console.error('Failed to load weather/pest alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(district);
  }, [district]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchDistrict.trim()) {
      setDistrict(searchDistrict.trim());
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <CloudSun className="text-warning" size={28} />
            <span>{t('weather.title')}</span>
          </h2>
          <p className="text-muted small mb-0">{t('weather.subtitle')}</p>
        </div>

        {/* District Switcher */}
        <form onSubmit={handleSearch} className="d-flex gap-2">
          <div className="input-group input-group-sm">
            <input
              type="text"
              className="form-control"
              placeholder="Search District (e.g. Bhopal)"
              value={searchDistrict}
              onChange={(e) => setSearchDistrict(e.target.value)}
            />
            <button className="btn btn-success d-flex align-items-center gap-1" type="submit">
              <Search size={14} />
              <span>Update</span>
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <>
          {/* Main Weather Hero Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 text-white" style={{ background: 'linear-gradient(135deg, #154c30 0%, #198754 100%)' }}>
            <div className="row align-items-center g-4">
              <div className="col-lg-5 border-end-lg border-white border-opacity-25">
                <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold mb-2">
                  📍 {weather?.location?.district || district}, {weather?.location?.state || 'Madhya Pradesh'}
                </span>
                <div className="d-flex align-items-baseline gap-3 my-2">
                  <h1 className="display-3 fw-bold mb-0">{weather?.current?.temperature || 32}°C</h1>
                  <div>
                    <h5 className="mb-0 fw-semibold text-warning">{weather?.current?.condition || 'Clear & Sunny'}</h5>
                    <small className="text-light opacity-75">Feels like {weather?.current?.feelsLike || 34}°C</small>
                  </div>
                </div>
                <small className="text-light opacity-75">
                  Last recorded: {new Date(weather?.recordedAt || Date.now()).toLocaleTimeString()}
                </small>
              </div>

              <div className="col-lg-7">
                <div className="row g-3">
                  <div className="col-4">
                    <div className="p-3 bg-white bg-opacity-10 rounded-3 text-center">
                      <Droplets size={24} className="text-info mb-1" />
                      <div className="small text-light opacity-75">{t('weather.humidity')}</div>
                      <h5 className="fw-bold mb-0 mt-1">{weather?.current?.humidity || 55}%</h5>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 bg-white bg-opacity-10 rounded-3 text-center">
                      <Wind size={24} className="text-light mb-1" />
                      <div className="small text-light opacity-75">{t('weather.windSpeed')}</div>
                      <h5 className="fw-bold mb-0 mt-1">{weather?.current?.windSpeed || 12} km/h</h5>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 bg-white bg-opacity-10 rounded-3 text-center">
                      <CloudSun size={24} className="text-warning mb-1" />
                      <div className="small text-light opacity-75">{t('weather.rainfall')}</div>
                      <h5 className="fw-bold mb-0 mt-1">{weather?.current?.rainfall || 0} mm</h5>
                    </div>
                  </div>
                </div>

                {/* Agricultural Spraying & Irrigation Advisory Box */}
                <div className="mt-3 p-3 bg-white bg-opacity-15 rounded-3 border border-white border-opacity-25">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-warning d-flex align-items-center gap-1">
                      <Sparkles size={16} />
                      <span>{t('weather.sprayingAdvice')}:</span>
                    </strong>
                    <span className="badge bg-warning text-dark px-2 py-1">
                      {weather?.agriculturalAdvisory?.sprayingCondition || 'Favorable'}
                    </span>
                  </div>
                  <p className="small text-light mb-0 opacity-90">
                    {weather?.agriculturalAdvisory?.irrigationAdvice || 'Moderate humidity and calm winds provide optimal conditions for pesticide or nutrient foliar spraying.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
            <h5 className="fw-bold mb-3 text-dark">{t('weather.sevenDayForecast')}</h5>
            <div className="row g-2">
              {weather?.forecast?.map((day, idx) => (
                <div key={idx} className="col-6 col-md-3 col-lg">
                  <div className="p-3 bg-light rounded-3 text-center h-100 border">
                    <span className="fw-bold text-dark small d-block mb-1">{day.day}</span>
                    <CloudSun size={26} className="text-warning my-1" />
                    <div className="fw-bold text-dark mt-1" style={{ fontSize: '0.95rem' }}>
                      {day.tempMax}° / <span className="text-muted fw-normal">{day.tempMin}°</span>
                    </div>
                    <small className="text-muted d-block text-truncate" style={{ fontSize: '0.75rem' }}>
                      {day.condition}
                    </small>
                    <span className="badge bg-primary-subtle text-primary mt-2" style={{ fontSize: '0.7rem' }}>
                      Rain: {day.rainProbability}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Pest Alerts Section */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                <ShieldAlert size={22} className="text-danger" />
                <span>{t('weather.pestAlertsHeading')}</span>
              </h5>
              <span className="badge bg-danger px-3 py-1 rounded-pill">
                {pestAlerts.length} Active Warnings
              </span>
            </div>

            <div className="row g-4">
              {pestAlerts.map((pest) => (
                <div key={pest._id} className="col-lg-6">
                  <div className="card h-100 border-0 shadow-sm rounded-4 p-4 border-start border-danger border-4 bg-light">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 className="fw-bold text-dark mb-0">{pest.pestName}</h5>
                        {pest.scientificName && (
                          <small className="text-muted fst-italic">({pest.scientificName})</small>
                        )}
                      </div>
                      <span className={`badge ${pest.severity === 'Severe' || pest.severity === 'High' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                        {pest.severity} Severity
                      </span>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Affected Crops:</small>
                      <div className="d-flex flex-wrap gap-1">
                        {pest.affectedCrops?.map((c, i) => (
                          <span key={i} className="badge bg-danger-subtle text-danger border border-danger border-opacity-25">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <strong className="small text-dark d-block mb-1">{t('weather.symptoms')}:</strong>
                      <ul className="small text-muted mb-0 ps-3">
                        {pest.symptoms?.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-white rounded-3 border mb-2 small">
                      <strong className="text-success d-block mb-1">🌿 {t('weather.organicTreatment')}:</strong>
                      <p className="text-muted mb-0">{pest.organicTreatment || 'Apply neem kernel extract (5%) or release biological parasitoids.'}</p>
                    </div>

                    <div className="p-3 bg-white rounded-3 border small">
                      <strong className="text-primary d-block mb-1">🧪 {t('weather.chemicalTreatment')}:</strong>
                      <p className="text-muted mb-0">{pest.chemicalTreatment || 'Consult agricultural extension officer for labeled contact insecticide.'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherPest;
