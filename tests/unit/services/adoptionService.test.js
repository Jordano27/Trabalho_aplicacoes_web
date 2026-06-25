const AdoptionModel = require('../../../src/models/adoptionModel');
const PetModel = require('../../../src/models/petModel');
const db = require('../../../src/config/database');
const AdoptionService = require('../../../src/services/adoptionService');

jest.mock('../../../src/models/adoptionModel');
jest.mock('../../../src/models/petModel');
jest.mock('../../../src/config/database', () => ({
    getConnection: jest.fn(),
}));

describe('AdoptionService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        db.getConnection.mockResolvedValue({
            beginTransaction: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn(),
            release: jest.fn(),
        });
    });

    const mockPet = { id: 1, name: 'Rex', status: 'available' };
    const mockAdoptedPet = { id: 2, name: 'Mimi', status: 'adopted' };
    const mockAdoption = {
        id: 1,
        user_id: 5,
        pet_id: 1,
        adoption_date: '2026-06-02',
        user_name: 'João',
        pet_name: 'Rex',
    };

    // ----------------------------------------------------------------
    describe('getAll', () => {
        it('deve retornar todas as adoções', async () => {
            AdoptionModel.findAll.mockResolvedValue([mockAdoption]);

            const result = await AdoptionService.getAll();

            expect(result).toEqual([mockAdoption]);
            expect(AdoptionModel.findAll).toHaveBeenCalledTimes(1);
        });
    });

    // ----------------------------------------------------------------
    describe('adopt', () => {
        it('deve realizar adoção com sucesso e retornar o registro', async () => {
            PetModel.findById.mockResolvedValue(mockPet);
            AdoptionModel.findByUserAndPet.mockResolvedValue(null);
            AdoptionModel.create.mockResolvedValue(1);
            PetModel.updateStatus.mockResolvedValue(true);
            AdoptionModel.findById.mockResolvedValue(mockAdoption);

            const result = await AdoptionService.adopt(5, 1);

            expect(AdoptionModel.create).toHaveBeenCalledWith(5, 1, expect.any(Object));
            expect(PetModel.updateStatus).toHaveBeenCalledWith(1, 'adopted', expect.any(Object));
            expect(result).toEqual(mockAdoption);
        });

        it('deve lançar erro quando o pet não for encontrado', async () => {
            PetModel.findById.mockResolvedValue(null);

            await expect(AdoptionService.adopt(5, 999)).rejects.toThrow('Pet não encontrado');
        });

        it('deve lançar erro quando o pet não estiver disponível', async () => {
            PetModel.findById.mockResolvedValue(mockAdoptedPet);

            await expect(AdoptionService.adopt(5, 2)).rejects.toThrow(
                'Pet não está disponível para adoção'
            );
        });

        it('deve lançar erro quando o usuário já tiver adotado o mesmo pet', async () => {
            PetModel.findById.mockResolvedValue(mockPet);
            AdoptionModel.findByUserAndPet.mockResolvedValue(mockAdoption);

            await expect(AdoptionService.adopt(5, 1)).rejects.toThrow('Você já adotou este pet');
        });

        it('deve atualizar o status do pet para "adopted" após adoção', async () => {
            PetModel.findById.mockResolvedValue(mockPet);
            AdoptionModel.findByUserAndPet.mockResolvedValue(null);
            AdoptionModel.create.mockResolvedValue(1);
            PetModel.updateStatus.mockResolvedValue(true);
            AdoptionModel.findById.mockResolvedValue(mockAdoption);

            await AdoptionService.adopt(5, 1);

            expect(PetModel.updateStatus).toHaveBeenCalledWith(1, 'adopted', expect.any(Object));
        });

        it('não deve chamar updateStatus quando a criação da adoção falhar', async () => {
            PetModel.findById.mockResolvedValue(mockPet);
            AdoptionModel.findByUserAndPet.mockResolvedValue(null);
            AdoptionModel.create.mockRejectedValue(new Error('DB error'));

            await expect(AdoptionService.adopt(5, 1)).rejects.toThrow('DB error');
            expect(PetModel.updateStatus).not.toHaveBeenCalled();
        });

        it('deve fazer rollback e liberar conexão quando houver erro', async () => {
            const connection = {
                beginTransaction: jest.fn(),
                commit: jest.fn(),
                rollback: jest.fn(),
                release: jest.fn(),
            };
            db.getConnection.mockResolvedValue(connection);
            PetModel.findById.mockRejectedValue(new Error('DB error'));

            await expect(AdoptionService.adopt(5, 1)).rejects.toThrow('DB error');

            expect(connection.rollback).toHaveBeenCalled();
            expect(connection.release).toHaveBeenCalled();
        });

        it('deve fazer rollback quando falhar ao atualizar o status do pet', async () => {
            const connection = {
                beginTransaction: jest.fn(),
                commit: jest.fn(),
                rollback: jest.fn(),
                release: jest.fn(),
            };
            db.getConnection.mockResolvedValue(connection);
            PetModel.findById.mockResolvedValue(mockPet);
            AdoptionModel.findByUserAndPet.mockResolvedValue(null);
            AdoptionModel.create.mockResolvedValue(1);
            PetModel.updateStatus.mockResolvedValue(false);

            await expect(AdoptionService.adopt(5, 1)).rejects.toThrow(
                'Erro ao atualizar status do pet'
            );

            expect(connection.rollback).toHaveBeenCalled();
            expect(connection.commit).not.toHaveBeenCalled();
        });
    });
});
