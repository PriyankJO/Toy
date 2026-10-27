const Coupon = require('../models/Coupon');

// @desc    Validate coupon code and return discount amount
// @route   POST /api/coupons/validate
// @access  Private / Public
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, orderSubtotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a coupon code.'
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired coupon code.'
      });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has expired.'
      });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'This coupon usage limit has been reached.'
      });
    }

    const subtotal = Number(orderSubtotal) || 0;
    if (subtotal < coupon.minimumOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value for this coupon is ₹${coupon.minimumOrderValue}.`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed subtotal
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    res.status(200).json({
      success: true,
      message: `Coupon "${coupon.code}" applied! You save ₹${discountAmount}.`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Admin
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a coupon
// @route   POST /api/admin/coupons
// @access  Admin
exports.createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderValue,
      maxDiscountAmount,
      expiryDate,
      usageLimit,
      active
    } = req.body;

    if (!code || !discountValue || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'Code, discount value, and expiry date are required.'
      });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A coupon with this code already exists.'
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minimumOrderValue: Number(minimumOrderValue) || 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      expiryDate: new Date(expiryDate),
      usageLimit: usageLimit ? Number(usageLimit) : 500,
      active: active !== undefined ? Boolean(active) : true
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully.',
      coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update coupon
// @route   PATCH /api/admin/coupons/:id
// @access  Admin
exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully.',
      coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Admin
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
