import { GetValueFromRedis, SetValueToRedis } from "../../utils/redis";
import safeStringify from "fast-safe-stringify";
import logger from "../../utils/logger";
import { parseJson, timeInSec } from "../../utils/helpers";
import {
  MAX_WINDOW_IN_SECONDS,
  MAX_WINDOW_REQUEST_COUNT,
  WINDOW_LOG_INTERVAL_IN_SECONDS,
} from "../../lib/constants";
import { check, body } from "express-validator";

/* 
User can consume this API 50 times in a Minute
this method validates this case
*/
const clientIdRateLimitValidation = async (clientId) => {
  const redisResponse = await GetValueFromRedis(clientId);
  if (!redisResponse) {
    const setResponse = await SetValueToRedis(
      clientId,
      safeStringify([
        {
          requestCount: 1,
          requestTime: timeInSec(),
        },
      ]),
      MAX_WINDOW_IN_SECONDS
    );
    logger.info("Inserted New Value in Redis", { setResponse });
  } else {
    const parsedRedisResponse = parseJson(redisResponse);
    const currentTime = timeInSec();
    const windowStartTime = currentTime - MAX_WINDOW_IN_SECONDS;
    const requestsWithinWindow = parsedRedisResponse.filter(
      ({ requestTime }) => requestTime > windowStartTime
    );
    const totalWindowRequestCount = requestsWithinWindow.reduce(
      (acc, { requestCount }) => acc + requestCount,
      0
    );
    if (totalWindowRequestCount >= MAX_WINDOW_REQUEST_COUNT) {
      logger.info("Request Rejected -> ", {
        totalWindowRequestCount,
        MAX_WINDOW_REQUEST_COUNT,
        requestsWithinWindow,
      });
      return Promise.reject(
        `You have exceeded ${MAX_WINDOW_REQUEST_COUNT} requests in ${MAX_WINDOW_REQUEST_COUNT} min limit!`
      );
    } else {
      const lastRequestLog =
        parsedRedisResponse[parsedRedisResponse.length - 1];
      const intervalTime = currentTime - WINDOW_LOG_INTERVAL_IN_SECONDS;
      if (lastRequestLog.requestTime > intervalTime) {
        logger.info("Incrementing Last Request Log");
        lastRequestLog.requestCount += 1;
        parsedRedisResponse[parsedRedisResponse.length - 1] = lastRequestLog;
      } else {
        parsedRedisResponse.push({
          requestCount: 1,
          requestTime: timeInSec(),
        });
      }
      logger.info({
        totalWindowRequestCount,
        requestsWithinWindow,
        lastRequestLog,
      });
      const setResponse = await SetValueToRedis(
        clientId,
        safeStringify(parsedRedisResponse),
        MAX_WINDOW_IN_SECONDS
      );
      logger.info("Updated Existing Value in Redis -> ", {
        setResponse,
        setRequest: parsedRedisResponse,
      });
    }
  }
  return true;
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
