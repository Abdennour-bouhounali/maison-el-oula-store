const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

// For development/testing, we can relax protection if needed, 
// but sticking to standard protected routes.
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;
