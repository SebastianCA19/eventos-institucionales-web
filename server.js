const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("./config/db");
require("dotenv").config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());  // Para procesar JSON
app.use(express.urlencoded({ extended: true })); // Para procesar formularios
app.use(express.static(__dirname));

// Ruta de prueba
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// 📌 REGISTRO DE USUARIO
app.post("/register", async (req, res) => {
    const { codigo, correo, password, nombre, apellido, tipo_usuario } = req.body;

    // Validación de datos
    if (!codigo || !correo || !password || !nombre || !tipo_usuario) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO usuarios (codigo, correo, contrasena, nombre, apellido, id_tipo_usuario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [codigo, correo, hashedPassword, nombre, apellido, tipo_usuario]
        );

        res.status(201).json({ message: "Usuario registrado con éxito", user: result.rows[0] });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// 📌 INICIO DE SESIÓN
app.post("/login", async (req, res) => {
    const { codigo, password } = req.body;

    if (!codigo || !password) {
        return res.status(400).json({ message: "Codigo y contraseña son obligatorios" });
    }

    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE codigo = $1", [codigo]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.contrasena);

        if (!validPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        res.json({ message: "Inicio de sesión exitoso", user });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});