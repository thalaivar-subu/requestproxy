// eslint-disable-next-line no-unused-vars
import logEventErrors from "./utils/eventerrors";
import express from "express";
import logger from "./utils/logger";
import Middlewares from "./middlewares/index";
import Routes from "./routes/index";

import { APP_NAME, PORT } from "./lib/constants";

const app = express();

Middlewares(app);

Routes(app);

// App Listens
app.listen(PORT, () => {
  logger.info(`${APP_NAME} app listening at http://localhost:${PORT}`);
});
