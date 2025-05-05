const express = require('express');
const router = express.Router();
const cartClient = require('../grpc/cart/cart.client');

// Lấy giỏ hàng của user
router.get('/', (req, res) => {
    const userId = req.userId;
    cartClient.GetCart({ userId }, (err, response) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(response.items);
    });
});

// Thêm sản phẩm vào giỏ hàng
router.post('/add', (req, res) => {
    const userId = req.userId
    const { item } = req.body;
    cartClient.AddToCart({ userId, item }, (err, response) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(response);
    });
});

// Cập nhật sản phẩm trong giỏ hàng
router.post('/update', (req, res) => {
    const { userId, item } = req.body;
    cartClient.UpdateCartItem({ userId, item }, (err, response) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(response);
    });
});

module.exports = router;