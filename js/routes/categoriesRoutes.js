const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");

// GET /api/cats
router.get("/", categoriesController.getAllCategories);

module.exports = router;
