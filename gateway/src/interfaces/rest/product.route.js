const express = require('express');
const router = express.Router();
const productClient = require('../grpc/product/product.client');

router.get('/', (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10
    productClient.GetPaginatedProducts({page, limit}, (err, response) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(response.products);
    });
});

router.get('/detail/:slug', (req, res) => {
    productClient.GetProductBySlug({ slug: req.params.slug }, (err, product) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(product);
    });
});

module.exports = router;