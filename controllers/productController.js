const Product = require("../models/product");
const ProductCategory = require("../models/productCategory");
const Purchase = require("../models/purchase");

module.exports.addProduct = async (req, res) => {
  const {
    salesDate,
    costPrice,
    targetPercentGain,
    completelyPurchased,
    priceSold,
    casualty,
    status,
    purchase,
    note,
    category,
  } = req.body;

  try {
    const categoryObj = await ProductCategory.findById(category);

    if (!categoryObj) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    const purchaseObj = await Purchase.findById(purchase);

    if (!purchaseObj) {
      return res.status(404).json({
        status: "error",
        message: "Purchase not found",
      });
    }

    const sellingPrice = costPrice + costPrice * (targetPercentGain / 100);

    const actualPercentageGainOrLoss = calculateActualPercentageGainOrLoss(
      costPrice,
      priceSold
    );

    const product = await Product.create({
      salesDate,
      completelyPurchased,
      priceSold,
      status,
      costPrice,
      targetPercentGain,
      sellingPrice,
      casualty,
      actualPercentageGainOrLoss,
      purchase,
      category,
      note,
    });

    const populatedProduct = await Product.populate(product, {
      path: "category",
      select: "name",
    });

    await Purchase.findByIdAndUpdate(purchaseObj._id, {
      $push: { products: populatedProduct._id },
      $inc: {
        animalCost: populatedProduct.costPrice,
        totalCost: populatedProduct.costPrice,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Product added successfully",
      data: populatedProduct,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports.updateProduct = async (req, res) => {
  const param = req.params.id;

  const oldProduct = await Product.findById(param);

  try {
    const {
      salesDate,
      costPrice,
      targetPercentGain,
      completelyPurchased,
      priceSold,
      casualty,
      status,
      purchase,
      note,
      category,
    } = req.body;

    const categoryObj = await ProductCategory.findById(category);

    if (!categoryObj) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    const purchaseObj = await Purchase.findById(purchase);

    if (!purchaseObj) {
      return res.status(404).json({
        status: "error",
        message: "Purchase not found",
      });
    }

    const sellingPrice = costPrice + costPrice * (targetPercentGain / 100);

    const actualPercentageGainOrLoss = calculateActualPercentageGainOrLoss(
      costPrice,
      priceSold
    );

    const newProduct = {
      salesDate,
      costPrice,
      targetPercentGain,
      completelyPurchased,
      priceSold,
      actualPercentageGainOrLoss,
      sellingPrice,
      casualty,
      status,
      purchase,
      note,
      category,
    };

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: param },
      newProduct,
      {
        new: true,
      }
    ).populate({
      path: "category",
      select: "name",
    });

    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    await Purchase.findByIdAndUpdate(
      purchaseObj._id,
      {
        $addToSet: { products: updatedProduct._id },
        $inc: {
          animalCost: updatedProduct.costPrice - oldProduct.costPrice,
          totalCost: updatedProduct.costPrice - oldProduct.costPrice,
        },
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports.getProduct = async (req, res) => {
  const param = req.params.id;

  try {
    const product = await Product.findById(param).populate({
      path: "category",
      select: "name",
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Product found",
      data: product,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "category",
      select: "name",
    });

    const responseObj = {
      Products: products,
      length: products.length,
    };

    res.status(200).json({
      status: "success",
      message: "Products found",
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

module.exports.deleteProduct = async (req, res) => {
  const param = req.params.id;

  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: param });

    if (!deletedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    const purchaseObj = await Purchase.findById(deletedProduct.purchase);

    if (!purchaseObj) {
      return res.status(404).json({
        status: "error",
        message: "Associated Purchase not found",
      });
    }

    await Purchase.findByIdAndUpdate(purchaseObj._id, {
      $inc: {
        animalCost: -deletedProduct.costPrice,
        totalCost: -deletedProduct.costPrice,
      },
      $pull: { products: deletedProduct._id },
    });

    res.status(204).json({
      status: "Deleted",
      message: "Product deleted successfully",
    });

  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};
function calculateActualPercentageGainOrLoss(costPrice, sellingPrice) {
  if (isNaN(costPrice) || isNaN(sellingPrice)) {
    throw new Error("Both costPrice and sellingPrice must be valid numbers.");
  }

  const percentageGainOrLoss = ((sellingPrice - costPrice) / costPrice) * 100;

  // Determine if it's a gain or a loss
  const isGain = sellingPrice > costPrice;

  return { percentageGainOrLoss, isGain };
}
