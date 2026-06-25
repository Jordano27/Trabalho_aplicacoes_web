const AdoptionService = require('../services/adoptionService');

const AdoptionController = {
    async getAll(req, res) {
        try {
            const adoptions = await AdoptionService.getAll();
            return res.status(200).json(adoptions);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async adopt(req, res) {
        try {
            const { userId } = req.user;
            const { pet_id } = req.body;

            if (!pet_id) {
                return res.status(400).json({ error: 'pet_id é obrigatório' });
            }

            const adoption = await AdoptionService.adopt(userId, parseInt(pet_id));
            return res.status(201).json(adoption);
        } catch (error) {
            if (error.message === 'Pet não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            if (
                error.message.includes('disponível') ||
                error.message.includes('já adotou')
            ) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    },
};

module.exports = AdoptionController;
