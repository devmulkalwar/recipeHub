// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import fakeData from '../data/generateFakeData';

 const AuthContext = createContext();

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set the logged-in user based on `loggedInUserId`
    const loggedInUser = fakeData.users.find(u => u.id === fakeData.loggedInUserId);
    setUser(loggedInUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider,AuthContext}