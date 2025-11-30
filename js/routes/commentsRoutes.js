const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");

// GET /api/products_comments/:id
router.get("/:id", commentsController.getCommentsByProductId);

module.exports = router;
