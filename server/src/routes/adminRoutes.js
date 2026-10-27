const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getSalesAnalytics,
  getCategoryAndTopProducts,
  getCustomers,
  updateCustomerStatus,
  getInventoryMovements,
  adjustStock
} = require('../controllers/adminController');
const {
  getAdminOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// All routes here require Admin authorization
router.use(protect, admin);

// Analytics
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/sales', getSalesAnalytics);
router.get('/dashboard/category-sales', getCategoryAndTopProducts);

// Orders
router.get('/orders', getAdminOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Customers
router.get('/customers', getCustomers);
router.patch('/customers/:id/status', updateCustomerStatus);

// Inventory
router.get('/inventory/movements', getInventoryMovements);
router.post('/inventory/adjust', adjustStock);

module.exports = router;
