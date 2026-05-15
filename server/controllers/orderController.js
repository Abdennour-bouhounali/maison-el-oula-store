const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Guest Checkout supported)
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ success: false, message: 'No order items' });
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user ? req.user._id : null,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json({ success: true, data: createdOrder });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json({ success: true, data: order });
  } else {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status || order.status;
    order.trackingNumber = trackingNumber || order.trackingNumber;

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json({ success: true, data: updatedOrder });
  } else {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json({ success: true, data: updatedOrder });
  } else {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public (for testing)
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Track order (Public)
// @route   GET /api/orders/track/:id
// @access  Public
const trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .select('status orderItems shippingAddress trackingNumber createdAt updatedAt isDelivered deliveredAt');

  if (order) {
    res.json({ success: true, data: order });
  } else {
    // Try by tracking number if ID fails
    const orderByName = await Order.findOne({ trackingNumber: req.params.id })
      .select('status orderItems shippingAddress trackingNumber createdAt updatedAt isDelivered deliveredAt');
    
    if (orderByName) {
      res.json({ success: true, data: orderByName });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  }
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderStatus,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  trackOrder,
};
