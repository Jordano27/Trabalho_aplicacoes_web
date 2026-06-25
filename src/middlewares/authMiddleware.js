const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/jwt');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Token mal formatado. Use: Bearer <token>' });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, getJwtSecret());
        req.user = decoded;
        return next();
    } catch (err) {
        if (err.message === 'JWT_SECRET não configurado') {
            return res.status(500).json({ error: err.message });
        }
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

module.exports = authMiddleware;
