const Redis = require("ioredis");
const config = require("../../config/default");
const { InternalServerError } = require("../../shared/cores/error.response");
const REDIS_CONFIG = {
  singleNode: {
    url: config.redis.url || "redis://localhost:6379", // URL mặc định nếu không có config
    port: config.redis.port,
    host: config.redis.host,
    username: config.redis.username,
    password: config.redis.password,
    db: config.redis.db
  },
  clusterNodes: [],
  options: {
    maxRetriesPerRequest: 10,
    retryStrategy: (times) => {
      const delay = Math.min(times * 1000, 10000);
      console.log(`Retrying Redis connection, attempt #${times}, delay: ${delay}ms`);
      return delay;
    },
    reconnectOnError: (err) => {
      const targetErrors = ["READONLY", "ECONNRESET"];
      return targetErrors.some((e) => err.message.includes(e));
    },
    connectTimeout: 15000
  },
  timeout: 30000
};

class RedisManager {
  constructor() {
    this.client = null;
    this.isClusterMode = false;
  }

  async initializeRedis() {
    try {
      let connectionOptions = { ...REDIS_CONFIG.options };
      // Ưu tiên dùng URL
      if (REDIS_CONFIG.singleNode.url) {
        this.client = new Redis(REDIS_CONFIG.singleNode.url, connectionOptions);
        console.log(`Initializing Redis with URL successfully`);
      } else {
        throw new Error("No Redis URL provided in configuration");
      }

      if (this.isClusterMode && REDIS_CONFIG.clusterNodes.length > 0) {
        this.client = new Redis.Cluster(REDIS_CONFIG.clusterNodes, {
          redisOptions: connectionOptions,
          clusterRetryStrategy: REDIS_CONFIG.options.retryStrategy
        });
        console.log("Initializing Redis in Cluster mode...");
      } else {
        console.log("Initializing Redis in Single mode...");
      }

      this.attachEventHandlers();
      await this.waitForConnection();
      console.log("Redis connected successfully");
    } catch (error) {
      console.error("Redis initialization failed:", error.message);
      throw new InternalServerError(`Failed to initialize Redis connection: ${error.message}`);
    }
  }

  attachEventHandlers() {
    this.client.on("connect", () => {
      console.log("Redis - Connection status: connected");
    });

    this.client.on("ready", () => {
      console.log("Redis - Connection status: ready");
    });

    this.client.on("error", (err) => {
      console.error("Redis - Connection status: error -", err.message);
    });

    this.client.on("reconnecting", () => {
      console.log("Redis - Connection status: reconnecting");
    });

    this.client.on("end", () => {
      console.log("Redis - Connection status: end");
    });
  }

  async waitForConnection() {
    return new Promise((resolve, reject) => {
      if (this.client.status === "ready") {
        return resolve();
      }

      this.client.once("ready", () => resolve());

      setTimeout(() => {
        if (this.client.status !== "ready") {
          reject(new Error(`Redis connection timeout after ${REDIS_CONFIG.timeout}ms`));
        }
      }, REDIS_CONFIG.timeout);
    });
  }

  getClient() {
    if (!this.client || this.client.status === "end") {
      throw new InternalServerError("Redis client not available");
    }
    return this.client;
  }

  async close() {
    if (this.client) {
      await this.client.quit();
      console.log("Redis connection closed gracefully");
      this.client = null;
    }
  }

  static async getInstance() {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
      await RedisManager.instance.initializeRedis();
    }
    return RedisManager.instance;
  }
}

const redisManager = RedisManager.getInstance();

module.exports = {
  initRedis: async () => {
    await redisManager;
    return redisManager;
  },
  getRedis: async () => (await redisManager).getClient(),
  closeRedis: async () => (await redisManager).close()
};