const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { toTitleCase } = require("../utils/utils");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

const handleErrors = (err) => {
  console.log(err.message);
  let errors = { email: "", password: "", username: "" };

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  if (err.code === 11000 && Object.keys(err.keyValue)[0] === "email") {
    errors.email = "That email is already registered";
    return errors;
  }

  if (err.code === 11000 && Object.keys(err.keyValue)[0] === "username") {
    errors.username = "That username is already registered";
    return errors;
  }

  if (err.message === "Invalid Credentials") {
    errors.email = "Invalid Credentials";
    errors.password = "Invalid Credentials";
    return errors;
  }

  return errors;
};

const maxAge = 24 * 60 * 60; // 1 day in seconds

const createToken = (id, role) => {
  return jwt.sign({ id, role }, jwtSecret, {
    expiresIn: maxAge,
  });
};

module.exports.signup_post = async (req, res) => {
  let { username, email, password } = req.body;

  username = toTitleCase(username);

  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);

    // Omit the 'password' property from the user object
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id, user.role);

    console.log("authController.js: line 70");
    console.log(token);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    const responseObj = {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    };

    res.status(201).json(responseObj);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
};
