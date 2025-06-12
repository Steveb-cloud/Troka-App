import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { poolPromise, sql } from '../config/db.js';
import { PRIVATE_KEY } from '../config/config.js';

export const login = async (req, res) => {
    const { usuario, password } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('usuario', sql.VarChar, usuario)
            .query(`
                SELECT * FROM Usuarios
                WHERE nombre = @usuario OR email = @usuario
            `);

        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const passwordValida = await bcrypt.compare(password, user.password);
        if (!passwordValida) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id_usuario: user.id_usuario, nombre: user.nombre },
            PRIVATE_KEY,
            { expiresIn: '2h' }
        );

        // Opcional: guardar token como cookie HttpOnly
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: false, // true si estás en HTTPS
            sameSite: 'strict',
            maxAge: 2 * 60 * 60 * 1000 // 2 horas
        });

        res.json({ message: 'Login exitoso', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getPerfil = async (req, res) => {
    const id_usuario = req.userId;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id_usuario)
            .query(`SELECT id_usuario, nombre, email FROM Usuarios WHERE id_usuario = @id`);

        const usuario = result.recordset[0];

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el perfil' });
    }
};

export const logout = (req, res) => {
    res.clearCookie('access_token');
    res.json({ message: 'Sesión cerrada correctamente' });
};
