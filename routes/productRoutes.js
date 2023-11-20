const productController = require("../controllers/productController");
const { Router } = require("express");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const router = Router();

router.post("/", productController.addProduct);

router.put(
  "/:id",
  authMiddleware,
  checkRole("Super_Admin"),
  productController.updateProduct
);

router.get("/:id", productController.getProduct);

router.get("/", productController.getProducts);

router.delete(
  "/:id",
  authMiddleware,
  checkRole("Super_Admin"),
  productController.deleteProduct
);

module.exports = router;
