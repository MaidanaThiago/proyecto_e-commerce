const express = require("express");
const router = express.Router();
const userCartController = require("../controllers/userCartController");

// GET /api/user_cart/:userId
router.get("/:userId", userCartController.getUserCart);

module.exports = router;
