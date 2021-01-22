import { clientIdCustomValidation } from "./validation";
import { check, validationResult, body } from "express-validator";
import safeStringify from "fast-safe-stringify";
import { parseJson, axiosWrapper } from "../../utils/helpers";
import logger from "../../utils/logger";

const Proxy = async (app) => {
  app.use(
    "/proxy",
    [
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
      body("clientId").custom(clientIdCustomValidation),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error("Validation Error -> ", { errors });
        return res.status(422).json({ errors: errors.array() });
      }
      const { url, requestType: method, requestBody: data, headers } = req.body;
      const params = parseJson(
        safeStringify({
          url,
          method,
          data: parseJson(data),
          headers: parseJson(headers),
        })
      );
      const proxyResponse = await axiosWrapper({ params, timeout: 5000 });
      const contentType = proxyResponse.headers["content-type"];
      res.status(proxyResponse.status);
      res.contentType(contentType);
      res.send(proxyResponse.data);
    }
  );
};

export default Proxy;
