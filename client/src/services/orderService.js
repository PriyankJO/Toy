import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const res = await api.post('/orders', orderData);
    return res.data;
  },

  getMyOrders: async () => {
    const res = await api.get('/orders/my-orders');
    return res.data;
  },

  getOrderById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  cancelOrder: async (id) => {
    const res = await api.post(`/orders/${id}/cancel`);
    return res.data;
  },

  validateCoupon: async (code, orderSubtotal) => {
    const res = await api.post('/coupons/validate', { code, orderSubtotal });
    return res.data;
  },

  createRazorpayOrder: async (orderId) => {
    const res = await api.post('/payments/razorpay/order', { orderId });
    return res.data;
  },

  verifyRazorpayPayment: async (paymentData) => {
    const res = await api.post('/payments/razorpay/verify', paymentData);
    return res.data;
  }
};
