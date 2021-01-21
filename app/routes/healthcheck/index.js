const Healtcheck = async (app) => {
  app.get("/", (req, res) => res.status(200).json({ message: "I am Alive" }));
};

export default Healtcheck;
