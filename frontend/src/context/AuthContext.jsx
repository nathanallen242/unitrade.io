import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, isAuthenticated, logout } from '../middleware/auth.js';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginListeners, setLoginListeners] = useState([]);

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
        // Trigger all registered login listeners
        loginListeners.forEach(listener => listener(user));
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

  const onLogin = (listener) => {
    setLoginListeners(prevListeners => [...prevListeners, listener]);
  };

  const value = {
    currentUser,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated,
    onLogin // Add onLogin to the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
