import ProxyValidation from "./validation";
import { validationResult } from "express-validator";
import safeStringify from "fast-safe-stringify";
import { parseJson, axiosWrapper } from "../../utils/helpers";
import logger from "../../utils/logger";

const Proxy = async (app) => {
  app.use("/proxy", ProxyValidation, async (req, res) => {
    try {
      // Request Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error("Validation Error -> ", { errors: errors.array() });
        return res.status(422).json({ errors: errors.array() });
      }

      // On Validation Success moving on to Proxy

      const { url, requestType: method, requestBody: data, headers } = req.body;

      // Setting Proxy Params
      const params = parseJson(
        safeStringify({
          url,
          method,
          data: parseJson(data),
          headers: parseJson(headers),
        })
      );

      // Calling Input Endpoints
      const proxyResponse = await axiosWrapper({ params, timeout: 5000 });

      // Returning the Response
      res.status(proxyResponse.status);
      if (proxyResponse.headers && proxyResponse.headers["content-type"]) {
        res.contentType(proxyResponse.headers["content-type"]);
      }
      return res.send(proxyResponse.data);
    } catch (error) {
      logger.error(
        `Error in Proxy Endpoint -> ${safeStringify(req.body)}`,
        error
      );
      // Error Response
      res.status(500);
      res.contentType("application/json");
      return res.send({ msg: "Something Went Wrong" });
    }
  });
};

export default Proxy;
