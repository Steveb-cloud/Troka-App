import express from 'express';
import { poolPromise } from '../config/db.js';

const router = express.Router();

router.get('/reputaciones', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Reputaciones');
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Error al obtener reputaciones:', err);
        res.status(500).send(err.message);
    }
});

router.post('/reputaciones', async (req, res) => {
    const { id_trueque, id_usuario_calificado, id_usuario_calificador, puntuacion, comentario } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id_trueque', id_trueque || null)
            .input('id_usuario_calificado', id_usuario_calificado)
            .input('id_usuario_calificador', id_usuario_calificador)
            .input('puntuacion', puntuacion)
            .input('comentario', comentario)
            .query(`
                INSERT INTO Reputaciones 
                (id_trueque, id_usuario_calificado, id_usuario_calificador, puntuacion, comentario) 
                VALUES (@id_trueque, @id_usuario_calificado, @id_usuario_calificador, @puntuacion, @comentario)
            `);
        res.send('✅ Reputación registrada');
    } catch (err) {
        console.error('❌ Error al registrar reputación:', err);
        res.status(500).send(err.message);
    }
});

export default router;
