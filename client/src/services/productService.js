import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    const res = await api.get('/products', { params });
    return res.data;
  },

  getFeatured: async () => {
    const res = await api.get('/products/featured');
    return res.data;
  },

  getProduct: async (idOrSlug) => {
    const res = await api.get(`/products/${idOrSlug}`);
    return res.data;
  },

  getReviews: async (productId) => {
    const res = await api.get(`/reviews/product/${productId}`);
    return res.data;
  },

  addReview: async (productId, reviewData) => {
    const res = await api.post(`/reviews/product/${productId}`, reviewData);
    return res.data;
  }
};
