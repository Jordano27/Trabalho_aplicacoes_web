const adocaoModel = require('../models/adocaoModel');
const animalModel = require('../models/animalModel');
const banco = require('../config/database');

const adocaoService = {
    getAll() {
        return adocaoService.listar();
    },

    adopt(idUsuario, idPet) {
        return adocaoService.adotar(idUsuario, idPet);
    },

    async listar() {
        return await adocaoModel.listarTodas();
    },

    async adotar(idUsuario, idPet) {
        const conexao = await banco.getConnection();

        try {
            await conexao.beginTransaction();

            const animal = await animalModel.buscarPorId(idPet, conexao);
            if (!animal) {
                throw new Error('Pet não encontrado');
            }

            if (animal.status !== 'available') {
                throw new Error('Pet não está disponível para adoção');
            }

            const adocaoExistente = await adocaoModel.buscarPorUsuarioEPet(
                idUsuario,
                idPet,
                conexao
            );
            if (adocaoExistente) {
                throw new Error('Você já adotou este pet');
            }

            const idAdocao = await adocaoModel.criar(idUsuario, idPet, conexao);
            const atualizado = await animalModel.atualizarStatus(idPet, 'adopted', conexao);
            if (!atualizado) {
                throw new Error('Erro ao atualizar status do pet');
            }

            await conexao.commit();

            return await adocaoModel.buscarPorId(idAdocao, conexao);
        } catch (error) {
            await conexao.rollback();

            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Você já adotou este pet');
            }

            throw error;
        } finally {
            conexao.release();
        }
    },
};

module.exports = adocaoService;
