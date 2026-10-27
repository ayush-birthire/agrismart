import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('agrismart_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('agrismart_token') || null;
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Set default auth header on Axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('agrismart_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('agrismart_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('agrismart_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agrismart_user');
    }
  }, [user]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to login. Please check credentials.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await axios.post('/api/auth/register', userData);
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to register account.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agrismart_user');
    localStorage.removeItem('agrismart_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isFarmer: user?.role === 'farmer',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
