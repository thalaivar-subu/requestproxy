import { clientIdCustomValidation } from "./validation";
import { check, validationResult, body } from "express-validator";

const Proxy = async (app) => {
  app.post(
    "/proxy",
    [
      check("clientId").isNumeric().withMessage("Must Be a Valid Number"),
      check("url").isURL().withMessage("Must Be a Valid Url"),
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
      res.status(200).json({ message: "Proxy End Point" });
    }
  );
};

export default Proxy;
