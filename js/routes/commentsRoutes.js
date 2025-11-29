const express = require("express");
const path = require("path");
const router = express.Router();

// Obtener comentarios de un producto específico
router.get("/:id", (req, res) => {
    const id = req.params.id;
    const filePath = path.join(__dirname, `../data/products_comments/${id}.json`);

    try {
        const data = require(filePath);
        res.json(data);
    } catch {
        res.status(404).json({ error: "Comentarios no encontrados" });
    }
});

module.exports = router;
