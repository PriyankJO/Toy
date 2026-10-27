import api from './api';

export const adminService = {
  // Dashboard stats
  getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard/stats');
    return res.data;
  },

  getSalesAnalytics: async () => {
    const res = await api.get('/admin/dashboard/sales');
    return res.data;
  },

  getCategoryAnalytics: async () => {
    const res = await api.get('/admin/dashboard/category-sales');
    return res.data;
  },

  // Orders
  getOrders: async (params = {}) => {
    const res = await api.get('/admin/orders', { params });
    return res.data;
  },

  updateOrderStatus: async (orderId, statusData) => {
    const res = await api.patch(`/admin/orders/${orderId}/status`, statusData);
    return res.data;
  },

  // Products
  createProduct: async (productData) => {
    const res = await api.post('/products', productData);
    return res.data;
  },

  updateProduct: async (id, productData) => {
    const res = await api.patch(`/products/${id}`, productData);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  // Categories
  createCategory: async (categoryData) => {
    const res = await api.post('/categories', categoryData);
    return res.data;
  },

  updateCategory: async (id, categoryData) => {
    const res = await api.patch(`/categories/${id}`, categoryData);
    return res.data;
  },

  deleteCategory: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },

  // Customers
  getCustomers: async (params = {}) => {
    const res = await api.get('/admin/customers', { params });
    return res.data;
  },

  updateCustomerStatus: async (id, accountStatus) => {
    const res = await api.patch(`/admin/customers/${id}/status`, { accountStatus });
    return res.data;
  },

  // Inventory
  getInventoryMovements: async () => {
    const res = await api.get('/admin/inventory/movements');
    return res.data;
  },

  adjustStock: async (productId, quantity, note) => {
    const res = await api.post('/admin/inventory/adjust', { productId, quantity, note });
    return res.data;
  },

  // Coupons
  getCoupons: async () => {
    const res = await api.get('/coupons/admin');
    return res.data;
  },

  createCoupon: async (couponData) => {
    const res = await api.post('/coupons/admin', couponData);
    return res.data;
  },

  updateCoupon: async (id, couponData) => {
    const res = await api.patch(`/coupons/admin/${id}`, couponData);
    return res.data;
  },

  deleteCoupon: async (id) => {
    const res = await api.delete(`/coupons/admin/${id}`);
    return res.data;
  },

  // Image Upload
  uploadImages: async (formData) => {
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};
