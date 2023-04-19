const controller = require("../controllers/category.controller");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/category/all-category", controller.getAllCategory);

  app.get("/api/category/:id", controller.getCategoryById);

  app.post("/api/category", controller.createCategory);

  app.put("/api/category/:id", controller.updateCategoryBYId);

  app.delete("/api/category/:id", controller.deleteCategoryById);
};
