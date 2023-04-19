const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../modals");

const User = db.user;

exports.register = (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  user
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getAllUsers = (req, res) => {
  User.find()
    .select("-passwordHash")
    .then((data) => {
      if (!data) {
        res.status(500).send({ message: "no data found" });
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getUserById = (req, res) => {
  const userId = req.params.id;

  User.findById(userId)
    .select("-passwordHash")
    .then((user) => {
      if (!user) {
        res.status(500).send({
          message: "The user with the given ID not exists",
        });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.deleteUserById = (req, res) => {
  const userId = req.params.id;

  User.findByIdAndRemove(userId)
    .then((user) => {
      if (!user) {
        res.status(500).send({
          message: "The user can not exists",
        });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      res.status(400).send({ error: err });
    });
};

exports.userLogin = (req, res) => {
  console.log("req.body", req.body);
  const secret = "123456";
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(400).send("User with given Email not found");
      }
      console.log("user", user);
      if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
          {
            userID: user.id,
            isAdmin: user.isAdmin,
          },
          secret,
          { expiresIn: "1d" }
        );
        res.status(200).send({ user: user.email, token: token });
      } else {
        res.status(400).send("Password is mismatch");
      }

      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(400).send({ error: err });
    });
};

exports.countUsers = (req, res) => {
  User.countDocuments({})
    .then((data) => {
      if (!data) {
        res.status(500).send({ message: "No users found" });
      }
      res.status(200).send({
        data,
      });
    })
    .catch((err) => {
      res.status(400).send({ error: err });
    });
};
