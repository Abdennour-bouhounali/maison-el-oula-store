const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/api/', registerUser);
router.post('/api/login', authUser);
router.route('/api/profile').get(protect, getUserProfile);

module.exports = router;
