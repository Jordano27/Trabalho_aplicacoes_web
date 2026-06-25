const AuthService = require('../services/authService');

const AuthController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            const result = await AuthService.login(email, password);
            return res.status(200).json(result);
        } catch (error) {
            if (error.message === 'JWT_SECRET não configurado') {
                return res.status(500).json({ error: error.message });
            }
            return res.status(401).json({ error: error.message });
        }
    },
};

module.exports = AuthController;
