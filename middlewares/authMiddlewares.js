import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config/config.js';

export const authMiddleware = (req, res, next) => {
    req.session = { user: null };

    const token = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso no permitido. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, PRIVATE_KEY);
        req.session.user = decoded.nombre; // Guardamos el nombre como en el ejemplo del profe
        req.userId = decoded.id_usuario;   // Mantienes compatibilidad con tu código actual
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
};
