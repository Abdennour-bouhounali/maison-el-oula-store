const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Fetch single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const query = id.match(/^[0-9a-fA-F]{24}$/) 
    ? { _id: id } 
    : { slug: id };

  const product = await Product.findOne(query);

  if (product) {
    res.json({ success: true, data: product });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { 
    name, slug, description, category, price, countInStock, 
    status, weight, ingredients, usage, benefits, badges,
    nutrition_table, seo_title, seo_description, images
  } = req.body;

  const product = new Product({
    user: req.user._id,
    name,
    slug,
    description,
    images: images || [],
    category,
    price,
    countInStock,
    status,
    weight,
    ingredients,
    usage,
    benefits,
    badges,
    nutrition_table,
    seo_title,
    seo_description
  });

  const createdProduct = await product.save();
  res.status(201).json({ success: true, data: createdProduct });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { 
    name, slug, description, category, price, countInStock, 
    status, weight, ingredients, usage, benefits, badges, 
    images, nutrition_table, seo_title, seo_description
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.slug = slug || product.slug;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price || product.price;
    product.countInStock = countInStock || product.countInStock;
    product.status = status || product.status;
    product.weight = weight || product.weight;
    product.ingredients = ingredients || product.ingredients;
    product.usage = usage || product.usage;
    product.benefits = benefits || product.benefits;
    product.badges = badges || product.badges;
    product.images = images || product.images;
    product.nutrition_table = nutrition_table || product.nutrition_table;
    product.seo_title = seo_title || product.seo_title;
    product.seo_description = seo_description || product.seo_description;

    const updatedProduct = await product.save();
    res.json({ success: true, data: updatedProduct });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ success: true, message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
