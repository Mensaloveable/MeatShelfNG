const mongoose = require("mongoose");

const itemCategorySchema = new mongoose.Schema(
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

const ItemCategory = mongoose.model("ItemCategory", itemCategorySchema);

module.exports = ItemCategory;
