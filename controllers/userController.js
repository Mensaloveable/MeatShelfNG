const User = require("../models/user");
const bcrypt = require("bcrypt");

module.exports.update_user = async (req, res) => {
  const param = req.params.username;

  const { username, email, password } = req.body;
  let new_password;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    new_password = await bcrypt.hash(password, salt);
  }

  try {
    const updatedFields = {
      username,
      email,
    };

    if (new_password) {
      updatedFields.password = new_password;
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: param },
      updatedFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Profile updated",
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports.delete_user = async (req, res) => {
  const param = req.params.username;

  try {
    const deletedUser = await User.findOneAndDelete({ username: param });

    if (!deletedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(204).json({
      status: "Deleted",
      message: "Profile deleted",
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports.get_users = async (req, res) => {
  
  try {

    const users = await User.find();

    const responseObj = {
      users: users,
      length: users.length
    };
    
    
    res.status(200).json({
      status: "success",
      data: responseObj,
    });

  } catch (err) {
    
    res.status(400).json({
      status: "error",
      message: err.message,
    });
    
  }
};
