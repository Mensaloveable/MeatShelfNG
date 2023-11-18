const { Router } = require("express");

const { authMiddleware, checkRole } = require("../middleware/authMiddleware");

const authController = require("../controllers/authController");

const router = Router();

router.post("/signup", authController.signup_post);

router.post("/login", authController.login_post);

router.get("/logout", authMiddleware, checkRole("Super_Admin"), authController.logout_get);

module.exports = router;
