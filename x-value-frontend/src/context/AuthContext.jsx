import React, { createContext, useState, useEffect } from 'react';
import { signup as apiSignup, login as apiLogin } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    let storedUser = null;
    
    try {
      storedUser = JSON.parse(localStorage.getItem('user'));
    } catch {
      // Invalid user data in localStorage
      localStorage.removeItem('user');
    }

    // If we have both token and user, restore the session
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    } else {
      // Clear any partial data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  const signup = async (name, email, password) => {
    const res = await apiSignup({ name, email, password });
    setUser(res.user);
    setToken(res.token);
    return res;
  };

  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    setUser(res.user);
    setToken(res.token);
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout, isAuthenticated: !!(user && token), isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
