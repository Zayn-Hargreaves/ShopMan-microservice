const express = require('express');
const orderGrpcClient = require('../grpc/order.client');
const router = express.Router();

router.post('/order/fromCart', (req, res) => {
    const { userId, items } = req.body;

    orderGrpcClient.FromCart({ userId, items }, (err, response) => {
        if (err) {
            console.error('gRPC Error:', err.message);
            return res.status(500).json({ error: err.message });
        }

        res.json(response);
    });
});

module.exports = router;