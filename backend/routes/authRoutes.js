const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateMembership } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile);
router.put('/membership', authMiddleware, updateMembership);

module.exports = router;
