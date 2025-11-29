const express = require("express");
const path = require("path");
const router = express.Router();

// Obtener carrito de un usuario específico
router.get("/:userId", (req, res) => {
    const userId = req.params.userId;
    const filePath = path.join(__dirname, `../data/user_cart/${userId}.json`);

    try {
        const data = require(filePath);
        res.json(data);
    } catch {
        res.status(404).json({ error: "Carrito no encontrado" });
    }
});

module.exports = router;
