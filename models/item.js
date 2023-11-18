const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    salesDate: {
      type: Date,
      required: false,
    },
    costPrice: {
      type: Number,
      required: true,
    },
    completelyPurchased: {
      type: Boolean,
      default: false,
    },
    percentGain: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
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
      ref: "ItemCategory",
      required: true,
    },
    note: String,
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
