// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set default base URL for axios
axios.defaults.baseURL = 'http://localhost:3000';

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
        setUser({
          ...response.data.user,
          id: response.data.user._id, // Ensure ID is set correctly
          profileImage: response.data.user.profileImage || '/placeholder-avatar.png', // Add default image
          isProfileComplete: response.data.user.isProfileComplete || false // Check if profile is complete
        });
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null); // Clear user on auth check failure
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', 
        { email, password }, 
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setUser({
          ...response.data.user,
          id: response.data.user._id,
          profileImage: response.data.user.profileImage || '/placeholder-avatar.png'
        });
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signup = async (userData) => {
    try {
      console.log('Sending signup request with data:', userData); // Debug log
      const response = await axios.post(
        '/api/auth/signup',
        {
          email: userData.email,
          password: userData.password,
          confirmPassword: userData.confirmPassword
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.success) {
        setUser(response.data.user);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Signup error:', err.response?.data || err); // Debug log
      const errorMessage = err.response?.data?.message || 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
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
      const response = await axios.post('/api/auth/verify-email', 
        { code }, 
        { withCredentials: true }
      );

      if (response.data.success) {
        setUser({
          ...response.data.user,
          id: response.data.user._id,
          profileImage: response.data.user.profileImage || '/placeholder-avatar.png'
        });
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Email verification failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await axios.post(
        `/api/auth/reset-password/${token}`, 
        { password },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data.success) {
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Password reset failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(
        '/api/auth/forgot-password',
        { email },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data.success) {
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset link';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const completeProfile = async (profileData) => {
    try {
      const config = {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          console.log(`Upload Progress: ${Math.round((event.loaded * 100) / event.total)}%`);
        },
        timeout: 30000
      };

      const response = await axios.post('/api/users/create-profile', profileData, config);

      if (response.data.success) {
        setUser({
          ...response.data.user,
          id: response.data.user._id,
          profileImage: response.data.user.profileImage
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Profile completion error:', err);
      throw new Error(err.response?.data?.message || 'Failed to complete profile');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const config = {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          console.log(`Upload Progress: ${Math.round((event.loaded * 100) / event.total)}%`);
        },
        timeout: 60000
      };

      const response = await axios.put('/api/users/update-profile', profileData, config);

      if (response.data.success) {
        setUser({
          ...response.data.user,
          id: response.data.user._id,
          profileImage: response.data.user.profileImage
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Profile update error:', err);
      throw new Error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    verifyEmail,
    resetPassword,
    forgotPassword,
    completeProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };

