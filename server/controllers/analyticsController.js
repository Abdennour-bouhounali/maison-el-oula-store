const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get dashboard stats
// @route   GET /api/analytics/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const productsCount = await Product.countDocuments();
  const ordersCount = await Order.countDocuments();
  const usersCount = await User.countDocuments();
  
  const revenue = await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);

  const totalRevenue = revenue.length > 0 ? revenue[0].total : 0;

  // Monthly revenue for the last 6 months
  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        status: { $ne: 'Cancelled' },
        createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$totalPrice' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  // Order status distribution
  const statusStats = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // Low stock products
  const lowStockProducts = await Product.find({ countInStock: { $lte: 5 } })
    .select('name countInStock price images')
    .limit(5);

  // Top Selling Products (simplified - based on appearances in orders)
  const topProducts = await Order.aggregate([
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        name: { $first: '$orderItems.name' },
        image: { $first: '$orderItems.image' },
        totalSold: { $sum: '$orderItems.qty' },
        totalRevenue: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 }
  ]);

  res.json({
    success: true,
    data: {
      counts: {
        products: productsCount,
        orders: ordersCount,
        users: usersCount,
        revenue: totalRevenue
      },
      monthlyRevenue,
      statusStats,
      lowStockProducts,
      topProducts
    }
  });
});

module.exports = {
  getDashboardStats,
};
