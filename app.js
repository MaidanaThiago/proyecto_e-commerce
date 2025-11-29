const express = require("express");
const path = require("path");
const categoriesRoutes = require("./js/routes/categoriesRoutes.js");
const catsProductRoutes = require("./js/routes/cats_ProductRoutes.js");
const productRoutes = require("./js/routes/productRoutes.js");
const commentsRoutes = require("./js/routes/commentsRoutes.js");
const cartRoutes = require("./js/routes/cartRoutes.js");
const userCartRoutes = require("./js/routes/userCartRoutes.js");

const app = express();

// Rutas API (deben ir ANTES de los archivos estáticos)
app.use("/api/cats_products", catsProductRoutes);
app.use("/api/products_comments", commentsRoutes);
app.use("/api/user_cart", userCartRoutes);
app.use("/api/cats", categoriesRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Servir archivos estáticos (HTML, CSS, JS, imágenes)
app.use(express.static(path.join(__dirname)));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});