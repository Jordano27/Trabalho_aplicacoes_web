const PetService = require('../services/petService');

const PetController = {
    async getAll(req, res) {
        try {
            const pets = await PetService.getAll();
            return res.status(200).json(pets);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getAvailable(req, res) {
        try {
            const pets = await PetService.getAvailable();
            return res.status(200).json(pets);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const pet = await PetService.getById(id);
            return res.status(200).json(pet);
        } catch (error) {
            if (error.message === 'Pet não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const pet = await PetService.create(req.body);
            return res.status(201).json(pet);
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
            const pet = await PetService.update(id, req.body);
            return res.status(200).json(pet);
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
            const result = await PetService.delete(id);
            return res.status(200).json(result);
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

module.exports = PetController;
