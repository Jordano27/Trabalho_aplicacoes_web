const usuarioService = require('../services/usuarioService');

const usuarioController = {
    listar(req, res) {
        return usuarioController.getAll(req, res);
    },

    buscarPorId(req, res) {
        return usuarioController.getById(req, res);
    },

    criar(req, res) {
        return usuarioController.create(req, res);
    },

    atualizar(req, res) {
        return usuarioController.update(req, res);
    },

    remover(req, res) {
        return usuarioController.delete(req, res);
    },

    async getAll(req, res) {
        try {
            const usuarios = await usuarioService.listar();
            return res.status(200).json(usuarios);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const { userId: idUsuarioToken, role: papel } = req.user;

            if (papel !== 'admin' && idUsuarioToken !== parseInt(id, 10)) {
                return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente' });
            }

            const usuario = await usuarioService.buscarPorId(id);
            return res.status(200).json(usuario);
        } catch (error) {
            if (error.message === 'Usuário não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const usuario = await usuarioService.criar(req.body);
            return res.status(201).json(usuario);
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
            const { userId: idUsuarioToken, role: papel } = req.user;

            if (papel !== 'admin' && idUsuarioToken !== parseInt(id, 10)) {
                return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente' });
            }

            const usuario = await usuarioService.atualizar(id, req.body, papel);
            return res.status(200).json(usuario);
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
            const resultado = await usuarioService.remover(id);
            return res.status(200).json(resultado);
        } catch (error) {
            if (error.message === 'Usuário não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    },
};

module.exports = usuarioController;
