const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

router.get('/', authMiddleware, getCart);
router.post('/add', authMiddleware, addToCart);
router.delete('/remove/:id', authMiddleware, removeFromCart);

module.exports = router;
