const express = require("express");
const path = require("path");
const categoriesRoutes = require("./js/routes/categoriesRoutes.js");
const catsProductRoutes = require("./js/routes/cats_ProductRoutes.js");
const productRoutes = require("./js/routes/productRoutes.js");
const commentsRoutes = require("./js/routes/commentsRoutes.js");
const cartRoutes = require("./js/routes/cartRoutes.js");
const userCartRoutes = require("./js/routes/userCartRoutes.js");
const authRoutes = require("./js/routes/authRoutes.js");
const verifyToken = require("./js/middleware/authMiddleware.js");

const app = express();

// Middleware para parsear JSON en el body de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas públicas (sin autenticación)
app.use("/api/login", authRoutes);

// Rutas protegidas (requieren autenticación)
app.use("/api/cats_products", verifyToken, catsProductRoutes);
app.use("/api/products_comments", verifyToken, commentsRoutes);
app.use("/api/user_cart", verifyToken, userCartRoutes);
app.use("/api/cats", verifyToken, categoriesRoutes);
app.use("/api/products", verifyToken, productRoutes);
app.use("/api/cart", verifyToken, cartRoutes);

// Servir archivos estáticos (HTML, CSS, JS, imágenes)
app.use(express.static(path.join(__dirname)));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});