import express from 'express';
import { poolPromise } from '../config/db.js';

const router = express.Router();

// Obtener todas las publicaciones
router.get('/publicaciones', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Publicaciones');
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Error al obtener publicaciones:', err);
        res.status(500).send(err.message);
    }
});

// Crear una nueva publicación
router.post('/publicaciones', async (req, res) => {
    const { id_usuario, titulo, descripcion, categoria_id, estado, imagen_url } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id_usuario', id_usuario)
            .input('titulo', titulo)
            .input('descripcion', descripcion)
            .input('categoria_id', categoria_id)
            .input('estado', estado)
            .input('imagen_url', imagen_url)
            .query(`
                INSERT INTO Publicaciones 
                (id_usuario, titulo, descripcion, categoria_id, estado, imagen_url) 
                VALUES (@id_usuario, @titulo, @descripcion, @categoria_id, @estado, @imagen_url)
            `);
        res.send('✅ Publicación creada');
    } catch (err) {
        console.error('❌ Error al crear publicación:', err);
        res.status(500).send(err.message);
    }
});

export default router;
