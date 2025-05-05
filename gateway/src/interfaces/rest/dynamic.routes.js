// interfaces/rest/dynamic.routes.js
const { createProxyMiddleware } = require('http-proxy-middleware');
const authenticateToken = require('../../shared/middleware/auth');
const cache = require('../../shared/middleware/cache');
const routeConfig = require('../../config/route.config.json');

module.exports = function (app) {
    routeConfig.forEach((route) => {
        const middlewares = [];

        if (route.auth) middlewares.push(authenticateToken);
        if (route.cache) middlewares.push(cache(route.prefix));

        middlewares.push(
            createProxyMiddleware({
                target: route.target,
                changeOrigin: true,
                pathRewrite: { '^/api': '' },
                onProxyReq: (proxyReq, req, res) => {
                    if (req.user) {
                        proxyReq.setHeader('x-user-id', req.userId);
                    }
                }
            })
        )

        app.use(route.prefix, ...middlewares);
        console.log(`✅ Route mounted: ${route.prefix} → ${route.target}`);
    });
};
