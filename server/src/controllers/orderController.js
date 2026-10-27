const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const InventoryMovement = require('../models/InventoryMovement');

// @desc    Create a new order (with stock deduction & price verification)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = 'COD', couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.phone) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required.'
      });
    }

    // Server-side recalculation and stock check
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);

      if (!product || !product.active) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.name || 'Unknown'}" is not available.`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`
        });
      }

      const effectivePrice = product.discountPrice ? product.discountPrice : product.price;
      const itemSubtotal = effectivePrice * item.quantity;
      subtotal += itemSubtotal;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: effectivePrice,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });
    }

    // Coupon discount verification
    let discount = 0;
    let couponData = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
      if (coupon && new Date() <= new Date(coupon.expiryDate) && subtotal >= coupon.minimumOrderValue) {
        if (coupon.discountType === 'percentage') {
          discount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
            discount = coupon.maxDiscountAmount;
          }
        } else {
          discount = coupon.discountValue;
        }

        if (discount > subtotal) discount = subtotal;

        couponData = {
          code: coupon.code,
          discountAmount: discount
        };

        // Increment usage count
        coupon.usageCount += 1;
        await coupon.save();
      }
    }

    // Shipping calculation
    const shippingFee = subtotal > 499 ? 0 : 50;
    const total = Math.max(0, subtotal - discount + shippingFee);

    // Deduct stock safely and record movement
    for (const item of verifiedItems) {
      const product = await Product.findById(item.product);
      const prevStock = product.stock;
      product.stock = Math.max(0, product.stock - item.quantity);
      await product.save();

      await InventoryMovement.create({
        product: product._id,
        movementType: 'purchase',
        quantity: -item.quantity,
        previousStock: prevStock,
        newStock: product.stock,
        reference: `Order placed by user ${req.user.name}`,
        performedBy: req.user._id
      });
    }

    // Generate readable orderNumber
    const orderNumber = `TW-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items: verifiedItems,
      shippingAddress,
      subtotal,
      discount,
      shippingFee,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
      orderStatus: paymentMethod === 'COD' ? 'Confirmed' : 'Pending',
      coupon: couponData,
      statusHistory: [
        {
          status: paymentMethod === 'COD' ? 'Confirmed' : 'Pending',
          note: paymentMethod === 'COD' ? 'Order confirmed via Cash on Delivery' : 'Order created, awaiting payment verification',
          changedAt: new Date()
        }
      ]
    });

    // Clear customer cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID or orderNumber
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).populate('user', 'name email phone');
    } else {
      order = await Order.findOne({ orderNumber: id }).populate('user', 'name email phone');
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Ensure only the order owner or admin can view
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Customer cancel order (allowed if Pending or Confirmed)
// @route   POST /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (!['Pending', 'Confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in "${order.orderStatus}" state.`
      });
    }

    // Restore inventory
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        const prevStock = product.stock;
        product.stock += item.quantity;
        await product.save();

        await InventoryMovement.create({
          product: product._id,
          movementType: 'cancellation_restore',
          quantity: item.quantity,
          previousStock: prevStock,
          newStock: product.stock,
          reference: `Order ${order.orderNumber} cancelled`,
          performedBy: req.user._id
        });
      }
    }

    order.orderStatus = 'Cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      note: 'Order cancelled by customer. Stock restored to inventory.',
      changedAt: new Date()
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and stock restored.',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Admin
exports.getAdminOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 15 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const validTransitions = {
      Pending: ['Confirmed', 'Cancelled'],
      Confirmed: ['Processing', 'Cancelled'],
      Processing: ['Shipped', 'Cancelled'],
      Shipped: ['Delivered'],
      Delivered: [],
      Cancelled: []
    };

    if (status && status !== order.orderStatus) {
      const allowedNext = validTransitions[order.orderStatus] || [];
      if (!allowedNext.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from "${order.orderStatus}" to "${status}". Allowed: ${allowedNext.join(', ') || 'None'}`
        });
      }

      // If cancelling, restore inventory if not already done
      if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
        for (const item of order.items) {
          const product = await Product.findById(item.product);
          if (product) {
            const prevStock = product.stock;
            product.stock += item.quantity;
            await product.save();

            await InventoryMovement.create({
              product: product._id,
              movementType: 'cancellation_restore',
              quantity: item.quantity,
              previousStock: prevStock,
              newStock: product.stock,
              reference: `Admin cancelled order ${order.orderNumber}`,
              performedBy: req.user._id
            });
          }
        }
      }

      order.orderStatus = status;
      order.statusHistory.push({
        status,
        note: note || `Status updated to ${status} by admin`,
        changedAt: new Date()
      });
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${order.orderStatus}.`,
      order
    });
  } catch (error) {
    next(error);
  }
};
