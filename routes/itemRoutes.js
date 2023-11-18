const itemController = require("../controllers/itemController");
const { Router } = require("express");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const router = Router();

router.post("/", itemController.addItem);

router.put("/:id", authMiddleware, checkRole("Super_Admin"), itemController.updateItem);

router.get("/:id", itemController.getItem);

router.get("/", itemController.getItems);

router.delete("/:id", authMiddleware, checkRole("Super_Admin"), itemController.deleteItem);

module.exports = router;