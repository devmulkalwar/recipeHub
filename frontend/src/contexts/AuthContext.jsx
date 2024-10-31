// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import fakeData from '../data/generateFakeData';

const AuthContext = createContext();

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    try {
      // Set the logged-in user based on `loggedInUserId`
      const loggedInUser = fakeData.users.find(u => u.id === fakeData.loggedInUserId);
      if (loggedInUser) {
        setUser(loggedInUser);
        console.log(user)
      } else {
        setError("User not found.");
      }
    } catch (err) {
      setError("An error occurred while fetching the user.");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userId) => {
    const loggedInUser = fakeData.users.find(u => u.id === userId);
    if (loggedInUser) {
      setUser(loggedInUser);
      setError(null);
    } else {
      setError("User not found.");
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
