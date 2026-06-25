const UserService = require('../../../src/services/userService');
const UserController = require('../../../src/controllers/userController');

jest.mock('../../../src/services/userService');

describe('UserController', () => {
    let req, res;

    const mockUser = { id: 1, name: 'João', email: 'joao@email.com', role: 'adopter' };
    const mockAdmin = { id: 2, name: 'Admin', email: 'admin@pets.com', role: 'admin' };

    beforeEach(() => {
        jest.clearAllMocks();
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    // ----------------------------------------------------------------
    describe('getAll', () => {
        it('deve retornar 200 com lista de usuários', async () => {
            req = { user: { userId: 2, role: 'admin' } };
            UserService.getAll.mockResolvedValue([mockUser, mockAdmin]);

            await UserController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([mockUser, mockAdmin]);
        });

        it('deve retornar 500 quando o service lançar erro', async () => {
            req = { user: { userId: 2, role: 'admin' } };
            UserService.getAll.mockRejectedValue(new Error('DB error'));

            await UserController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ----------------------------------------------------------------
    describe('getById', () => {
        it('deve retornar 200 quando admin buscar qualquer usuário', async () => {
            req = { params: { id: '1' }, user: { userId: 2, role: 'admin' } };
            UserService.getById.mockResolvedValue(mockUser);

            await UserController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('deve retornar 200 quando adopter buscar o próprio perfil', async () => {
            req = { params: { id: '1' }, user: { userId: 1, role: 'adopter' } };
            UserService.getById.mockResolvedValue(mockUser);

            await UserController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar 403 quando adopter buscar perfil de outro usuário', async () => {
            req = { params: { id: '2' }, user: { userId: 1, role: 'adopter' } };

            await UserController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado. Permissão insuficiente' });
        });

        it('deve retornar 404 quando usuário não for encontrado', async () => {
            req = { params: { id: '999' }, user: { userId: 2, role: 'admin' } };
            UserService.getById.mockRejectedValue(new Error('Usuário não encontrado'));

            await UserController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    // ----------------------------------------------------------------
    describe('create', () => {
        it('deve retornar 201 ao criar usuário com sucesso', async () => {
            req = { body: { name: 'Novo', email: 'novo@email.com', password: '123' } };
            UserService.create.mockResolvedValue(mockUser);

            await UserController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('deve retornar 409 quando email já existir', async () => {
            req = { body: { name: 'Dup', email: 'joao@email.com', password: '123' } };
            UserService.create.mockRejectedValue(new Error('Email já cadastrado'));

            await UserController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
        });

        it('deve retornar 400 quando campos obrigatórios estiverem faltando', async () => {
            req = { body: { name: 'Sem email' } };
            UserService.create.mockRejectedValue(
                new Error('Nome, email e senha são obrigatórios')
            );

            await UserController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('deve retornar 500 para erro genérico em create', async () => {
            req = { body: { name: 'x', email: 'x@x.com', password: '123' } };
            UserService.create.mockRejectedValue(new Error('Erro inesperado'));

            await UserController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ----------------------------------------------------------------
    describe('update', () => {
        it('deve retornar 200 ao atualizar com sucesso (admin)', async () => {
            req = {
                params: { id: '1' },
                user: { userId: 2, role: 'admin' },
                body: { name: 'Atualizado' },
            };
            UserService.update.mockResolvedValue({ ...mockUser, name: 'Atualizado' });

            await UserController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar 200 ao adotante atualizar o próprio perfil', async () => {
            req = {
                params: { id: '1' },
                user: { userId: 1, role: 'adopter' },
                body: { phone: '51000000000' },
            };
            UserService.update.mockResolvedValue(mockUser);

            await UserController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar 403 quando adopter tentar atualizar outro usuário', async () => {
            req = {
                params: { id: '2' },
                user: { userId: 1, role: 'adopter' },
                body: { name: 'Hack' },
            };

            await UserController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('deve retornar 404 quando usuário não for encontrado', async () => {
            req = {
                params: { id: '999' },
                user: { userId: 2, role: 'admin' },
                body: { name: 'x' },
            };
            UserService.update.mockRejectedValue(new Error('Usuário não encontrado'));

            await UserController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('deve retornar 409 quando novo email já estiver em uso', async () => {
            req = {
                params: { id: '1' },
                user: { userId: 2, role: 'admin' },
                body: { email: 'existente@email.com' },
            };
            UserService.update.mockRejectedValue(new Error('Email já cadastrado'));

            await UserController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
        });

        it('deve retornar 500 para erro genérico em update', async () => {
            req = {
                params: { id: '1' },
                user: { userId: 2, role: 'admin' },
                body: { name: 'x' },
            };
            UserService.update.mockRejectedValue(new Error('Erro inesperado'));

            await UserController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ----------------------------------------------------------------
    describe('delete', () => {
        it('deve retornar 200 ao remover com sucesso', async () => {
            req = { params: { id: '1' }, user: { userId: 2, role: 'admin' } };
            UserService.delete.mockResolvedValue({ message: 'Usuário removido com sucesso' });

            await UserController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Usuário removido com sucesso' });
        });

        it('deve retornar 404 quando usuário não for encontrado', async () => {
            req = { params: { id: '999' }, user: { userId: 2, role: 'admin' } };
            UserService.delete.mockRejectedValue(new Error('Usuário não encontrado'));

            await UserController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('deve retornar 500 para erro genérico em delete', async () => {
            req = { params: { id: '1' }, user: { userId: 2, role: 'admin' } };
            UserService.delete.mockRejectedValue(new Error('Erro inesperado'));

            await UserController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
