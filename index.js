const express = require("express");
const cors = require("cors");
const dbConfig = require("./config/dbConfig");
const db = require("./modals");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("server running");
});

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log("err", err);
  });

require("./routers/user.routes")(app);
require("./routers/product.routes")(app);
require("./routers/category.routes")(app);
require("./routers/order.routes")(app);
