const PetModel = require('../models/petModel');

const VALID_SIZES = ['small', 'medium', 'large'];
const VALID_STATUSES = ['available', 'adopted'];

const PetService = {
    async getAll() {
        return await PetModel.findAll();
    },

    async getAvailable() {
        return await PetModel.findAvailable();
    },

    async getById(id) {
        const pet = await PetModel.findById(id);
        if (!pet) {
            throw new Error('Pet não encontrado');
        }
        return pet;
    },

    async create(petData) {
        const { name, species, size } = petData;

        if (!name || !species || !size) {
            throw new Error('Nome, espécie e porte são obrigatórios');
        }

        if (!VALID_SIZES.includes(size)) {
            throw new Error('Porte inválido. Use: small, medium ou large');
        }

        const id = await PetModel.create(petData);
        return await PetModel.findById(id);
    },

    async update(id, petData) {
        const pet = await PetModel.findById(id);
        if (!pet) {
            throw new Error('Pet não encontrado');
        }

        if (petData.size && !VALID_SIZES.includes(petData.size)) {
            throw new Error('Porte inválido. Use: small, medium ou large');
        }

        if (petData.status && !VALID_STATUSES.includes(petData.status)) {
            throw new Error('Status inválido. Use: available ou adopted');
        }

        await PetModel.update(id, petData);
        return await PetModel.findById(id);
    },

    async delete(id) {
        const pet = await PetModel.findById(id);
        if (!pet) {
            throw new Error('Pet não encontrado');
        }

        if (pet.status === 'adopted') {
            throw new Error('Não é possível remover um pet adotado');
        }

        const deleted = await PetModel.delete(id);
        if (!deleted) {
            throw new Error('Erro ao remover pet');
        }

        return { message: 'Pet removido com sucesso' };
    },
};

module.exports = PetService;
