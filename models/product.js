const mongoose = require("mongoose");

const positiveNumberValidator = (value) => {
  return value >= 0;
};

const productSchema = new mongoose.Schema(
  {
    salesDate: {
      type: Date,
      required: false,
    },
    costPrice: {
      type: Number,
      required: true,
      validate: {
        validator: positiveNumberValidator,
        message: "Cost price must be a positive number",
      }
    },
    completelyPurchased: {
      type: Boolean,
      default: false,
    },
    targetPercentGain: {
      type: Number,
      required: true,
    },
    priceSold: {
      type: Number,
      required: false,
      validate: {
        validator: positiveNumberValidator,
        message: "Price sold must be a positive number",
      }
    },
    actualPercentageGainOrLoss: {
      percentageGainOrLoss: {
        type: Number,
        required: false,
      },
      isGain: {
        type: Boolean,
        required: false,
      },
    },
    sellingPrice: {
      type: Number,
      required: true,
      validate: {
        validator: positiveNumberValidator,
        message: "Selling price must be a positive number",
      }
    },
    casualty: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Sold", "Instock"],
      default: "Instock",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
    },
    note: String,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
