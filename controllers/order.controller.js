const db = require("../modals");

const Order = db.order;
const OrderItem = db.order_item;

exports.getOrderList = (req, res) => {
  Order.find({})
    .populate("user", "name")
    .sort({ dateOrdered: -1 })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .then((orderList) => {
      if (!orderList) {
        res.status(500).json({ success: false });
      }
      res.send(orderList);
    })
    .catch((err) => {
      res.status(404).send({ message: err.message });
    });
};

exports.getOrderById = (req, res) => {
  Order.findById(req.params.id)
    .populate("user", "name")
    .then((order) => {
      if (!order) {
        res.status(500).json({ success: false });
      }
      res.send(order);
    })
    .catch((err) => {
      res.status(404).send({ message: err.message });
    });
};

exports.createNewOrder = async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  const order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  order
    .save()
    .then((order) => {
      if (!order) res.status(404).send("Order cannot be created");
      res.send(order);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateOrderStatusById = (req, res) => {
  Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  )
    .then((order) => {
      if (!order) res.status(404).send("Order cannot be created");
      res.send(order);
    })
    .catch((err) => {
      res.status(404).send({ message: err.message });
    });
};

exports.deleteOrderById = (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        res
          .status(200)
          .json({ success: true, message: "Order deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Order cannot find" });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err });
    });
};

exports.getOrderCounts = (req, res) => {
  Order.countDocuments({})
    .then((orderCount) => {
      if (!orderCount) {
        res.status(500), json({ success: false });
      }
      res.status(200).send({
        orderCount,
      });
    })
    .catch((err) => {
      res.status(404).send({ message: err.message });
    });
};

exports.getSalesCount = (req, res) => {
  Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ])
    .then((totalSales) => {
      if (!totalSales) {
        res.status(404).send("the order sales cannot be generated");
      }
      res.send({ totalsales: totalSales.pop().totalsales });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
