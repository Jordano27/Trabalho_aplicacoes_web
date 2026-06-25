const PetModel = require('../../../src/models/petModel');
const PetService = require('../../../src/services/petService');

jest.mock('../../../src/models/petModel');

describe('PetService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockPet = {
        id: 1,
        name: 'Rex',
        age: 3,
        species: 'dog',
        size: 'medium',
        status: 'available',
        description: 'Cão amigável',
    };

    const mockAdoptedPet = { ...mockPet, id: 2, status: 'adopted' };

    // ----------------------------------------------------------------
    describe('getAll', () => {
        it('deve retornar todos os pets', async () => {
            PetModel.findAll.mockResolvedValue([mockPet, mockAdoptedPet]);

            const result = await PetService.getAll();

            expect(result).toHaveLength(2);
            expect(PetModel.findAll).toHaveBeenCalledTimes(1);
        });
    });

    // ----------------------------------------------------------------
    describe('getAvailable', () => {
        it('deve retornar apenas pets disponíveis', async () => {
            PetModel.findAvailable.mockResolvedValue([mockPet]);

            const result = await PetService.getAvailable();

            expect(result).toEqual([mockPet]);
            expect(PetModel.findAvailable).toHaveBeenCalledTimes(1);
        });
    });

    // ----------------------------------------------------------------
    describe('getById', () => {
        it('deve retornar o pet quando encontrado', async () => {
            PetModel.findById.mockResolvedValue(mockPet);

            const result = await PetService.getById(1);

            expect(result).toEqual(mockPet);
        });

        it('deve lançar erro quando o pet não for encontrado', async () => {
            PetModel.findById.mockResolvedValue(null);

            await expect(PetService.getById(999)).rejects.toThrow('Pet não encontrado');
        });
    });

    // ----------------------------------------------------------------
    describe('create', () => {
        const petData = { name: 'Mimi', species: 'cat', size: 'small', age: 2 };

        it('deve criar o pet e retorná-lo', async () => {
            PetModel.create.mockResolvedValue(3);
            PetModel.findById.mockResolvedValue({ ...petData, id: 3, status: 'available' });

            const result = await PetService.create(petData);

            expect(PetModel.create).toHaveBeenCalledWith(petData);
            expect(result.id).toBe(3);
        });

        it('deve lançar erro quando campos obrigatórios estiverem faltando', async () => {
            await expect(PetService.create({ name: 'Sem especie' })).rejects.toThrow(
                'Nome, espécie e porte são obrigatórios'
            );
        });

        it('deve lançar erro quando o porte for inválido', async () => {
            await expect(
                PetService.create({ name: 'Pet', species: 'dog', size: 'gigante' })
            ).rejects.toThrow('Porte inválido. Use: small, medium ou large');
        });

        it('deve aceitar todos os portes válidos', async () => {
            for (const size of ['small', 'medium', 'large']) {
                PetModel.create.mockResolvedValue(1);
                PetModel.findById.mockResolvedValue({ ...petData, size, id: 1, status: 'available' });

                await expect(
                    PetService.create({ name: 'Pet', species: 'dog', size })
                ).resolves.toBeDefined();
            }
        });
    });

    // ----------------------------------------------------------------
    describe('update', () => {
        it('deve atualizar e retornar o pet', async () => {
            PetModel.findById
                .mockResolvedValueOnce(mockPet)
                .mockResolvedValueOnce({ ...mockPet, name: 'Rex Atualizado' });
            PetModel.update.mockResolvedValue(true);

            const result = await PetService.update(1, { name: 'Rex Atualizado' });

            expect(result.name).toBe('Rex Atualizado');
        });

        it('deve lançar erro quando o pet não for encontrado', async () => {
            PetModel.findById.mockResolvedValue(null);

            await expect(PetService.update(999, { name: 'x' })).rejects.toThrow(
                'Pet não encontrado'
            );
        });

        it('deve lançar erro quando o porte atualizado for inválido', async () => {
            PetModel.findById.mockResolvedValue(mockPet);

            await expect(PetService.update(1, { size: 'enorme' })).rejects.toThrow(
                'Porte inválido. Use: small, medium ou large'
            );
        });

        it('deve lançar erro quando o status atualizado for inválido', async () => {
            PetModel.findById.mockResolvedValue(mockPet);

            await expect(PetService.update(1, { status: 'perdido' })).rejects.toThrow(
                'Status inválido. Use: available ou adopted'
            );
        });
    });

    // ----------------------------------------------------------------
    describe('delete', () => {
        it('deve remover o pet disponível com sucesso', async () => {
            PetModel.findById.mockResolvedValue(mockPet);
            PetModel.delete.mockResolvedValue(true);

            const result = await PetService.delete(1);

            expect(result).toEqual({ message: 'Pet removido com sucesso' });
        });

        it('deve lançar erro quando o pet não for encontrado', async () => {
            PetModel.findById.mockResolvedValue(null);

            await expect(PetService.delete(999)).rejects.toThrow('Pet não encontrado');
        });

        it('deve lançar erro quando tentar remover pet adotado', async () => {
            PetModel.findById.mockResolvedValue(mockAdoptedPet);

            await expect(PetService.delete(2)).rejects.toThrow(
                'Não é possível remover um pet adotado'
            );
        });

        it('deve lançar erro quando a exclusão falhar no banco', async () => {
            PetModel.findById.mockResolvedValue(mockPet);
            PetModel.delete.mockResolvedValue(false);

            await expect(PetService.delete(1)).rejects.toThrow('Erro ao remover pet');
        });
    });
});
