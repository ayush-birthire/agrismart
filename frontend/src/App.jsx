import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import Crops from './pages/Crops';
import SoilAnalysis from './pages/SoilAnalysis';
import WeatherPest from './pages/WeatherPest';
import Marketplace from './pages/Marketplace';
import OrderTracking from './pages/OrderTracking';
import CommunityForum from './pages/CommunityForum';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Farmer & Authenticated Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farms"
                  element={
                    <ProtectedRoute>
                      <Farms />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crops"
                  element={
                    <ProtectedRoute>
                      <Crops />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/soil"
                  element={
                    <ProtectedRoute>
                      <SoilAnalysis />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/weather"
                  element={
                    <ProtectedRoute>
                      <WeatherPest />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/market"
                  element={
                    <ProtectedRoute>
                      <Marketplace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderTracking />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forum"
                  element={
                    <ProtectedRoute>
                      <CommunityForum />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Only Route */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
