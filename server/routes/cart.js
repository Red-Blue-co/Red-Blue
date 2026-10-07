const { use } = require('sv-nex')
const express = require('express');
const cart = require('../controllers/cart.controllers')
const router = express.Router();

router.get('/get', use(cart.getCart_controller));
router.post('/add', use(cart.addToCart_controller));
router.post('/set', use(cart.setCartQty_controller));
router.post('/checkout', use(cart.checkout_controller));
router.get('/orders', use(cart.getOrders_controller));

module.exports = {
    router
}
