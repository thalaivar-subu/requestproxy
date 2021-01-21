import {
  LOGPATH,
  NODE_ENV,
  LOG_FILE_NAME,
  APP_NAME,
  LOCAL_ENVS,
} from "../lib/constants";
import { transports, format, createLogger } from "winston";
import { mkdirSync, existsSync } from "fs";
import { get } from "express-http-context";
import safeStringify from "fast-safe-stringify";

const { printf, combine, timestamp, label } = format;

// Our Custom Format of Logging
const logCustomFormat = printf(
  ({ level, message, label, timestamp, stack, ...info }) => {
    const reqId = get("reqId");
    const requestBody = get("requestBody");
    let logContent = { timestamp, label, message, reqId, requestBody, info };
    if (level === "error") {
      logContent = { ...logContent, requestBody, stack };
    }
    return safeStringify(logContent);
  }
);

// Creating Log Directory
(() => {
  try {
    if (!existsSync(LOGPATH)) mkdirSync(LOGPATH);
  } catch (error) {
    console.log("Error while creating Log Directory -> ", error);
  }
})();

// Creating Logger
const logger = createLogger({
  format: combine(label({ label: APP_NAME }), timestamp(), logCustomFormat),
  transports: [new transports.File({ filename: LOG_FILE_NAME })],
});

// Enable logging in console on Development
if (LOCAL_ENVS.includes(NODE_ENV)) {
  logger.add(
    new transports.Console({
      format: combine(label({ label: APP_NAME }), timestamp(), logCustomFormat),
    })
  );
}

export default logger;
