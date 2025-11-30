const jwt = require("jsonwebtoken");

// Debe ser la misma clave secreta usada en authRoutes.js
const SECRET_KEY = "tu_clave_secreta_super_segura";

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    // Obtener el token del header Authorization
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
        return res.status(403).json({
            error: "Token no proporcionado",
            message: "Se requiere autenticación para acceder a este recurso"
        });
    }

    // El token viene en formato: "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).json({
            error: "Formato de token inválido",
            message: "El token debe enviarse como: Bearer <token>"
        });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // Agregar la información del usuario al request
        req.user = decoded;
        
        // Continuar con la siguiente función
        next();
    } catch (error) {
        return res.status(401).json({
            error: "Token inválido o expirado",
            message: "Por favor, inicie sesión nuevamente"
        });
    }
};

module.exports = verifyToken;
