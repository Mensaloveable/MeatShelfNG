const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser, authMiddleware } = require("./middleware/authMiddleware");
require("dotenv").config();

const dbPassword = process.env.DB_PASSWORD;

const app = express();
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const productCategoryRoutes = require("./routes/productCategoryRoutes");
const productRoutes = require("./routes/productRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");

// database connection
const dbURI = `mongodb+srv://mongodb:${dbPassword}@cluster0.dko2ncp.mongodb.net/meatshelf?retryWrites=true&w=majority`;

mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(3000);
    console.log(`Server is running on port 3000`);
  })
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.use("/auth", authRoutes);
app.use("/users", requireAuth, usersRoutes);
app.use("/productCategory", requireAuth, productCategoryRoutes);
app.use("/product", requireAuth, productRoutes);
app.use("/purchase", requireAuth, purchaseRoutes);