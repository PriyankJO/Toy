import api from './api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.patch('/auth/profile', data);
    return res.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await api.patch('/auth/change-password', { currentPassword, newPassword });
    return res.data;
  },

  addAddress: async (addressData) => {
    const res = await api.post('/auth/addresses', addressData);
    return res.data;
  },

  deleteAddress: async (id) => {
    const res = await api.delete(`/auth/addresses/${id}`);
    return res.data;
  }
};
