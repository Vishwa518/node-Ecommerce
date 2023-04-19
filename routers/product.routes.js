const controller = require("../controllers/product.controller");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/product", controller.createProduct);
  
  app.get("/api/product/all-products", controller.getAllProducts);

  app.get("/api/product/count-product", controller.countProducts);

  app.get("/api/product/:id", controller.getProductById);

  app.put("/api/product/:id", controller.getCategoryByIdAndUpdate);

  app.delete("/api/product/:id", controller.deleteById);
};
