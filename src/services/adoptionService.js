const AdoptionModel = require('../models/adoptionModel');
const PetModel = require('../models/petModel');
const db = require('../config/database');

const AdoptionService = {
    async getAll() {
        return await AdoptionModel.findAll();
    },

    async adopt(userId, petId) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const pet = await PetModel.findById(petId, connection);
            if (!pet) {
                throw new Error('Pet não encontrado');
            }

            if (pet.status !== 'available') {
                throw new Error('Pet não está disponível para adoção');
            }

            const existingAdoption = await AdoptionModel.findByUserAndPet(userId, petId, connection);
            if (existingAdoption) {
                throw new Error('Você já adotou este pet');
            }

            const adoptionId = await AdoptionModel.create(userId, petId, connection);
            const updated = await PetModel.updateStatus(petId, 'adopted', connection);
            if (!updated) {
                throw new Error('Erro ao atualizar status do pet');
            }

            await connection.commit();

            return await AdoptionModel.findById(adoptionId, connection);
        } catch (error) {
            await connection.rollback();

            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Você já adotou este pet');
            }

            throw error;
        } finally {
            connection.release();
        }
    },
};

module.exports = AdoptionService;
