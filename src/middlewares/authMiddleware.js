const jwt = require('jsonwebtoken');
const { obterSegredoJwt } = require('../config/jwt');

const autenticarToken = (req, res, next) => {
    const cabecalhoAutenticacao = req.headers.authorization;

    if (!cabecalhoAutenticacao) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const partes = cabecalhoAutenticacao.split(' ');
    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Token mal formatado. Use: Bearer <token>' });
    }

    const token = partes[1];

    try {
        const decodificado = jwt.verify(token, obterSegredoJwt());
        req.user = decodificado;
        return next();
    } catch (err) {
        if (err.message === 'JWT_SECRET não configurado') {
            return res.status(500).json({ error: err.message });
        }
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

module.exports = autenticarToken;
