import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, isAuthenticated, logout } from '../middleware/auth.js';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setCurrentUser(storedUser);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const { user, token } = await login(credentials);
      if (token) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};