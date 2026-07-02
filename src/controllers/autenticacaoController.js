const autenticacaoService = require('../services/autenticacaoService');

const autenticacaoController = {
    entrar(req, res) {
        return autenticacaoController.login(req, res);
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            const resultado = await autenticacaoService.entrar(email, password);
            return res.status(200).json(resultado);
        } catch (error) {
            if (error.message === 'JWT_SECRET não configurado') {
                return res.status(500).json({ error: error.message });
            }
            return res.status(401).json({ error: error.message });
        }
    },
};

module.exports = autenticacaoController;
