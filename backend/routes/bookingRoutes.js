const express = require('express');
const router = express.Router();
const { bookClass, getUserBookings } = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, bookClass);
router.get('/', auth, getUserBookings);

module.exports = router;
