// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/check-auth', { withCredentials: true });
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
      if (response.data.success) {
        setUser(response.data.user);
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post('/api/auth/signup', userData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setUser(response.data.user);
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
    }
  };

  const verifyEmail = async (code) => {
    try {
      const response = await axios.post('/api/auth/verify-email', { code }, { withCredentials: true });
      if (response.data.success) {
        setUser(response.data.user);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email verification failed');
      return false;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await axios.post(`/api/auth/reset-password/${token}`, { password });
      return response.data.success;
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
      return false;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    verifyEmail,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
