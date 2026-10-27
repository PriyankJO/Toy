const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update review for product
// @route   POST /api/reviews/product/:productId
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required.'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user bought product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      orderStatus: { $in: ['Delivered', 'Shipped', 'Confirmed'] }
    });

    let review = await Review.findOne({ user: req.user._id, product: productId });

    if (review) {
      review.rating = Number(rating);
      review.comment = comment;
      review.verifiedPurchase = Boolean(hasPurchased);
      await review.save();
    } else {
      review = await Review.create({
        user: req.user._id,
        product: productId,
        rating: Number(rating),
        comment,
        verifiedPurchase: Boolean(hasPurchased)
      });
    }

    // Recalculate product rating
    const allReviews = await Review.find({ product: productId });
    const avgRating = (
      allReviews.reduce((sum, item) => sum + item.rating, 0) / allReviews.length
    ).toFixed(1);

    product.rating = Number(avgRating);
    product.reviewCount = allReviews.length;
    await product.save();

    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been saved.',
      review,
      productRating: product.rating,
      productReviewCount: product.reviewCount
    });
  } catch (error) {
    next(error);
  }
};
