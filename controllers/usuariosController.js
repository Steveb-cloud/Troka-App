import bcrypt from 'bcrypt';
import { poolPromise } from '../config/db.js';

export const getUsuarios = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Usuarios');
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Error al obtener usuarios:', err);
        res.status(500).send(err.message);
    }
};

export const getUsuarioPorId = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('id', req.params.id)
            .query('SELECT * FROM Usuarios WHERE id_usuario = @id');

        if (result.recordset.length === 0)
            return res.status(404).send('Usuario no encontrado');

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('❌ Error al obtener usuario por ID:', err);
        res.status(500).send(err.message);
    }
};

export const crearUsuario = async (req, res) => {
    const { nombre, email, password, ubicacion } = req.body;
    try {
        const pool = await poolPromise;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await pool.request()
            .input('nombre', nombre)
            .input('email', email)
            .input('password', hashedPassword)
            .input('ubicacion', ubicacion)
            .query(`INSERT INTO Usuarios (nombre, email, password, ubicacion)
                    VALUES (@nombre, @email, @password, @ubicacion)`);

        res.status(201).send('Usuario creado correctamente');
    } catch (err) {
        console.error('❌ Error al crear usuario:', err);
        res.status(500).send(err.message);
    }
};

export const actualizarUsuario = async (req, res) => {
    const { nombre, email, password, ubicacion } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', req.params.id)
            .input('nombre', nombre)
            .input('email', email)
            .input('password', password)
            .input('ubicacion', ubicacion)
            .query(`UPDATE Usuarios SET 
                        nombre = @nombre, 
                        email = @email, 
                        password = @password, 
                        ubicacion = @ubicacion
                    WHERE id_usuario = @id`);
        res.send('Usuario actualizado');
    } catch (err) {
        console.error('❌ Error al actualizar usuario:', err);
        res.status(500).send(err.message);
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', req.params.id)
            .query('DELETE FROM Usuarios WHERE id_usuario = @id');
        res.send('Usuario eliminado');
    } catch (err) {
        console.error('❌ Error al eliminar usuario:', err);
        res.status(500).send(err.message);
    }
};
