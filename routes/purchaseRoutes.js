const purchaseController = require("../controllers/purchaseController");
const { Router } = require("express");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const router = Router();

router.post("/", purchaseController.savePurchase);

module.exports = router;