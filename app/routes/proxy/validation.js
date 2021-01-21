import { GetValueFromRedis, SetValueToRedis } from "../../utils/redis";
import safeStringify from "fast-safe-stringify";
import logger from "../../utils/logger";
import { parseJson } from "../../utils/helpers";
import {
  MAX_WINDOW_IN_MS,
  MAX_WINDOW_REQUEST_COUNT,
} from "../../lib/constants";

const clientIdCustomValidation = async (clientId) => {
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

export { clientIdCustomValidation };
