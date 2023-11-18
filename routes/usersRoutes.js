const userController = require("../controllers/userController");
const express = require("express");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const router = express.Router();

router.put("/update/:username", userController.update_user);

router.get("/", authMiddleware, checkRole("Super_Admin"), userController.get_users);

router.delete("/delete/:username", authMiddleware, checkRole("Super_Admin"), userController.delete_user);

module.exports = router