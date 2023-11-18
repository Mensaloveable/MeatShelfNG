const itemCategoryController = require("../controllers/itemCategoryController");
const { Router } = require("express");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const router = Router();

router.post("/", authMiddleware, checkRole("Super_Admin"), itemCategoryController.createCategory);

router.put("/:id", authMiddleware, checkRole("Super_Admin"), itemCategoryController.updateCategory);

router.delete("/:id", authMiddleware, checkRole("Super_Admin"), itemCategoryController.deleteCategory);

router.get("/", authMiddleware, checkRole("Super_Admin"), itemCategoryController.getCategories);

module.exports = router;