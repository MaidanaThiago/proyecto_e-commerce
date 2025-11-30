const path = require("path");
const fs = require("fs");

// Obtener todos los productos
const getAllProducts = (req, res) => {
    const folder = path.join(__dirname, "../data/products");
    const files = fs.readdirSync(folder).filter(f => f.endsWith(".json"));

    const data = files.map(file => {
        const filePath = path.join(folder, file);
        delete require.cache[require.resolve(filePath)];
        return require(filePath);
    });

    res.json(data);
};

// Obtener producto específico por ID
const getProductById = (req, res) => {
    const id = req.params.id;
    const filePath = path.join(__dirname, `../data/products/${id}.json`);

    try {
        delete require.cache[require.resolve(filePath)];
        const data = require(filePath);
        res.json(data);
    } catch (error) {
        res.status(404).json({ 
            error: "Producto no encontrado" 
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById
};
