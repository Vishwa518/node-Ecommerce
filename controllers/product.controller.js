const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../modals");
const multer = require("multer");

const Product = db.product;
const Category = db.category;

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid Image Type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split("").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

exports.getAllProducts = (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  Product.find(filter)
    .populate("category")
    .then((productList) => {
      if (!productList) {
        res.status(500).send({ message: "category not found" });
      }
      res.status(200).send(productList);
    })
    .catch((err) => {
      res.status(400).send({ error: err });
    });
};

exports.getProductById = (req, res) => {
  const productId = req.params.id;

  Product.findById(productId)
    .populate("category")
    .then((product) => {
      if (!product) {
        res.status(500).send({
          message: "The product with the given ID not exists",
        });
      }
      res.status(200).send(product);
    })
    .catch((err) => {
      res.status(400).send({ error: err });
    });
};

exports.getCategoryByIdAndUpdate = (req, res) => {
  Category.findById(req.body.category)
    .then((category) => {
      if (!category) return res.status(400).send("Invalid Category");
    })
    .catch((err) => res.status(404).send({ message: err.message }));

  Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    {
      new: true,
    }
  )
    .populate("category")
    .then((product) => {
      if (!product) return res.status(500).send("Product cannot be updated");
      res.send(product);
    })
    .catch((err) => res.status(404).send({ message: err.message }));
};

exports.deleteById = (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "Product deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Product cannot find" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
};

exports.countProducts = (req, res) => {
  Product.countDocuments({})
    .then((productCount) => {
      if (!productCount) {
        res.status(500), json({ success: false });
      }
      res.status(200).send({
        productCount: productCount,
      });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
};

exports.createProduct = (req, res) => {
  console.log("req.body", req.body);
  Category.findById(req.body.category)
    .then((category) => {
      if (!category) res.status(400).send("Invalid Category");
    })
    .catch((err) => {
      res.status(400).send({ error: err.message });
    });

  const file = req.file;
  // if (!file) res.status(400).send("No image in the request");

  const fileName = file?.filename || "";
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: "",
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product
    .save()
    .then((data) => {
      if (!data) return res.status(500).send("Product cannot be created");

      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};
