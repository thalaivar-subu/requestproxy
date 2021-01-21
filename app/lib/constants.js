export const APP_NAME = process.env.APP_NAME || "node-boilerplate";
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
