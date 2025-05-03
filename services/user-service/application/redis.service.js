
const { BadGatewayError } = require("../shared/cores/error.response");
const { getRedis } = require("../infratructure/redis");

class RedisService {
    static async createRedisBloomFilter(filterName, falsePositiveRate, capacity) {
        const redis = await getRedis();
        return await redis.call("BF.RESERVE", filterName, falsePositiveRate, capacity);
    }

    static async addElementToRedisBloomFilter(filterName, value, falsePositiveRate = 0.01, capacity = 1000) {
        const redis = await getRedis();
        const exist = await redis.exists(filterName); // Sửa "exist" thành "exists"
        if (!exist) {
            await this.createRedisBloomFilter(filterName, falsePositiveRate, capacity);
        }
        return await redis.call("BF.ADD", filterName, value);
    }

    static async checkElementExistInRedisBloomFilter(filterName, value) {
        const redis = await getRedis();
        return await redis.call("BF.EXISTS", filterName, value);
    }

    static async addMultiElementToRedisBloomFilter(filterName, Elements = []) {
        const redis = await getRedis();
        return redis.call("BF.MADD", filterName, ...Elements);
    }

    static async checkMultiElementExistInRedisBloomFilter(filterName, Elements = []) {
        const redis = await getRedis();
        return redis.call("BF.MEXISTS", filterName, ...Elements);
    }
}

module.exports = RedisService;