/* eslint-disable no-console */
import logger from "./logger";

export default process
  .on("unhandledRejection", (reason, promise) => {
    const memoryUsage = process.memoryUsage();
    console.error("Unhandle rejection in promise:: ", {
      reason,
      promise,
      memoryUsage,
    });
    logger.error("Unhandle rejection in promise:: ", {
      reason,
      promise,
      memoryUsage,
    });
  })
  .on("uncaughtException", (err, origin) => {
    const memoryUsage = process.memoryUsage();
    console.error("Uncaught Exception thrown ", { err, origin, memoryUsage });
    logger.error("Uncaught Exception thrown ", { err, origin, memoryUsage });
  })
  .on("exit", (code) => {
    const memoryUsage = process.memoryUsage();
    console.error(`About to exit with code ${code}`, { memoryUsage });
    logger.error(`About to exit with code ${code}`, { memoryUsage });
  });
