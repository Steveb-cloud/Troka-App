import express from 'express';
import { poolPromise } from '../config/db.js';

const router = express.Router();

router.get('/trueques', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Trueques');
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

export default router;
