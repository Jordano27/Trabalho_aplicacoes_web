const UserService = require('../services/userService');

const UserController = {
    async getAll(req, res) {
        try {
            const users = await UserService.getAll();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const { userId, role } = req.user;

            // Admin can fetch any user; adopter can only fetch their own profile
            if (role !== 'admin' && userId !== parseInt(id)) {
                return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente' });
            }

            const user = await UserService.getById(id);
            return res.status(200).json(user);
        } catch (error) {
            if (error.message === 'Usuário não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const user = await UserService.create(req.body);
            return res.status(201).json(user);
        } catch (error) {
            if (error.message === 'Email já cadastrado') {
                return res.status(409).json({ error: error.message });
            }
            if (error.message.includes('obrigatórios')) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { userId, role } = req.user;

            // Admin can update any user; adopter can only update their own profile
            if (role !== 'admin' && userId !== parseInt(id)) {
                return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente' });
            }

            const user = await UserService.update(id, req.body, role);
            return res.status(200).json(user);
        } catch (error) {
            if (error.message === 'Usuário não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === 'Email já cadastrado') {
                return res.status(409).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await UserService.delete(id);
            return res.status(200).json(result);
        } catch (error) {
            if (error.message === 'Usuário não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    },
};

module.exports = UserController;
