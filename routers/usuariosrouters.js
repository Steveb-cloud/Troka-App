import express from 'express';
import { poolPromise } from '../config/db.js';

const router = express.Router();

router.get('/usuarios', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Usuarios');
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Error al obtener usuarios:', err);
        res.status(500).send(err.message);
    }
});

export default router;
