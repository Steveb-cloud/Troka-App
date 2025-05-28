import express from 'express';
import { sql, poolPromise } from '../config/db.js';

const router = express.Router();

router.get('/usuarios', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Usuarios');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default router;

