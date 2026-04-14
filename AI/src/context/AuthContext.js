/**
 * 认证状态管理
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../api/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        const userData = await authAPI.getMe();
        setUser(userData);
      }
    } catch (e) {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    await AsyncStorage.setItem('access_token', res.access_token);
    await AsyncStorage.setItem('refresh_token', res.refresh_token);
    const userData = await authAPI.getMe();
    setUser(userData);
    return userData;
  };

  const register = async (email, password, nickname) => {
    const res = await authAPI.register({ email, password, nickname });
    // 注册后自动登录
    return login(email, password);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
