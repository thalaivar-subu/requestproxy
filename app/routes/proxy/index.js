import { clientIdCustomValidation } from "./validation";
import { check, validationResult, body } from "express-validator";
import safeStringify from "fast-safe-stringify";
import { parseJson, axiosWrapper } from "../../utils/helpers";

const Proxy = async (app) => {
  app.use(
    "/proxy",
    [
      check("clientId").isNumeric().withMessage("Must Be a Valid Number"),
      check("url")
        .isURL({ protocols: ["https"] })
        .withMessage("Must Be a Valid Https Url"),
      check("headers").isJSON().withMessage("Must Be a valid JSON"),
      check("requestType").isString().withMessage("Must Be a Valid String"),
      check("requestBody").isString().withMessage("Must Be a Valid String"),
      body("clientId").custom(clientIdCustomValidation),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { url, requestType: method, requestBody: data, headers } = req.body;
      const params = parseJson(
        safeStringify({ url, method, data, headers: parseJson(headers) })
      );
      const proxyResponse = await axiosWrapper(params);
      const contentType = proxyResponse.headers["content-type"];
      res.status(proxyResponse.status);
      res.contentType(contentType);
      res.send(proxyResponse.data);
    }
  );
};

export default Proxy;
