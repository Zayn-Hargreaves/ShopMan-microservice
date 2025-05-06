const express = require('express');
const router = express.Router();
const orderClient = require('../grpc/order/order.client');
const authenticateToken = require('../../shared/middleware/auth');

// Đặt hàng từ giỏ
router.post('/from-cart',authenticateToken, (req, res) => {
    const userId = req.userId
    const items = req.body.items
    orderClient.FromCart({userId:String(userId), items}, (err, response) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(response);
    });
});

// Mua ngay
router.post('/buy-now',authenticateToken,(req, res) => {
    const userId = req.userId
    const payload = { ...req.body, userId }
    orderClient.BuyNow(payload, (err, response) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(response);
    });
});

// Xác nhận đơn hàng
router.post('/confirm', (req, res) => {
    const userId = req.userId
    const payload = { ...req.body, userId }
    orderClient.Confirm(payload, (err, response) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(response);
    });
});

module.exports = router;