import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await api.get('/auth/profile');
          if (response.data.success) {
            setCurrentUser(response.data.user);
            setToken(storedToken);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem('token');
          setCurrentUser(null);
          setToken(null);
        }
      } else {
        setCurrentUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setCurrentUser(response.data.user);
      return response.data;
    }
    throw new Error(response.data.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setCurrentUser(response.data.user);
      return response.data;
    }
    throw new Error(response.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    token,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};