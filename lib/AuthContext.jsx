'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = Cookies.get('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken) => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('[ ] Failed to fetch profile:', error);
      Cookies.remove('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    const response = await authAPI.register(data);
    Cookies.set('token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const login = async (data) => {
    const response = await authAPI.login(data);
    Cookies.set('token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    Cookies.remove('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const response = await authAPI.updateProfile(data);
    setUser(response.data.user);
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
