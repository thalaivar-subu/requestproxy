import logger from "../utils/logger";
import morgan from "morgan";
import { urlencoded, json } from "express";
import { middleware, set } from "express-http-context";
import uniqid from "uniqid";
import { parseJson } from "../utils/helpers";

const Middlewares = async (app) => {
  // Logs Request Info
  app.use(
    morgan((tokens, req, res) => {
      logger.info(
        [
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens["response-time"](req, res),
          "ms",
        ].join(" ")
      );
    })
  );

  // Body Parsers
  app.use(urlencoded({ limit: "256kb", extended: true }));
  app.use(json({ limit: "256kb" }));
  app.use(middleware);

  // Sets Uniqid in context
  app.use((req, res, next) => {
    const { headers: { context } = {}, body } = req;
    const { uniqId = uniqid() } = parseJson(context);
    set("reqId", uniqId);
    set("requestBody", body);
    next();
  });
};

export default Middlewares;
