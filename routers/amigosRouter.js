import express from 'express';
import { getAmigos, agregarAmigo, eliminarAmigo } from '../controllers/amigosController.js';

const router = express.Router();

router.get('/amigos/:id_usuario', getAmigos);
router.post('/amigos', agregarAmigo);
router.delete('/amigos', eliminarAmigo);

export default router;
