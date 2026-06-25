const AdoptionService = require('../../../src/services/adoptionService');
const AdoptionController = require('../../../src/controllers/adoptionController');

jest.mock('../../../src/services/adoptionService');

describe('AdoptionController', () => {
    let req, res;

    const mockAdoption = {
        id: 1,
        user_id: 5,
        pet_id: 1,
        adoption_date: '2026-06-02',
        user_name: 'João',
        pet_name: 'Rex',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    // ----------------------------------------------------------------
    describe('getAll', () => {
        it('deve retornar 200 com todas as adoções', async () => {
            req = { user: { userId: 1, role: 'admin' } };
            AdoptionService.getAll.mockResolvedValue([mockAdoption]);

            await AdoptionController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([mockAdoption]);
        });

        it('deve retornar 500 quando o service falhar', async () => {
            req = { user: { userId: 1, role: 'admin' } };
            AdoptionService.getAll.mockRejectedValue(new Error('DB error'));

            await AdoptionController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ----------------------------------------------------------------
    describe('adopt', () => {
        it('deve retornar 201 ao realizar adoção com sucesso', async () => {
            req = { user: { userId: 5, role: 'adopter' }, body: { pet_id: 1 } };
            AdoptionService.adopt.mockResolvedValue(mockAdoption);

            await AdoptionController.adopt(req, res);

            expect(AdoptionService.adopt).toHaveBeenCalledWith(5, 1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockAdoption);
        });

        it('deve retornar 400 quando pet_id não for fornecido', async () => {
            req = { user: { userId: 5, role: 'adopter' }, body: {} };

            await AdoptionController.adopt(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'pet_id é obrigatório' });
            expect(AdoptionService.adopt).not.toHaveBeenCalled();
        });

        it('deve retornar 404 quando pet não for encontrado', async () => {
            req = { user: { userId: 5, role: 'adopter' }, body: { pet_id: 999 } };
            AdoptionService.adopt.mockRejectedValue(new Error('Pet não encontrado'));

            await AdoptionController.adopt(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('deve retornar 400 quando pet não estiver disponível', async () => {
            req = { user: { userId: 5, role: 'adopter' }, body: { pet_id: 2 } };
            AdoptionService.adopt.mockRejectedValue(
                new Error('Pet não está disponível para adoção')
            );

            await AdoptionController.adopt(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('deve retornar 400 quando usuário já adotou o pet', async () => {
            req = { user: { userId: 5, role: 'adopter' }, body: { pet_id: 1 } };
            AdoptionService.adopt.mockRejectedValue(new Error('Você já adotou este pet'));

            await AdoptionController.adopt(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('deve retornar 500 para erros inesperados', async () => {
            req = { user: { userId: 5, role: 'adopter' }, body: { pet_id: 1 } };
            AdoptionService.adopt.mockRejectedValue(new Error('Erro interno'));

            await AdoptionController.adopt(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });

        it('deve converter pet_id para inteiro antes de chamar o service', async () => {
            req = { user: { userId: 5, role: 'adopter' }, body: { pet_id: '3' } };
            AdoptionService.adopt.mockResolvedValue(mockAdoption);

            await AdoptionController.adopt(req, res);

            expect(AdoptionService.adopt).toHaveBeenCalledWith(5, 3);
        });
    });
});
