const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true
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
      default: ''
    },
    image: {
      type: String,
      required: [true, 'Category image URL is required']
    },
    iconName: {
      type: String,
      default: 'Sparkles'
    },
    color: {
      type: String,
      default: '#7657E8'
    },
    itemCount: {
      type: Number,
      default: 0
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

module.exports = mongoose.model('Category', categorySchema);
