import Redis from "ioredis";

// In-memory fallback map if Redis is not running locally
const memoryStore = new Map();

let redis = null;
let isRedisConnected = false;

try {
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    redis = new Redis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
    });
    redis
      .connect()
      .then(() => {
        isRedisConnected = true;
        console.log("Connected to Redis cache");
      })
      .catch(() => {
        isRedisConnected = false;
      });
    redis.on("error", () => {
      isRedisConnected = false;
    });
  }
} catch {
  isRedisConnected = false;
}

// Cache-Aside helper: Read
export const getCache = async (key) => {
  try {
    if (isRedisConnected && redis) {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    }
  } catch (error) {
    // fall through to memoryStore
  }
  const item = memoryStore.get(key);
  if (item && item.expiry > Date.now()) {
    return item.value;
  }
  if (item) memoryStore.delete(key);
  return null;
};

// Cache-Aside helper: Write with TTL
export const setCache = async (key, value, ttlSeconds = 300) => {
  try {
    if (isRedisConnected && redis) {
      await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
      return;
    }
  } catch (error) {
    // fall through to memoryStore
  }
  memoryStore.set(key, { value, expiry: Date.now() + ttlSeconds * 1000 });
};

// Invalidation helper: Clears cache keys matching prefix on admin updates
export const clearCachePattern = async (patternPrefix = "") => {
  try {
    if (isRedisConnected && redis) {
      const keys = await redis.keys(`${patternPrefix}*`);
      if (keys.length > 0) await redis.del(...keys);
    }
  } catch (error) {
    // ignore
  }
  for (const key of memoryStore.keys()) {
    if (!patternPrefix || key.startsWith(patternPrefix)) {
      memoryStore.delete(key);
    }
  }
};

