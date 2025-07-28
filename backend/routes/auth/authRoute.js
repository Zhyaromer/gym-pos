const express = require('express');
const router = express.Router();
const login = require('../../controllers/auth/login');
const logout = require('../../controllers/auth/logout');
const verify = require('../../controllers/auth/verify');
const getLoginHistory = require('../../controllers/auth/getLoginHistory');
const authenticateToken = require('../../middleware/authMiddleware');

// Public routes
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/verify', authenticateToken, verify);
router.get('/login-history', authenticateToken, getLoginHistory);

module.exports = router; 