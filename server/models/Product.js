const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Multilingual Name
    name: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    // SEO Slug
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    // Multilingual Description
    description: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    // Multiple Images
    images: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'out_of_stock'],
      default: 'active',
    },
    weight: {
      type: String,
      default: '50g',
    },
    ingredients: {
      fr: [String],
      en: [String],
      ar: [String],
    },
    usage: {
      fr: { type: String },
      en: { type: String },
      ar: { type: String },
    },
    benefits: {
      fr: [String],
      en: [String],
      ar: [String],
    },
    badges: [String], // e.g., ['100% Naturel', 'Zéro Additif']
    nutrition_table: {
      calories: { type: String },
      fat: { type: String },
      protein: { type: String },
      carbs: { type: String },
      fiber: { type: String },
    },
    seo_title: {
      type: String,
    },
    seo_description: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to generate slug before validation if not provided (optional)
// For simplicity, we'll assume the admin provides the slug or we generate it in the controller.

module.exports = mongoose.model('Product', productSchema);
