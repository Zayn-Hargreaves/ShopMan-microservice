
const { BadGatewayError } = require("../cores/error.response");
const { getRedis } = require("../infratructure/redis/client");

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

  static async setStringEx(key, value, expireTime = 60 * 60 * 24) {
    const redis = await getRedis();
    return redis.set(key, value, "EX", expireTime);
  }

  static async upsertItemIntoZset(key, member, score, ttl) {
    const redis = await getRedis()
    try {
      await redis.zincrby(key, score, member)

      if (ttl && Number.isInteger(ttl) && ttl > 0) {
        await redis.expire(key, ttl)
      }
      return true
    } catch (error) {
      throw new BadGatewayError(`Error upserting item into ZSET ${key}:`, error)
    }
  }
  static async getZsetRange(key, start, end = -1, withScores = true) {
    const redis = await getRedis()
    try {
      return await redis.zrevrange(key, start, end, withScores ? "WITHSCORES" : '"')
    } catch (error) {
      throw new BadGatewayError(`Error getting ZSET range ${key}:`, error)
    }
  }
  static async getZsetScore(key, member) {
    const redis = await getRedis()
    try {
      return await redis.zscore(key, member)
    } catch (error) {
      throw new BadGatewayError(`Error getting score for ${member} in ZSET ${key}:`, error)
    }
  }
  static async removeZsetItem(key, member) {
    const redis = await getRedis()
    try {
      return await redis.zrem(key, member)
    } catch (error) {
      throw new BadGatewayError(`Error removing ${member} from ZSET ${key}:`, error)
    }
  }
  static async getZsetCount(zsetkey) {
    const redis = await getRedis()
    try {
      return await redis.zcard(zsetkey)
    } catch (error) {
      throw new BadGatewayError(`Error counting elements in ZSET ${zsetkey}:`, error)
    }
  }
  static async cacheData(key, value, ttl = 3600) {
    const redis = await getRedis()
    try {
      const serializedValue = JSON.stringify(value)
      return await redis.set(key, serializedValue, "EX", ttl)
    } catch (error) {
      throw new BadGatewayError(`Error caching data for key ${key}:`, error)
    }
  }
  static async getCachedData(key) {
    const redis = await getRedis()
    const data = await redis.get(key)
    return JSON.parse(data)
  }
  static async setTrendingScore(zsetkey, productId, score, ttl = null) {
    const redis = await getRedis()
    try {
      await redis.zadd(zsetkey, score, `product:${productId}`)
      if (ttl && Number.isInteger(ttl) && ttl > 0) {
        const exist = await redis.exists(zsetkey)
        if (!exist) {
          await redis.expire(zsetkey, ttl)
        }
      }
      return true
    } catch (error) {
      console.log(error)
      throw new BadGatewayError(`Error setting trending score for ${productId} in ZSET ${zsetkey}:`, error)
    }
  }
  static async cacheHashField(hashKey, field, value, ttl = 3600) {
    const redis = await getRedis()
    await redis.hset(hashKey, field, JSON.stringify(value))
    await redis.expire(hashKey, ttl)
  }
  static async getAllHashField(hashKey) {
    const redis = await getRedis()
    const rawData = await redis.hgetall(hashKey)
    const dataParsed = Object.entries(rawData).map(([field, val]) => ({
      field,
      ...JSON.parse(val)
    }))
    return dataParsed
  }
  static async getHashField(hashKey, field) {
    const redis = await getRedis();
    const val = await redis.hget(hashKey, field);
    return val ? JSON.parse(val) : null;
  }
  static async removeHashField(hashKey, field) {
    const redis = await getRedis();
    return await redis.hdel(hashKey, field);
  }

  static async acquireLock({ productID, cartID, quantity, timeout = 10 }) {
    const redis = await getRedis();
    const lockKey = `lock:product:${productID}:cart:${cartID}`;
    const token = uuidv4(); // Tạo token duy nhất cho khóa

    try {
      // Thử tạo khóa với NX (chỉ tạo nếu chưa tồn tại) và EX (hết hạn sau timeout giây)
      const result = await redis.set(lockKey, token, "NX", "EX", timeout);

      if (result === "OK") {
        // Khóa được tạo thành công, trả về token để sử dụng khi giải phóng
        return { key: lockKey, token };
      } else {
        // Không tạo được khóa (đã có client khác giữ khóa)
        return null;
      }
    } catch (error) {
      throw new BadGatewayError(`Error acquiring lock for product ${productID}: ${error.message}`);
    }
  }

  static async releaseLock({ key, token }) {
    const redis = await getRedis();

    try {
      // Kiểm tra token trước khi xóa khóa (đảm bảo chỉ xóa khóa của client đã tạo)
      const currentToken = await redis.get(key);
      if (currentToken !== token) {
        return false; // Không phải khóa của client này, không xóa
      }

      // Xóa khóa
      const result = await redis.del(key);
      return result === 1; // Trả về true nếu xóa thành công
    } catch (error) {
      throw new BadGatewayError(`Error releasing lock for key ${key}: ${error.message}`);
    }
  }
}

module.exports = RedisService;