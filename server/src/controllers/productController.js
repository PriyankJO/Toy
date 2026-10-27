const slugify = require('slugify');
const Product = require('../models/Product');
const Category = require('../models/Category');
const InventoryMovement = require('../models/InventoryMovement');

// @desc    Get all products with searching, filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      q,
      category,
      ageGroup,
      brand,
      minPrice,
      maxPrice,
      inStock,
      hasDiscount,
      featured,
      bestSeller,
      newArrival,
      sort,
      page = 1,
      limit = 12,
      all = 'false'
    } = req.query;

    const query = {};

    // For public catalog, only active products unless all=true (for admin)
    if (all !== 'true') {
      query.active = true;
    }

    // Text search
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category.toLowerCase() });
        if (cat) {
          query.category = cat._id;
        }
      }
    }

    // Age Group filter
    if (ageGroup) {
      if (Array.isArray(ageGroup)) {
        query.ageGroup = { $in: ageGroup };
      } else {
        query.ageGroup = ageGroup;
      }
    }

    // Brand filter
    if (brand) {
      query.brand = brand;
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') query.price.$lte = Number(maxPrice);
    }

    // Stock availability
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Discounts only
    if (hasDiscount === 'true') {
      query.discountPrice = { $ne: null, $gt: 0 };
    }

    // Special tags
    if (featured === 'true') query.featured = true;
    if (bestSeller === 'true') query.isBestSeller = true;
    if (newArrival === 'true') query.isNewArrival = true;

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1, reviewCount: -1 };
    else if (sort === 'popularity') sortOptions = { isBestSeller: -1, reviewCount: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug color iconName')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured, best-sellers, and special offers for homepage
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const featured = await Product.find({ active: true, featured: true })
      .populate('category', 'name slug')
      .limit(8);

    const bestSellers = await Product.find({ active: true, isBestSeller: true })
      .populate('category', 'name slug')
      .limit(8);

    const newArrivals = await Product.find({ active: true, isNewArrival: true })
      .populate('category', 'name slug')
      .limit(8);

    const specialOffers = await Product.find({
      active: true,
      discountPrice: { $ne: null, $gt: 0 }
    })
      .populate('category', 'name slug')
      .limit(8);

    res.status(200).json({
      success: true,
      data: {
        featured,
        bestSellers,
        newArrivals,
        specialOffers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by ID or Slug
// @route   GET /api/products/:idOrSlug
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let product;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug).populate('category', 'name slug color iconName');
    } else {
      product = await Product.findOne({ slug: idOrSlug.toLowerCase() }).populate(
        'category',
        'name slug color iconName'
      );
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Related products in the same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      active: true
    })
      .limit(4)
      .populate('category', 'name slug');

    res.status(200).json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Admin
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      shortDescription,
      images,
      category,
      brand,
      SKU,
      price,
      discountPrice,
      stock,
      ageGroup,
      featured,
      isBestSeller,
      isNewArrival,
      safetyInfo,
      specifications,
      active
    } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, and category are required.'
      });
    }

    const baseSlug = slugify(name, { lower: true, strict: true });
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    const productSKU = SKU ? SKU.toUpperCase() : `TW-${Date.now().toString().slice(-6)}`;

    const product = await Product.create({
      name,
      slug,
      description,
      shortDescription: shortDescription || description.slice(0, 140) + '...',
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80'],
      category,
      brand: brand || 'ToyWonder',
      SKU: productSKU,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: stock !== undefined ? Number(stock) : 10,
      ageGroup: ageGroup || '3-5 Years',
      featured: Boolean(featured),
      isBestSeller: Boolean(isBestSeller),
      isNewArrival: Boolean(isNewArrival),
      safetyInfo: safetyInfo || '100% Non-Toxic, BPA-Free, Child-Safe Tested',
      specifications: specifications || {},
      active: active !== undefined ? Boolean(active) : true
    });

    // Record initial inventory movement
    await InventoryMovement.create({
      product: product._id,
      movementType: 'initial_seed',
      quantity: product.stock,
      previousStock: 0,
      newStock: product.stock,
      reference: 'Initial product creation',
      performedBy: req.user._id
    });

    const populatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: populatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PATCH /api/products/:id
// @access  Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const oldStock = product.stock;
    const updates = { ...req.body };

    if (updates.name && updates.name !== product.name) {
      updates.slug = `${slugify(updates.name, { lower: true, strict: true })}-${Date.now().toString().slice(-4)}`;
    }

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.discountPrice !== undefined) {
      updates.discountPrice = updates.discountPrice ? Number(updates.discountPrice) : null;
    }
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug');

    // If stock quantity changed, log inventory adjustment
    if (updates.stock !== undefined && updates.stock !== oldStock) {
      const diff = updates.stock - oldStock;
      await InventoryMovement.create({
        product: product._id,
        movementType: 'adjustment',
        quantity: diff,
        previousStock: oldStock,
        newStock: updates.stock,
        reference: 'Manual admin stock adjustment',
        performedBy: req.user._id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
