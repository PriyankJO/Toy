const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/auth');

router.post('/validate', validateCoupon);

router.get('/admin', protect, admin, getCoupons);
router.post('/admin', protect, admin, createCoupon);
router.patch('/admin/:id', protect, admin, updateCoupon);
router.delete('/admin/:id', protect, admin, deleteCoupon);

module.exports = router;
