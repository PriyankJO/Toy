import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('toywonder_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('toywonder_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('toywonder_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.error('Session restore failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('toywonder_token', data.token);
        localStorage.setItem('toywonder_user', JSON.stringify(data.user));
        toast.success(data.message || 'Logged in successfully!');
        return { success: true, user: data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('toywonder_token', data.token);
        localStorage.setItem('toywonder_user', JSON.stringify(data.user));
        toast.success(data.message || 'Welcome to ToyWonder!');
        return { success: true, user: data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('toywonder_token');
    localStorage.removeItem('toywonder_user');
    toast.success('You have been logged out.');
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('toywonder_user', JSON.stringify(updated));
  };

  const isAuthenticated = Boolean(user && token);
  const isAdmin = Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
