const jwt = require("jsonwebtoken");
const path = require("path");

// Clave secreta para firmar el token
const SECRET_KEY = "tu_clave_secreta_super_segura";

// Cargar usuarios desde el archivo JSON
const getUsersData = () => {
    const filePath = path.join(__dirname, "../data/users/users.json");
    delete require.cache[require.resolve(filePath)];
    return require(filePath);
};

// Buscar usuario por username o email
const findUser = (identifier) => {
    const users = getUsersData();
    return users.find(user => 
        user.username === identifier || user.email === identifier
    );
};

// Validar credenciales
const validateCredentials = (user, password) => {
    if (!user) {
        return { valid: false, message: "Usuario no encontrado" };
    }

    if (!user.active) {
        return { valid: false, message: "Usuario inactivo. Contacte al administrador" };
    }

    if (user.password !== password) {
        return { valid: false, message: "Contraseña incorrecta" };
    }

    return { valid: true };
};

// Controlador para el login
const login = (req, res) => {
    const { username, password } = req.body;

    // Validar que se enviaron usuario y contraseña
    if (!username || !password) {
        return res.status(400).json({ 
            error: "Usuario/Email y contraseña son requeridos" 
        });
    }

    // Buscar usuario (puede ser username o email)
    const user = findUser(username);

    // Validar credenciales
    const validation = validateCredentials(user, password);

    if (!validation.valid) {
        return res.status(401).json({
            success: false,
            error: validation.message
        });
    }

    // Generar token JWT
    const token = jwt.sign(
        { 
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        SECRET_KEY,
        { expiresIn: "24h" }
    );

    return res.json({
        success: true,
        message: "Login exitoso",
        token: token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
};

module.exports = {
    login
};
