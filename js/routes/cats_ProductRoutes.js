const express = require("express");
const router = express.Router();
const catsProductController = require("../controllers/catsProductController");

// GET /api/cats_products
router.get("/", catsProductController.getAllCatsProducts);

// GET /api/cats_products/:id
router.get("/:id", catsProductController.getCatsProductById);

module.exports = router;
