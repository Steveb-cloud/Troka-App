import express from 'express';
import { poolPromise } from '../config/db.js';

const router = express.Router();

router.post('/mensajes', async (req, res) => {
    const { id_emisor, id_receptor, contenido } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id_emisor', id_emisor)
            .input('id_receptor', id_receptor)
            .input('contenido', contenido)
            .query(`
                INSERT INTO Mensajes (id_emisor, id_receptor, contenido, fecha_envio)
                VALUES (@id_emisor, @id_receptor, @contenido, GETDATE())
            `);
        res.send('✅ Mensaje enviado');
    } catch (err) {
        console.error('❌ Error al enviar mensaje:', err);
        res.status(500).send(err.message);
    }
});

router.get('/mensajes/:usuario1/:usuario2', async (req, res) => {
    const { usuario1, usuario2 } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('usuario1', usuario1)
            .input('usuario2', usuario2)
            .query(`
                SELECT * FROM Mensajes 
                WHERE (id_emisor = @usuario1 AND id_receptor = @usuario2)
                   OR (id_emisor = @usuario2 AND id_receptor = @usuario1)
                ORDER BY fecha_envio
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Error al obtener mensajes:', err);
        res.status(500).send(err.message);
    }
});

// Obtener mensajes del usuario con todos sus amigos
router.get('/mensajes/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const pool = await poolPromise;

        // Consulta que obtiene mensajes del usuario con sus amigos
        const result = await pool.request()
            .input('id_usuario', id_usuario)
            .query(`
        SELECT m.id_mensaje, m.id_usuario_emisor, m.id_usuario_receptor, m.mensaje, m.fecha,
               ue.nombre AS nombre_emisor, ur.nombre AS nombre_receptor
        FROM Mensajes m
        JOIN Usuarios ue ON m.id_usuario_emisor = ue.id_usuario
        JOIN Usuarios ur ON m.id_usuario_receptor = ur.id_usuario
        WHERE (m.id_usuario_emisor = @id_usuario OR m.id_usuario_receptor = @id_usuario)
        AND EXISTS (
          SELECT 1 FROM Amigos a
          WHERE (a.usuario_id1 = @id_usuario AND a.usuario_id2 = CASE WHEN m.id_usuario_emisor = @id_usuario THEN m.id_usuario_receptor ELSE m.id_usuario_emisor END)
             OR (a.usuario_id2 = @id_usuario AND a.usuario_id1 = CASE WHEN m.id_usuario_emisor = @id_usuario THEN m.id_usuario_receptor ELSE m.id_usuario_emisor END)
        )
        ORDER BY m.fecha DESC
      `);

        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Error al obtener mensajes:', err);
        res.status(500).send(err.message);
    }
});


export default router;
