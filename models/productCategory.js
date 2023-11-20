const mongoose = require("mongoose");

const ProductCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "Category already exists"],
      minlength: [3, "Category must be at least 3 characters long"],
    }
  },
  {
    timestamps: true,
  }
);

const ProductCategory = mongoose.model("ProductCategory", ProductCategorySchema);

module.exports = ProductCategory;
