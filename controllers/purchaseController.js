const Purchase = require("../models/purchase");
const Product = require("../models/product");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

module.exports.savePurchase = async (req, res) => {
  let { transportationCost, gateFee, miscellaneous, user, note } = req.body;

  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, jwtSecret, async (err, decodedToken) => {
      if (err) {
        res.status(403).json({
          status: "error",
          message: "You are not authorized to perform this action",
        });
      }
      user = decodedToken.id;
    });
  }

  const purchase = await Purchase.create({
    transportationCost,
    gateFee,
    miscellaneous,
    user,
    note,
  });

  const populatedPurchase = await Purchase.populate(
    purchase,
    {
      path: "user",
      select: "username",
      model: User,
    },
    {
      path: "products",
      model: Product,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Purchase added successfully",
    data: populatedPurchase,
  });
};

