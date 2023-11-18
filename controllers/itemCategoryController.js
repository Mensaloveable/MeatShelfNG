const ItemCategory = require("../models/itemCategory");
const { toTitleCase } = require("../utils/utils");

const handleErrors = (err) => {
  console.log(err.message);
  let errors = { name: "" };

  if (err.code === 11000) {
    errors.name = "That category is already registered";
    return errors;
  }

  return errors;
};

module.exports.createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const newCategory = await ItemCategory.create({ name: toTitleCase(name) });

    res.status(201).json(newCategory);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.updateCategory = async (req, res) => {
  const param = req.params.id;

  const { name } = req.body;

  try {
    const updatedCategory = await ItemCategory.findOneAndUpdate(
      { _id: param },
      { name: toTitleCase(name) },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({
      errors,
    });
  }
};

module.exports.deleteCategory = async (req, res) => {
  const param = req.params.id;

  try {
    const deletedCategory = await ItemCategory.findOneAndDelete({ _id: param });

    if (!deletedCategory) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    res.status(204).json({
      status: "Deleted",
      message: "ItemCategory deleted successfully",
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({
      errors,
    });
  }
};

module.exports.getCategories = async (req, res) => {
  try {
    const categories = await ItemCategory.find();

    const responseObj = {
      categories: categories,
      length: categories.length
    };

    res.status(200).json({
      status: "success",
      data: responseObj
    });

  } catch (err) {

    const errors = handleErrors(err);
    res.status(400).json({
      errors,
    });
    
  }
};
