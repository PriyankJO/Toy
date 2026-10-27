const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required']
    },
    shortDescription: {
      type: String,
      default: ''
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: [val => val.length > 0, 'Must have at least one image']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    brand: {
      type: String,
      default: 'ToyWonder Studio'
    },
    SKU: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive']
    },
    discountPrice: {
      type: Number,
      default: null,
      validate: {
        validator: function (val) {
          return val === null || val === undefined || val < this.price;
        },
        message: 'Discount price must be less than regular price'
      }
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 10
    },
    ageGroup: {
      type: String,
      enum: ['0-2 Years', '3-5 Years', '6-8 Years', '9-12 Years', '12+ Years', 'All Ages'],
      default: '3-5 Years'
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    isBestSeller: {
      type: Boolean,
      default: false
    },
    isNewArrival: {
      type: Boolean,
      default: false
    },
    safetyInfo: {
      type: String,
      default: '100% Non-Toxic, BPA-Free, Child-Safe Tested & Certified (EN71 & ASTM standard)'
    },
    specifications: {
      material: { type: String, default: 'Eco-friendly Plastic & Soft Cotton' },
      dimensions: { type: String, default: 'Standard' },
      weight: { type: String, default: '350g' },
      batteryRequired: { type: String, default: 'No' },
      origin: { type: String, default: 'India' }
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.discountPrice && this.price > 0) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
