import { poolPromise } from '../config/db.js';

export const agregarAmigo = async (req, res) => {
    const { id_usuario, id_amigo } = req.body;

    if (!id_usuario || !id_amigo) {
        return res.status(400).json({ error: 'Faltan datos: id_usuario o id_amigo' });
    }

    if (id_usuario === id_amigo) {
        return res.status(400).json({ error: 'No puedes agregarte a ti mismo como amigo' });
    }

    try {
        const pool = await poolPromise;

        // Verificar si ya son amigos
        const check = await pool.request()
            .input('id_usuario', id_usuario)
            .input('id_amigo', id_amigo)
            .query(`
                SELECT * FROM amigos 
                WHERE (usuario_id1 = @id_usuario AND usuario_id2 = @id_amigo)
                   OR (usuario_id1 = @id_amigo AND usuario_id2 = @id_usuario)
            `);

        if (check.recordset.length > 0) {
            return res.status(409).json({ error: 'Ya son amigos' });
        }

        // Insertar nueva relación
        await pool.request()
            .input('usuario_id1', id_usuario)
            .input('usuario_id2', id_amigo)
            .query(`
                INSERT INTO amigos (usuario_id1, usuario_id2)
                VALUES (@usuario_id1, @usuario_id2)
            `);

        res.status(201).json({ mensaje: 'Amigo agregado correctamente' });
    } catch (err) {
        console.error('❌ Error al agregar amigo:', err);
        res.status(500).json({ error: 'Error en el servidor al agregar amigo' });
    }
};

export const eliminarAmigo = async (req, res) => {
    const { id_usuario, id_amigo } = req.body;

    if (!id_usuario || !id_amigo) {
        return res.status(400).json({ error: 'Faltan datos: id_usuario o id_amigo' });
    }

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('id_usuario', id_usuario)
            .input('id_amigo', id_amigo)
            .query(`
                DELETE FROM amigos
                WHERE (usuario_id1 = @id_usuario AND usuario_id2 = @id_amigo)
                   OR (usuario_id1 = @id_amigo AND usuario_id2 = @id_usuario)
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ mensaje: 'No se encontró la amistad' });
        }

        res.json({ mensaje: 'Amigo eliminado correctamente' });
    } catch (err) {
        console.error('❌ Error al eliminar amigo:', err);
        res.status(500).json({ error: 'Error en el servidor al eliminar amigo' });
    }
};

export const getAmigos = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('id_usuario', id_usuario)
            .query(`
                SELECT u.id_usuario, u.nombre, u.email
                FROM amigos a
                JOIN usuarios u ON (u.id_usuario = a.usuario_id2 AND a.usuario_id1 = @id_usuario)
                                OR (u.id_usuario = a.usuario_id1 AND a.usuario_id2 = @id_usuario)
            `);

        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Error al obtener amigos:', err);
        res.status(500).json({ error: 'Error al obtener amigos' });
    }
};

