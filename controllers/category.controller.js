const db = require("../modals");

const Category = db.category;

exports.getAllCategory = (req, res) => {
  Category.find()
    .then((categoryList) => {
      if (!categoryList) {
        res.status(500).send({ message: "Can't found categories" });
      }
      res.status(200).send(categoryList);
    })
    .catch((err) => {
      res.send(400).send({ error: err.message });
    });
};

exports.getCategoryById = (req, res) => {
  Category.findById(req.params.id)
    .then((category) => {
      if (!category) {
        res.status(500).json({
          success: false,
          message: "The category with the given ID not exists",
        });
      }
      res.status(200).send(category);
    })
    .catch((err) => {
      res.send(400).send({ error: err.message });
    });
};

exports.createCategory = (req, res) => {
  const category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  category
    .save()
    .then((category) => {
      if (!category)
        res.status(404).send({ message: "Category cannot be created" });
      res.status(200).send(category);
    })
    .catch((err) => {
      res.send(400).send({ error: err.message });
    });
};

exports.updateCategoryBYId = (req, res) => {
    console.log('req', req.body)
  Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    {
      new: true,
    }
  )
    .then((category) => {
      if (!category)
        res.status(404).send({ message: "Category cannot be created" });
      res.status(200).send(category);
    })
    .catch((err) => {
      res.send(400).send({ error: err.message });
    });
};

exports.deleteCategoryById = (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        res
          .status(200)
          .json({ success: true, message: "Category deleted successfully" });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Category cannot find" });
      }
    })
    .catch((err) => {
      res.status(400).json({ success: false, error: err });
    });
};
