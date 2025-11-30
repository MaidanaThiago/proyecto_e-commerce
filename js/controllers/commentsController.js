const path = require("path");

// Obtener comentarios de un producto específico
const getCommentsByProductId = (req, res) => {
    const id = req.params.id;
    const filePath = path.join(__dirname, `../data/products_comments/${id}.json`);

    try {
        delete require.cache[require.resolve(filePath)];
        const data = require(filePath);
        res.json(data);
    } catch (error) {
        res.status(404).json({ 
            error: "Comentarios no encontrados" 
        });
    }
};

module.exports = {
    getCommentsByProductId
};
