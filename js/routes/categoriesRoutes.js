const express = require("express");
const path = require("path");
const router = express.Router();

// Obtener todas las categorías
router.get("/", (req, res) => {
    const filePath = path.join(__dirname, "../data/cats/cat.json");

    try {
        const data = require(filePath);
        res.json(data);
    } catch {
        res.status(500).json({ error: "No se pudieron cargar las categorías" });
    }
});

module.exports = router;
