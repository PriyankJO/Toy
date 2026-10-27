const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

// Initialize Razorpay client with fallback for dev testing
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && !process.env.RAZORPAY_KEY_ID.includes('your_')) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  } catch (err) {
    console.warn('Razorpay init notice:', err.message);
  }
}

// @desc    Create Razorpay Order
// @route   POST /api/payments/razorpay/order
// @access  Private
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const amountInPaise = Math.round(order.total * 100);

    // If Razorpay credentials configured and valid, create via API; otherwise create safe sandbox test order
    let rzpOrder;
    if (razorpayInstance && !process.env.RAZORPAY_KEY_ID.startsWith('rzp_test_toywonder123')) {
      try {
        rzpOrder = await razorpayInstance.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: order.orderNumber,
          notes: {
            orderId: order._id.toString(),
            userEmail: req.user.email
          }
        });
      } catch (err) {
        console.warn('Razorpay API error, falling back to local sandbox order:', err.message);
      }
    }

    // Fallback sandbox order for local development/testing
    if (!rzpOrder) {
      rzpOrder = {
        id: `order_toywonder_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        amount: amountInPaise,
        currency: 'INR',
        receipt: order.orderNumber,
        status: 'created'
      };
    }

    order.razorpayOrderId = rzpOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      razorpayOrder: rzpOrder,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_toywonder123',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.total
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/razorpay/verify
// @access  Private
exports.verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, isTestBypass } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify signature
    let isValid = false;

    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const secret = process.env.RAZORPAY_KEY_SECRET || 'toywonder_test_secret_key_456';
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature === razorpay_signature) {
        isValid = true;
      }
    }

    // Allow sandbox test simulator in development
    if (process.env.NODE_ENV !== 'production' && isTestBypass) {
      isValid = true;
    }

    if (!isValid) {
      order.paymentStatus = 'Failed';
      order.statusHistory.push({
        status: order.orderStatus,
        note: 'Online payment verification failed or was cancelled.',
        changedAt: new Date()
      });
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.'
      });
    }

    // Payment Success
    order.paymentStatus = 'Paid';
    order.orderStatus = 'Confirmed';
    order.razorpayPaymentId = razorpay_payment_id || `pay_sim_${Date.now()}`;
    order.razorpaySignature = razorpay_signature || 'simulated_signature';
    order.statusHistory.push({
      status: 'Confirmed',
      note: `Payment verified successfully via Razorpay (Txn ID: ${order.razorpayPaymentId})`,
      changedAt: new Date()
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully! Your order is confirmed.',
      order
    });
  } catch (error) {
    next(error);
  }
};
