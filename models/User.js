const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already exists"],
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [15, "Username must be at most 15 characters long"],
      collation: { locale: 'en', strength: 2 },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["Admin", "Super_Admin"],
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// create static login method
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      return user;
    }
    throw Error("Invalid Credentials");
  }

  throw Error("Invalid Credentials");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
