import { Router } from 'express';
import { login, logout, getPerfil } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddlewares.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/perfil', authMiddleware, getPerfil); // Protegido

export default router;

