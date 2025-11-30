const path = require("path");

// Obtener carrito general
const getCart = (req, res) => {
    const filePath = path.join(__dirname, "../data/cart/buy.json");

    try {
        delete require.cache[require.resolve(filePath)];
        const data = require(filePath);
        res.json(data);
    } catch (error) {
        res.status(500).json({ 
            error: "No se pudo cargar el carrito" 
        });
    }
};

module.exports = {
    getCart
};
