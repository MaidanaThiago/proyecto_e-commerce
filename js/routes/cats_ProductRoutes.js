const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

router.get("/", (req, res) => {
    const folder = path.join(__dirname, "../data/cats_products");
    const files = fs.readdirSync(folder).filter(f => f.endsWith(".json"));

    const data = files.map(file => {
        const filePath = path.join(folder, file);
        return require(filePath);
    });

    res.json(data);
});

// /api/cats_products/:id
router.get("/:id", (req, res) => {
    const id = req.params.id;
    const filePath = path.join(__dirname, `../data/cats_products/${id}.json`);

    try {
        const data = require(filePath);
        res.json(data);
    } catch {
        res.status(404).json({ error: "Categoría no encontrada" });
    }
});

module.exports = router;
