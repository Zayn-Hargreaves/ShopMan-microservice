const jwt = require('jsonwebtoken');
const { NOTACCEPTABLE, UnauthorizedError } = require('../cores/error.response');
const RedisService = require("../../application/redis.service")
const authenticateToken = async (req, res, next) => {
    const authorization = req.headers['authorization'];

    let accessToken

    if (authorization) {
        accessToken = authorization.split(' ')[1];
    }

    const refreshtoken = req.headers['x-rtoken-id'];
    if (!accessToken && !refreshtoken) {
        throw new UnauthorizedError('invalid request');
    }
    if (refreshtoken) {
        try {
            const { userId, jti } = jwt.verify(refreshtoken, refreshSecretKey);
            const exists = await RedisService.checkElementExistInRedisBloomFilter("blacklist_token", jti)
            if (exists) throw new UnauthorizedError("invalid request")
            req.userId = userId
            return next();
        } catch (error) {
            console.log(error)
            throw new UnauthorizedError('invalid request::', error);
        }
    }

    if (accessToken) {
        try {
            const { userId, jti } = jwt.verify(accessToken, accessSecretKey);
            req.userId = userId
            if (!userId) {
                throw new UnauthorizedError('invalid request');
            }
            return next();
        } catch (error) {
            throw new UnauthorizedError('invalid request::', error);
        }
    }
}

module.exports = authenticateToken;
