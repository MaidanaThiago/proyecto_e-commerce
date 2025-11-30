const path = require("path");

// Obtener carrito de un usuario específico
const getUserCart = (req, res) => {
    const userId = req.params.userId;
    const filePath = path.join(__dirname, `../data/user_cart/${userId}.json`);

    try {
        delete require.cache[require.resolve(filePath)];
        const data = require(filePath);
        res.json(data);
    } catch (error) {
        res.status(404).json({ 
            error: "Carrito no encontrado" 
        });
    }
};

module.exports = {
    getUserCart
};
