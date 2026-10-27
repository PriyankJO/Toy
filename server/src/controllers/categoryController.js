const slugify = require('slugify');
const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { active: true };
    const categories = await Category.find(filter).sort({ name: 1 });

    // Populate actual live product counts
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id, active: true });
        return {
          ...cat.toObject(),
          itemCount: count
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug or ID
// @route   GET /api/categories/:idOrSlug
// @access  Public
exports.getCategory = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let category;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(idOrSlug);
    } else {
      category = await Category.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Admin
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, image, iconName, color, active } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        success: false,
        message: 'Category name and image are required.'
      });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists.'
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      iconName: iconName || 'Sparkles',
      color: color || '#7657E8',
      active: active !== undefined ? active : true
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PATCH /api/categories/:id
// @access  Admin
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, iconName, color, active } = req.body;
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true });
    }
    if (description !== undefined) category.description = description;
    if (image) category.image = image;
    if (iconName) category.iconName = iconName;
    if (color) category.color = color;
    if (active !== undefined) category.active = active;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${productCount} products are still linked to it.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
