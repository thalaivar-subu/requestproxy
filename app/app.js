// eslint-disable-next-line no-unused-vars
import logEventErrors from "./utils/eventerrors";
import express from "express";
import logger from "./utils/logger";
import Middlewares from "./middlewares/index";
import Routes from "./routes/index";
import { InitRedis } from "./utils/redis";
import { APP_NAME, PORT } from "./lib/constants";

class App {
  #app = null;
  constructor(params) {
    Object.keys(params).map((x) => (this[x] = params[x]));
  }
  async initApp() {
    this.app = express();
    Middlewares(this.app);
    Routes(this.app);
    await InitRedis();
    this.app.listen(PORT, () => {
      logger.info(
        `${this.APP_NAME} app listening at http://localhost:${this.PORT}`
      );
    });
  }
  async getApp() {
    await this.initApp();
    return this.app;
  }
}

new App({ APP_NAME, PORT }).getApp();
