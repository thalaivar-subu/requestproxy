import { GetValueFromRedis, SetValueToRedis } from "../../utils/redis";
import safeStringify from "fast-safe-stringify";
import logger from "../../utils/logger";
import { parseJson } from "../../utils/helpers";
import {
  MAX_WINDOW_IN_MS,
  MAX_WINDOW_REQUEST_COUNT,
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
          requestTime: new Date(),
        },
      ])
    );
    logger.info({ setResponse });
  } else {
    const parsedRedisResponse = parseJson(redisResponse);
    logger.info({ parsedRedisResponse });
    const currentTime = new Date();
    const windowStartTime = new Date(currentTime - MAX_WINDOW_IN_MS);
    const requestsWithinWindow = parsedRedisResponse.filter(
      ({ requestTime }) => new Date(requestTime) >= windowStartTime
    );
    logger.info({ requestsWithinWindow });
    const totalWindowRequestCount = requestsWithinWindow.reduce(
      (acc, { requestCount }) => acc + requestCount,
      0
    );
    logger.info({ totalWindowRequestCount });
    if (totalWindowRequestCount >= MAX_WINDOW_REQUEST_COUNT) {
      return Promise.reject(
        `You have exceeded ${MAX_WINDOW_REQUEST_COUNT} requests in ${
          MAX_WINDOW_IN_MS / 60000
        } min limit!`
      );
    } else {
      const lastRequestLog = parsedRedisResponse.pop();
      if (new Date(lastRequestLog.requestTime) >= windowStartTime) {
        lastRequestLog.requestCount += 1;
        parsedRedisResponse.push(lastRequestLog);
      } else {
        parsedRedisResponse.push({
          requestCount: 1,
          requestTime: new Date(),
        });
      }
      logger.info({ parsedRedisResponse });
      const setResponse = await SetValueToRedis(
        clientId,
        safeStringify(parsedRedisResponse)
      );
      logger.info({ setResponse });
    }
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
