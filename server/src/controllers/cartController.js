const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to recalculate cart summary from fresh product data in database
const populateAndCalculateCart = async (cart) => {
  await cart.populate({
    path: 'items.product',
    select: 'name slug price discountPrice images stock active SKU category'
  });

  // Filter out any deleted products
  cart.items = cart.items.filter(item => item.product && item.product.active);

  let subtotal = 0;
  let totalItems = 0;

  const items = cart.items.map(item => {
    const product = item.product;
    const effectivePrice = product.discountPrice ? product.discountPrice : product.price;
    const itemTotal = effectivePrice * item.quantity;
    subtotal += itemTotal;
    totalItems += item.quantity;

    return {
      _id: item._id,
      product: {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discountPrice,
        effectivePrice,
        image: product.images[0],
        stock: product.stock,
        SKU: product.SKU
      },
      quantity: item.quantity,
      itemTotal
    };
  });

  const shippingFee = subtotal > 499 || subtotal === 0 ? 0 : 50; // Free delivery over ₹499
  const total = subtotal + shippingFee;

  return {
    items,
    totalItems,
    subtotal,
    shippingFee,
    total
  };
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const calculatedCart = await populateAndCalculateCart(cart);

    res.status(200).json({
      success: true,
      cart: calculatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const qty = parseInt(quantity, 10);

    if (!productId || qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid product and quantity (at least 1) are required.'
      });
    }

    const product = await Product.findById(productId);
    if (!product || !product.active) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable.'
      });
    }

    if (product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items in stock.`
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newTotalQty = cart.items[existingItemIndex].quantity + qty;
      if (newTotalQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. You already have ${cart.items[existingItemIndex].quantity} in cart, and available stock is ${product.stock}.`
        });
      }
      cart.items[existingItemIndex].quantity = newTotalQty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    const calculatedCart = await populateAndCalculateCart(cart);

    res.status(200).json({
      success: true,
      message: `${product.name} added to cart!`,
      cart: calculatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PATCH /api/cart/items/:itemId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const qty = parseInt(quantity, 10);

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    if (qty <= 0) {
      // Remove item
      cart.items.pull(itemId);
    } else {
      const product = await Product.findById(item.product);
      if (!product) {
        cart.items.pull(itemId);
      } else if (qty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot increase quantity. Available stock is ${product.stock}.`
        });
      } else {
        item.quantity = qty;
      }
    }

    await cart.save();
    const calculatedCart = await populateAndCalculateCart(cart);

    res.status(200).json({
      success: true,
      cart: calculatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove single item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.pull(itemId);
    await cart.save();

    const calculatedCart = await populateAndCalculateCart(cart);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: calculatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart: { items: [], totalItems: 0, subtotal: 0, shippingFee: 0, total: 0 }
    });
  } catch (error) {
    next(error);
  }
};
