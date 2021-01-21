import Healtcheck from "./healthcheck/index";
import Proxy from "./proxy/index";

const Routes = async (app) => {
  // Healtcheck End point
  Healtcheck(app);
  Proxy(app);
};

export default Routes;
