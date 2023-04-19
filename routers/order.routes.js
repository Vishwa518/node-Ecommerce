const controller = require("../controllers/order.controller");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/order", controller.createNewOrder);

  app.get("/api/order/all-orders", controller.getOrderList);

//   app.get("/api/product/count-product", controller.countProducts);

  app.get("/api/order/:id", controller.getOrderById);

//   app.put("/api/product/:id", controller.getCategoryByIdAndUpdate);

  app.delete("/api/order/:id", controller.deleteOrderById);
};
