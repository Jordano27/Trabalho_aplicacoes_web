const adocaoService = require('../services/adocaoService');

const adocaoController = {
    listar(req, res) {
        return adocaoController.getAll(req, res);
    },

    adotar(req, res) {
        return adocaoController.adopt(req, res);
    },

    async getAll(req, res) {
        try {
            const adocoes = await adocaoService.listar();
            return res.status(200).json(adocoes);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async adopt(req, res) {
        try {
            const { userId: idUsuario } = req.user;
            const { pet_id: idPet } = req.body;

            if (!idPet) {
                return res.status(400).json({ error: 'pet_id é obrigatório' });
            }

            const adocao = await adocaoService.adotar(idUsuario, parseInt(idPet, 10));
            return res.status(201).json(adocao);
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

module.exports = adocaoController;
