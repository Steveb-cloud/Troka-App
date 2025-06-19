import express from 'express';
import { poolPromise } from '../config/db.js';

const router = express.Router();

// Obtener todas las publicaciones
router.get('/publicaciones', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
          SELECT 
            p.id_publicacion,
            p.titulo,
            p.descripcion,
            p.categoria_id,
            c.nombre AS nombre_categoria,
            p.id_usuario,
            u.nombre AS nombre_usuario
          FROM publicaciones p
          JOIN categorias c ON c.id_categoria = p.categoria_id
          JOIN usuarios u ON u.id_usuario = p.id_usuario
        `);
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

// Obtener publicaciones de un usuario específico
// Obtener publicaciones de un usuario que NO estén en trueques pendientes o aceptados
router.get('/publicaciones/usuario/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_usuario', id_usuario)
            .query(`
                SELECT
                    p.id_publicacion,
                    p.titulo,
                    p.descripcion,
                    p.categoria_id,
                    c.nombre AS nombre_categoria,
                    p.estado,
                    p.imagen_url
                FROM Publicaciones p
                         JOIN Categorias c ON c.id_categoria = p.categoria_id
                WHERE p.id_usuario = @id_usuario
                  AND p.id_publicacion NOT IN (
                    SELECT id_publicacion1
                    FROM Trueques
                    WHERE estado IN ('pendiente', 'aceptado')
                )
                ORDER BY p.id_publicacion DESC
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Error al obtener publicaciones del usuario:', err);
        res.status(500).send(err.message);
    }
});



// Obtener publicaciones por categoría
router.get('/publicaciones/categoria/:id_categoria', async (req, res) => {
    const { id_categoria } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('categoria_id', id_categoria)
            .query(`
              SELECT 
                p.id_publicacion,
                p.titulo,
                p.descripcion,
                p.categoria_id,
                c.nombre AS nombre_categoria,
                p.id_usuario,
                u.nombre AS nombre_usuario
              FROM publicaciones p
              JOIN categorias c ON c.id_categoria = p.categoria_id
              JOIN usuarios u ON u.id_usuario = p.id_usuario
              WHERE p.categoria_id = @categoria_id
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Error al filtrar por categoría:', err);
        res.status(500).send(err.message);
    }
});



export default router;
