import express from 'express';
import { poolPromise } from '../config/db.js';

const router = express.Router();

// Obtener todas las categorías
router.get('/categorias', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Categorias');
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Error al obtener categorías:', err);
        res.status(500).send(err.message);
    }
});

// Crear una nueva categoría
router.post('/categorias', async (req, res) => {
    const { nombre } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request().input('nombre', nombre)
            .query('INSERT INTO Categorias (nombre) VALUES (@nombre)');
        res.send('✅ Categoría creada');
    } catch (err) {
        console.error('❌ Error al crear categoría:', err);
        res.status(500).send(err.message);
    }
});

export default router;
