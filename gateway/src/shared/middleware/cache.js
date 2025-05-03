// shared/middleware/cache.js
const redis = require('../../infratructure/redis/client');

function cache(keyPrefix, ttlSeconds = 60) {
    return async (req, res, next) => {
        const key = `${keyPrefix}:${req.originalUrl}`;

        const cached = await redis.get(key);
        if (cached) {
            console.log(`⚡ Cache hit: ${key}`);
            return res.status(200).json(JSON.parse(cached));
        }

        // Monkey patch res.send to cache the response
        const originalSend = res.json.bind(res);
        res.json = (body) => {
            redis.setex(key, ttlSeconds, JSON.stringify(body));
            return originalSend(body);
        };

        next();
    };
}

module.exports = cache;
