const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Obtener todos los productos
router.get("/", (req, res) => {
    const folder = path.join(__dirname, "../data/products");
    const files = fs.readdirSync(folder).filter(f => f.endsWith(".json"));

    const data = files.map(file => {
        const filePath = path.join(folder, file);
        return require(filePath);
    });

    res.json(data);
});

// Obtener producto específico por ID
router.get("/:id", (req, res) => {
    const id = req.params.id;
    const filePath = path.join(__dirname, `../data/products/${id}.json`);

    try {
        const data = require(filePath);
        res.json(data);
    } catch {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

module.exports = router;
