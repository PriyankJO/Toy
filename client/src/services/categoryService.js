import api from './api';

export const categoryService = {
  getCategories: async (all = false) => {
    const res = await api.get('/categories', { params: { all } });
    return res.data;
  },

  getCategory: async (idOrSlug) => {
    const res = await api.get(`/categories/${idOrSlug}`);
    return res.data;
  }
};
