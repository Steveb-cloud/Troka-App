import express from 'express';
import { poolPromise } from '../config/db.js';

const router = express.Router();

router.get('/mensajes', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Mensajes');
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Error al obtener mensajes:', err);
        res.status(500).send(err.message);
    }
});

router.post('/mensajes', async (req, res) => {
    const { id_trueque, id_emisor, contenido } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id_trueque', id_trueque)
            .input('id_emisor', id_emisor)
            .input('contenido', contenido)
            .query(`
                INSERT INTO Mensajes (id_trueque, id_emisor, contenido)
                VALUES (@id_trueque, @id_emisor, @contenido)
            `);
        res.send('✅ Mensaje enviado');
    } catch (err) {
        console.error('❌ Error al enviar mensaje:', err);
        res.status(500).send(err.message);
    }
});

export default router;
