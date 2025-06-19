import express from 'express';
import { poolPromise } from '../config/db.js';

const router = express.Router();

router.get('/trueques', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
      SELECT 
        t.id_trueque,
        t.id_usuario1,
        u1.nombre AS nombre_usuario1,
        t.id_usuario2,
        u2.nombre AS nombre_usuario2,
        t.id_publicacion1,
        p1.titulo AS titulo_publicacion1,
        t.id_publicacion2,
        p2.titulo AS titulo_publicacion2,
        t.estado
      FROM Trueques t
      JOIN Usuarios u1 ON t.id_usuario1 = u1.id_usuario
      JOIN Usuarios u2 ON t.id_usuario2 = u2.id_usuario
      JOIN Publicaciones p1 ON t.id_publicacion1 = p1.id_publicacion
      JOIN Publicaciones p2 ON t.id_publicacion2 = p2.id_publicacion
    `);
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Error al obtener trueques:', err);
        res.status(500).send(err.message);
    }
});


router.post('/trueques', async (req, res) => {
    const { id_usuario1, id_usuario2, id_publicacion1, id_publicacion2, estado } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id_usuario1', id_usuario1)
            .input('id_usuario2', id_usuario2)
            .input('id_publicacion1', id_publicacion1)
            .input('id_publicacion2', id_publicacion2)
            .input('estado', estado)
            .query(`
                INSERT INTO Trueques 
                (id_usuario1, id_usuario2, id_publicacion1, id_publicacion2, estado) 
                VALUES (@id_usuario1, @id_usuario2, @id_publicacion1, @id_publicacion2, @estado)
            `);
        res.send('✅ Trueque registrado');
    } catch (err) {
        console.error('❌ Error al crear trueque:', err);
        res.status(500).send(err.message);
    }
});

router.get('/trueques/pendientes/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_usuario', id_usuario)
            .query(`
        SELECT * FROM Trueques
        WHERE (id_usuario1 = @id_usuario OR id_usuario2 = @id_usuario)
          AND estado = 'pendiente'
      `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/trueques/:id_trueque', async (req, res) => {
    const { id_trueque } = req.params;
    const { estado } = req.body; // Aquí se envía "confirmado" o "rechazado"

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id_trueque', id_trueque)
            .input('estado', estado)
            .query(`
        UPDATE Trueques
        SET estado = @estado
        WHERE id_trueque = @id_trueque
      `);
        res.send(`Trueque ${estado} correctamente`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/trueques/:id', async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', id)
            .input('estado', estado)
            .query(`
        UPDATE Trueques 
        SET estado = @estado 
        WHERE id_trueque = @id
      `);
        res.send('✅ Estado del trueque actualizado');
    } catch (err) {
        console.error('❌ Error al actualizar estado del trueque:', err);
        res.status(500).send(err.message);
    }
});


export default router;
