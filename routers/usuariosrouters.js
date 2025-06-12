import express from 'express';
import {
    getUsuarios,
    getUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} from '../controllers/usuariosController.js';

const router = express.Router();

router.get('/usuarios', getUsuarios);
router.get('/usuarios/:id', getUsuarioPorId);
router.post('/usuarios', crearUsuario);
router.put('/usuarios/:id', actualizarUsuario);
router.delete('/usuarios/:id', eliminarUsuario);

export default router;
