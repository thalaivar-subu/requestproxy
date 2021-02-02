import { GetValueFromRedis, SetValueToRedis } from "../../utils/redis";
import safeStringify from "fast-safe-stringify";
import logger from "../../utils/logger";
import { parseJson, timeInSec } from "../../utils/helpers";
import {
  MAX_WINDOW_IN_SECONDS,
  MAX_WINDOW_REQUEST_COUNT,
} from "../../lib/constants";
import { check, body } from "express-validator";
import { Mutex } from "async-mutex";

const Lock = new Mutex();

/* 
User can consume this API 50 times in a Minute
this method validates this case
*/
const clientIdRateLimitValidation = async (clientId) => {
  const release = await Lock.acquire();
  try {
    const redisResponse = await GetValueFromRedis(clientId);
    const currentTime = timeInSec();
    if (!redisResponse) {
      const setResponse = await SetValueToRedis(
        clientId,
        safeStringify({
          requestCount: MAX_WINDOW_REQUEST_COUNT,
          lastRequestTime: currentTime,
        })
      );
      logger.info("Inserted New Value in Redis", { setResponse });
    } else {
      const parsedRedisResponse = parseJson(redisResponse);
      if (parsedRedisResponse.requestCount <= 1) {
        // If Window has expired - Reset Requests
        console.info({
          currentTime,
          lastRequestTime: parsedRedisResponse.lastRequestTime,
          difference: currentTime - parsedRedisResponse.lastRequestTime,
        });
        if (
          currentTime - parsedRedisResponse.lastRequestTime >
          MAX_WINDOW_IN_SECONDS
        ) {
          const setResponse = await SetValueToRedis(
            clientId,
            safeStringify({
              requestCount: MAX_WINDOW_REQUEST_COUNT,
              lastRequestTime: currentTime,
            })
          );
          logger.info("Reseting Existing Redis Value -> ", { setResponse });
        }
        return Promise.reject(
          `You have exceeded ${MAX_WINDOW_REQUEST_COUNT} requests in ${MAX_WINDOW_REQUEST_COUNT} min limit!`
        );
      } else {
        const setResponse = await SetValueToRedis(
          clientId,
          safeStringify({
            requestCount: parsedRedisResponse.requestCount - 1,
            lastRequestTime: currentTime,
          })
        );
        logger.info("Updated Existing Redis Value -> ", { setResponse });
      }
    }
  } catch (error) {
    logger.error("Error in clientIdCustomValidation -> ", error);
  } finally {
    release();
  }
};

// Input Validation /proxy API
const ProxyValidation = [
  check("clientId").isNumeric().withMessage("Must Be a Valid Number"),
  check("url")
    .isURL({ protocols: ["https"] })
    .withMessage("Must Be a Valid Https Url"),
  check("headers").optional().isJSON().withMessage("Must Be a valid JSON"),
  check("requestType").isString().withMessage("Must Be a Valid String"),
  check("requestBody")
    .optional()
    .isString()
    .withMessage("Must Be a Valid String"),
  body("clientId").custom(clientIdRateLimitValidation),
];

export default ProxyValidation;
