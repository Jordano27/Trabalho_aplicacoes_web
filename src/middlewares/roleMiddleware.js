const validarPapel = (...papeisPermitidos) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        if (!papeisPermitidos.includes(req.user.role)) {
            return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente' });
        }

        return next();
    };
};

module.exports = validarPapel;
