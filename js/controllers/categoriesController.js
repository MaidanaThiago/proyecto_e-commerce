const path = require("path");

// Obtener todas las categorías
const getAllCategories = (req, res) => {
    const filePath = path.join(__dirname, "../data/cats/cat.json");

    try {
        delete require.cache[require.resolve(filePath)];
        const data = require(filePath);
        res.json(data);
    } catch (error) {
        res.status(500).json({ 
            error: "No se pudieron cargar las categorías" 
        });
    }
};

module.exports = {
    getAllCategories
};
