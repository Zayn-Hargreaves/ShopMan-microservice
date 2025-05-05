// interfaces/rest/index.routes.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authenticateToken = require('../../shared/middleware/auth');
const cache = require('../../shared/middleware/cache');
const productGrpcClient = require('../grpc/product.client');
const orderGrpcClient = require('../grpc/order.client');

module.exports = function (app) {
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

  /**
   * ✅ Route đặc biệt: REST → gRPC
   * GET /api/products/:id → gọi gRPC GetProduct + emit Kafka
   */
  router.get('/products/:id', authenticateToken, (req, res) => {
    const productId = req.params.id;

    productGrpcClient.GetProduct({ id: productId }, async (err, response) => {
      if (err) {
        console.error('[gRPC Error]', err.message);
        return res.status(500).json({ message: 'gRPC error', error: err.message });
      }

      try {
        await emitUserEvent('ProductViewed', {
          userId: req.user?.id || 'anonymous',
          productId,
          viewedAt: new Date().toISOString(),
          requestId: req.requestId,
        });
      } catch (e) {
        console.warn('[Kafka Emit Failed]', e.message);
      }

      res.json(response);
    });
  });

  app.use('/api', router);
};
