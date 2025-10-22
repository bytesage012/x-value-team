import React, { createContext, useState, useEffect } from 'react';
import { signup as apiSignup, login as apiLogin } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));

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
    <AuthContext.Provider value={{ user, token, signup, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
