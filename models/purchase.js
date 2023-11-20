const mongoose = require("mongoose");
const Product = require("./product");

const positiveNumberValidator = (value) => {
  return value >= 0;
};

const purchaseSchema = new mongoose.Schema(
  {
    transportationCost: {
      type: Number,
      required: true,
      validate: {
        validator: positiveNumberValidator,
        message: "Transportation cost must be a positive number",
      }
    },
    animalCost: {
      type: Number,
      required: false,
      default: 0,
      validate: {
        validator: positiveNumberValidator,
        message: "Animal cost must be a positive number",
      }
    },
    gateFee: {
      type: Number,
      required: true,
      validate: {
        validator: positiveNumberValidator,
        message: "Gate fee must be a positive number",
      }
    },
    totalCost: {
      type: Number,
      required: false,
      default: 0,
      validate: {
        validator: positiveNumberValidator,
        message: "Total cost must be a positive number",
      }
    },
    miscellaneous: {
      type: Number,
      required: false,
      default: 0,
      validate: {
        validator: positiveNumberValidator,
        message: "Miscellaneous must be a positive number",
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: false,
        unique: true,
      },
    ],
    note: String,
  },
  {
    timestamps: true,
  }
);

// Define a pre-save hook to calculate the totalCost before saving the Purchase
purchaseSchema.pre("save", async function (next) {
  try {
    // Get the products referenced in the products array
    const products = await Product.find({ _id: { $in: this.products } });

    const totalCostFromProductss = products.reduce((sum, product) => {
      return sum + (product.costPrice || 0);
    }, 0);

    // Save totalCostFromProducts to the animalCost field
    this.animalCost = totalCostFromProductss;

    // Calculate the totalCost for the current Purchase model
    this.totalCost =
      this.transportationCost +
      this.animalCost +
      this.gateFee +
      this.miscellaneous;

    // Continue with the save operation
    next();
  } catch (error) {
    next(error);
  }
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
