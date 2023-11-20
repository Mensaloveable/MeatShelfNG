const productCategoryController = require("../controllers/productCategoryController");
const { Router } = require("express");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const router = Router();

router.post("/", authMiddleware, checkRole("Super_Admin"), productCategoryController.createCategory);

router.put("/:id", authMiddleware, checkRole("Super_Admin"), productCategoryController.updateCategory);

router.delete("/:id", authMiddleware, checkRole("Super_Admin"), productCategoryController.deleteCategory);

router.get("/", authMiddleware, checkRole("Super_Admin"), productCategoryController.getCategories);

module.exports = router;