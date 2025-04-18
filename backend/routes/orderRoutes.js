const express = require('express');
const {
    createOrder,
    getOrdersByPhone
} = require('../controllers/orderController');

const router = express.Router();

router.route('/')
    .post(createOrder); // Place a new order

router.route('/:phone') // Route parameter for phone number
    .get(getOrdersByPhone); // Get orders by phone

module.exports = router;