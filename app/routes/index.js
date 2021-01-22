import Healtcheck from "./healthcheck/index";
import Proxy from "./proxy/index";

// Routes in this Application
const Routes = async (app) => {
  // Healtcheck End point
  Healtcheck(app);
  // Proxy End Point
  Proxy(app);
};

export default Routes;
