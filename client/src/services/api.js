import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add Authorization header from localStorage token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('toywonder_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or invalid
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login/register failures
      const url = error.config.url;
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        // localStorage.removeItem('toywonder_token');
        // localStorage.removeItem('toywonder_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
