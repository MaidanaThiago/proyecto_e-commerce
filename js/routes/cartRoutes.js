const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
    const filePath = path.join(__dirname, "../data/cart/buy.json");

    try {
        const data = require(filePath);
        res.json(data);
    } catch {
        res.status(500).json({ error: "No se pudo cargar el carrito" });
    }
});

module.exports = router;