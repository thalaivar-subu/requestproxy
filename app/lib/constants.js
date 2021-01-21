export const APP_NAME = process.env.APP_NAME || "requestproxy";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const LOGPATH = process.env.LOGPATH || "logs";
export const LOG_FILE_NAME = `${LOGPATH}/${
  APP_NAME +
  new Date().getFullYear() +
  "-" +
  (new Date().getMonth() + 1) +
  "-" +
  new Date().getDate()
}.log`;
export const APP_PORT = 8080;
export const TEST_PORT = 8081;
export const TEST_URL = `http://127.0.0.1:${TEST_PORT}`;
export const PORT = NODE_ENV === "test" ? TEST_PORT : APP_PORT;
export const LOCAL_ENVS = ["test", "development"];
export const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || "6379",
  db: process.env.REDIS_DB || "0",
};
const MS_PER_MINUTE = 1000;
export const MAX_WINDOW_REQUEST_COUNT = 3;
export const MAX_WINDOW_IN_MS = 60 * MS_PER_MINUTE;
