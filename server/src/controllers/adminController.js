const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const InventoryMovement = require('../models/InventoryMovement');

// @desc    Get Admin Dashboard Stats & Summaries
// @route   GET /api/admin/dashboard/stats
// @access  Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ['Pending', 'Confirmed'] } });
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 5 }, active: true });

    // Total Revenue (from non-cancelled orders)
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Recent 5 Orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Low stock products alert list
    const lowStockProducts = await Product.find({ stock: { $lte: 5 }, active: true })
      .select('name SKU stock price images')
      .limit(6);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        pendingOrders,
        lowStockCount
      },
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Sales Trends for Charts (Monthly or Daily)
// @route   GET /api/admin/dashboard/sales
// @access  Admin
exports.getSalesAnalytics = async (req, res, next) => {
  try {
    // Aggregate revenue by month
    const monthlySales = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);

    // Format for Recharts
    const salesData = monthlySales.map(item => ({
      month: item._id,
      revenue: Math.round(item.revenue),
      orders: item.orders
    }));

    // Status distribution
    const statusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      salesData,
      statusDistribution: statusDistribution.map(s => ({ status: s._id, count: s.count }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Top-Selling Products & Category Sales
// @route   GET /api/admin/dashboard/category-sales
// @access  Admin
exports.getCategoryAndTopProducts = async (req, res, next) => {
  try {
    // Category distribution from products
    const categorySalesAgg = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDoc'
        }
      },
      { $unwind: '$categoryDoc' },
      {
        $group: {
          _id: '$categoryDoc.name',
          color: { $first: '$categoryDoc.color' },
          productCount: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    // Top selling toys
    const topProducts = await Product.find({ active: true })
      .select('name price rating reviewCount stock images')
      .sort({ reviewCount: -1, rating: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      categoryDistribution: categorySalesAgg.map(c => ({
        name: c._id,
        value: c.productCount,
        color: c.color || '#7657E8'
      })),
      topProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Customers with Order Aggregates
// @route   GET /api/admin/customers
// @access  Admin
exports.getCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 15 } = req.query;
    const query = { role: 'customer' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Augment with order count and total spent
    const customersWithOrders = await Promise.all(
      users.map(async (u) => {
        const orderCount = await Order.countDocuments({ user: u._id });
        const spendAgg = await Order.aggregate([
          { $match: { user: u._id, orderStatus: { $ne: 'Cancelled' } } },
          { $group: { _id: null, totalSpent: { $sum: '$total' } } }
        ]);
        const totalSpent = spendAgg.length > 0 ? spendAgg[0].totalSpent : 0;

        return {
          ...u.toObject(),
          orderCount,
          totalSpent
        };
      })
    );

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      customers: customersWithOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer status (e.g. suspend / activate)
// @route   PATCH /api/admin/customers/:id/status
// @access  Admin
exports.updateCustomerStatus = async (req, res, next) => {
  try {
    const { accountStatus } = req.body;
    if (!['active', 'suspended'].includes(accountStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid account status' });
    }

    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (customer.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot change admin status' });
    }

    customer.accountStatus = accountStatus;
    await customer.save();

    res.status(200).json({
      success: true,
      message: `Customer account is now ${accountStatus}.`,
      customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Inventory Movements and stock report
// @route   GET /api/admin/inventory/movements
// @access  Admin
exports.getInventoryMovements = async (req, res, next) => {
  try {
    const movements = await InventoryMovement.find()
      .populate('product', 'name SKU images')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: movements.length,
      movements
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick adjust stock for product
// @route   POST /api/admin/inventory/adjust
// @access  Admin
exports.adjustStock = async (req, res, next) => {
  try {
    const { productId, quantity, note } = req.body;
    const qty = parseInt(quantity, 10);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const prevStock = product.stock;
    const newStock = Math.max(0, prevStock + qty);
    product.stock = newStock;
    await product.save();

    const movement = await InventoryMovement.create({
      product: product._id,
      movementType: qty >= 0 ? 'restock' : 'adjustment',
      quantity: qty,
      previousStock: prevStock,
      newStock: newStock,
      reference: note || 'Admin inventory adjustment',
      performedBy: req.user._id
    });

    res.status(200).json({
      success: true,
      message: `Stock updated to ${newStock} units.`,
      product: {
        _id: product._id,
        name: product.name,
        stock: product.stock
      },
      movement
    });
  } catch (error) {
    next(error);
  }
};
