const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/count-users", controller.countUsers);

  app.post("/api/login", controller.userLogin);

  app.post("/api/register", controller.register);

  app.get("/api/all-users", controller.getAllUsers);

  app.get("/api/:id", controller.getUserById);

  app.delete("/api/:id", controller.deleteUserById);
};
