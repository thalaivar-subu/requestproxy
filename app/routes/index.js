const Routes = async (app) => {
  // Healtcheck End point
  app.get("/", (req, res) => res.status(200).json({ message: "I am Alive" }));

  // Proxy End Point
  app.get("/proxy", (req, res) => {
    res.status(200).json({ message: "Proxy End Point" });
  });
};

export default Routes;
