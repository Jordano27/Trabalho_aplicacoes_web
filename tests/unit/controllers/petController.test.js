const PetService = require('../../../src/services/petService');
const PetController = require('../../../src/controllers/petController');

jest.mock('../../../src/services/petService');

describe('PetController', () => {
    let req, res;

    const mockPet = {
        id: 1,
        name: 'Rex',
        species: 'dog',
        size: 'medium',
        status: 'available',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        req = { user: { userId: 1, role: 'admin' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    // ----------------------------------------------------------------
    describe('getAll', () => {
        it('deve retornar 200 com todos os pets', async () => {
            PetService.getAll.mockResolvedValue([mockPet]);

            await PetController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([mockPet]);
        });

        it('deve retornar 500 quando o service falhar', async () => {
            PetService.getAll.mockRejectedValue(new Error('DB error'));

            await PetController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ----------------------------------------------------------------
    describe('getAvailable', () => {
        it('deve retornar 200 com pets disponíveis', async () => {
            PetService.getAvailable.mockResolvedValue([mockPet]);

            await PetController.getAvailable(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar 500 quando o service falhar', async () => {
            PetService.getAvailable.mockRejectedValue(new Error('DB error'));

            await PetController.getAvailable(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ----------------------------------------------------------------
    describe('getById', () => {
        it('deve retornar 200 quando pet for encontrado', async () => {
            req.params = { id: '1' };
            PetService.getById.mockResolvedValue(mockPet);

            await PetController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockPet);
        });

        it('deve retornar 404 quando pet não for encontrado', async () => {
            req.params = { id: '999' };
            PetService.getById.mockRejectedValue(new Error('Pet não encontrado'));

            await PetController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('deve retornar 500 para erro genérico em getById', async () => {
            req.params = { id: '1' };
            PetService.getById.mockRejectedValue(new Error('Erro inesperado'));

            await PetController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ----------------------------------------------------------------
    describe('create', () => {
        it('deve retornar 201 ao criar pet com sucesso', async () => {
            req.body = { name: 'Rex', species: 'dog', size: 'medium' };
            PetService.create.mockResolvedValue(mockPet);

            await PetController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('deve retornar 400 quando campos obrigatórios estiverem faltando', async () => {
            req.body = { name: 'Sem especie' };
            PetService.create.mockRejectedValue(
                new Error('Nome, espécie e porte são obrigatórios')
            );

            await PetController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('deve retornar 400 quando porte for inválido', async () => {
            req.body = { name: 'Pet', species: 'dog', size: 'enorme' };
            PetService.create.mockRejectedValue(
                new Error('Porte inválido. Use: small, medium ou large')
            );

            await PetController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('deve retornar 500 para erro genérico em create', async () => {
            req.body = { name: 'Pet', species: 'dog', size: 'small' };
            PetService.create.mockRejectedValue(new Error('Erro inesperado'));

            await PetController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ----------------------------------------------------------------
    describe('update', () => {
        it('deve retornar 200 ao atualizar pet com sucesso', async () => {
            req.params = { id: '1' };
            req.body = { name: 'Rex Atualizado' };
            PetService.update.mockResolvedValue({ ...mockPet, name: 'Rex Atualizado' });

            await PetController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar 404 quando pet não for encontrado', async () => {
            req.params = { id: '999' };
            req.body = { name: 'x' };
            PetService.update.mockRejectedValue(new Error('Pet não encontrado'));

            await PetController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('deve retornar 400 quando status for inválido', async () => {
            req.params = { id: '1' };
            req.body = { status: 'perdido' };
            PetService.update.mockRejectedValue(
                new Error('Status inválido. Use: available ou adopted')
            );

            await PetController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('deve retornar 500 para erro genérico em update', async () => {
            req.params = { id: '1' };
            req.body = { name: 'x' };
            PetService.update.mockRejectedValue(new Error('Erro inesperado'));

            await PetController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ----------------------------------------------------------------
    describe('delete', () => {
        it('deve retornar 200 ao remover pet disponível', async () => {
            req.params = { id: '1' };
            PetService.delete.mockResolvedValue({ message: 'Pet removido com sucesso' });

            await PetController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Pet removido com sucesso' });
        });

        it('deve retornar 400 ao tentar remover pet adotado', async () => {
            req.params = { id: '2' };
            PetService.delete.mockRejectedValue(
                new Error('Não é possível remover um pet adotado')
            );

            await PetController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('deve retornar 404 quando pet não for encontrado', async () => {
            req.params = { id: '999' };
            PetService.delete.mockRejectedValue(new Error('Pet não encontrado'));

            await PetController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('deve retornar 500 para erro genérico em delete', async () => {
            req.params = { id: '1' };
            PetService.delete.mockRejectedValue(new Error('Erro inesperado'));

            await PetController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
