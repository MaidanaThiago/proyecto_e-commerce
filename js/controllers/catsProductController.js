const path = require("path");
const fs = require("fs");

// Obtener todas las categorías con productos
const getAllCatsProducts = (req, res) => {
    const folder = path.join(__dirname, "../data/cats_products");
    const files = fs.readdirSync(folder).filter(f => f.endsWith(".json"));

    const data = files.map(file => {
        const filePath = path.join(folder, file);
        delete require.cache[require.resolve(filePath)];
        return require(filePath);
    });

    res.json(data);
};

// Obtener productos de una categoría específica
const getCatsProductById = (req, res) => {
    const id = req.params.id;
    const filePath = path.join(__dirname, `../data/cats_products/${id}.json`);

    try {
        delete require.cache[require.resolve(filePath)];
        const data = require(filePath);
        res.json(data);
    } catch (error) {
        res.status(404).json({ 
            error: "Categoría no encontrada" 
        });
    }
};

module.exports = {
    getAllCatsProducts,
    getCatsProductById
};
