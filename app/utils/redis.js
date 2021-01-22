import logger from "./logger";
import redis from "redis";
import bluebird from "bluebird";
import { REDIS_CONFIG } from "../lib/constants";

// Promisifying Redis with Bluebird
bluebird.promisifyAll(redis);

let RedisClient;

// Initialize Redis on Application Startup
const InitRedis = () => {
  const { host, port, db } = REDIS_CONFIG;
  RedisClient = redis.createClient(port, host, {
    db,
  });
  if (!RedisClient) {
    logger.error("Redis client does not exist!");
    process.exit(1);
  }
  RedisClient.on("connect", function () {
    logger.info("Redis client connected");
  });
  RedisClient.on("error", function (err) {
    logger.error("Error in Redis Client", err);
  });
};

// Pass Keys - returns value from redis if exists
const GetValueFromRedis = async (key) => {
  let result;
  try {
    result = await RedisClient.getAsync(key);
  } catch (error) {
    logger.error("Error while getting values from redis -> ", error);
  }
  return result;
};

// Pass key and value - sets in Redis
const SetValueToRedis = async (key, data, expiration) => {
  let result;
  try {
    if (expiration > 0)
      result = await RedisClient.setexAsync(key, expiration, data);
    else result = await RedisClient.setAsync(key, data);
  } catch (error) {
    logger.error("Error while setting values from redis ->", error);
  }
  return result;
};

export { InitRedis, GetValueFromRedis, SetValueToRedis };
