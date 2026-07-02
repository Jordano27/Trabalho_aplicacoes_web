const animalService = require('../services/animalService');

const animalController = {
    listar(req, res) {
        return animalController.getAll(req, res);
    },

    listarDisponiveis(req, res) {
        return animalController.getAvailable(req, res);
    },

    buscarPorId(req, res) {
        return animalController.getById(req, res);
    },

    criar(req, res) {
        return animalController.create(req, res);
    },

    atualizar(req, res) {
        return animalController.update(req, res);
    },

    remover(req, res) {
        return animalController.delete(req, res);
    },

    async getAll(req, res) {
        try {
            const animais = await animalService.listar();
            return res.status(200).json(animais);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getAvailable(req, res) {
        try {
            const animais = await animalService.listarDisponiveis();
            return res.status(200).json(animais);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const animal = await animalService.buscarPorId(id);
            return res.status(200).json(animal);
        } catch (error) {
            if (error.message === 'Pet não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const animal = await animalService.criar(req.body);
            return res.status(201).json(animal);
        } catch (error) {
            if (error.message.includes('obrigatórios') || error.message.includes('inválido')) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const animal = await animalService.atualizar(id, req.body);
            return res.status(200).json(animal);
        } catch (error) {
            if (error.message === 'Pet não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('inválido')) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const resultado = await animalService.remover(id);
            return res.status(200).json(resultado);
        } catch (error) {
            if (error.message === 'Pet não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('adotado')) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    },
};

module.exports = animalController;
