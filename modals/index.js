const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.modal");
db.product = require("./product.modal");
db.order = require("./order.modal");
db.order_item = require("./order-item.modal");
db.category = require("./category.modal");

module.exports = db;
