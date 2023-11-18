const Item = require("../models/item");
const ItemCategory = require("../models/itemCategory");

module.exports.addItem = async (req, res) => {
  const { costPrice, percentGain, casualty, category, note } = req.body;

  try {
    const categoryObj = await ItemCategory.findById(category);

    if (!categoryObj) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    const sellingPrice = costPrice + costPrice * (percentGain / 100);

    const item = await Item.create({
      costPrice,
      percentGain,
      sellingPrice,
      casualty,
      category,
      note,
    });

    const populatedItem = await Item.populate(item, {
      path: "category",
      select: "name",
    });

    res.status(201).json({
      status: "success",
      message: "Item added successfully",
      data: populatedItem,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports.updateItem = async (req, res) => {
  const param = req.params.id;

  try {
    const {
      salesDate,
      costPrice,
      percentGain,
      completelyPurchased,
      priceSold,
      casualty,
      status,
      note,
      category,
    } = req.body;

    const categoryObj = await ItemCategory.findById(category);

    if (!categoryObj) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    const sellingPrice = costPrice + costPrice * (percentGain / 100);

    const newItem = {
      salesDate,
      costPrice,
      percentGain,
      completelyPurchased,
      priceSold,
      sellingPrice,
      casualty,
      status,
      note,
      category,
    };

    const updatedItem = await Item.findOneAndUpdate({ _id: param }, newItem, {
      new: true,
    }).populate({
      path: "category",
      select: "name",
    });

    if (!updatedItem) {
      return res.status(404).json({
        status: "error",
        message: "Item not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Item updated successfully",
      data: updatedItem,
    });

  } catch (err) {

    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports.getItem = async (req, res) => {
  const param = req.params.id;

  try {
    const item = await Item.findById(param).populate({
      path: "category",
      select: "name",
    });

    if (!item) {
      return res.status(404).json({
        status: "error",
        message: "Item not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Item found",
      data: item,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().populate({
      path: "category",
      select: "name",
    });

    const responseObj = {
      items: items,
      length: items.length,
    };

    res.status(200).json({
      status: "success",
      message: "Items found",
      data: responseObj,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports.deleteItem = async (req, res) => {
  const param = req.params.id;

  try {
    const deletedItem = await Item.findOneAndDelete({ _id: param });

    if (!deletedItem) {
      return res.status(404).json({
        status: "error",
        message: "Item not found",
      });
    }

    res.status(204).json({
      status: "Deleted",
      message: "Item deleted successfully",
    })
  } catch (err) {
      res.status(400).json({
        status: "error",
        message: err.message,
      })
  }
}