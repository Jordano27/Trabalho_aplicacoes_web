const bcrypt = require('bcrypt');
const UserModel = require('../../../src/models/userModel');
const UserService = require('../../../src/services/userService');

jest.mock('bcrypt');
jest.mock('../../../src/models/userModel');

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockUser = {
        id: 1,
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '51999999999',
        role: 'adopter',
    };

    // ----------------------------------------------------------------
    describe('getAll', () => {
        it('deve retornar todos os usuários', async () => {
            UserModel.findAll.mockResolvedValue([mockUser]);

            const result = await UserService.getAll();

            expect(result).toEqual([mockUser]);
            expect(UserModel.findAll).toHaveBeenCalledTimes(1);
        });
    });

    // ----------------------------------------------------------------
    describe('getById', () => {
        it('deve retornar o usuário quando encontrado', async () => {
            UserModel.findById.mockResolvedValue(mockUser);

            const result = await UserService.getById(1);

            expect(result).toEqual(mockUser);
        });

        it('deve lançar erro quando o usuário não for encontrado', async () => {
            UserModel.findById.mockResolvedValue(null);

            await expect(UserService.getById(999)).rejects.toThrow('Usuário não encontrado');
        });
    });

    // ----------------------------------------------------------------
    describe('create', () => {
        const userData = {
            name: 'João Silva',
            email: 'joao@email.com',
            password: 'senha123',
            phone: '51999999999',
        };

        it('deve criar usuário com role padrão "adopter"', async () => {
            UserModel.findByEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed_password');
            UserModel.create.mockResolvedValue(1);
            UserModel.findById.mockResolvedValue({ ...mockUser, id: 1 });

            const result = await UserService.create(userData);

            expect(UserModel.create).toHaveBeenCalledWith(
                expect.objectContaining({ role: 'adopter', password: 'hashed_password' })
            );
            expect(result).toBeDefined();
        });

        it('deve ignorar role enviado no cadastro público e criar sempre como adopter', async () => {
            UserModel.findByEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed_password');
            UserModel.create.mockResolvedValue(3);
            UserModel.findById.mockResolvedValue(mockUser);

            await UserService.create({ ...userData, role: 'admin' });

            expect(UserModel.create).toHaveBeenCalledWith(
                expect.objectContaining({ role: 'adopter' })
            );
        });

        it('deve criptografar a senha antes de salvar', async () => {
            UserModel.findByEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed_pass');
            UserModel.create.mockResolvedValue(1);
            UserModel.findById.mockResolvedValue(mockUser);

            await UserService.create(userData);

            expect(bcrypt.hash).toHaveBeenCalledWith('senha123', expect.any(Number));
        });

        it('deve lançar erro quando email já estiver cadastrado', async () => {
            UserModel.findByEmail.mockResolvedValue(mockUser);

            await expect(UserService.create(userData)).rejects.toThrow('Email já cadastrado');
        });

        it('deve lançar erro quando campos obrigatórios estiverem faltando', async () => {
            await expect(UserService.create({ name: 'Sem Email' })).rejects.toThrow(
                'Nome, email e senha são obrigatórios'
            );
        });

        it('deve lançar erro quando nome estiver faltando', async () => {
            await expect(
                UserService.create({ email: 'x@x.com', password: '123' })
            ).rejects.toThrow('Nome, email e senha são obrigatórios');
        });
    });

    // ----------------------------------------------------------------
    describe('update', () => {
        it('deve atualizar e retornar o usuário', async () => {
            UserModel.findById
                .mockResolvedValueOnce(mockUser)
                .mockResolvedValueOnce({ ...mockUser, name: 'Novo Nome' });
            UserModel.update.mockResolvedValue(true);

            const result = await UserService.update(1, { name: 'Novo Nome' }, 'admin');

            expect(UserModel.update).toHaveBeenCalled();
            expect(result.name).toBe('Novo Nome');
        });

        it('deve lançar erro quando o usuário não for encontrado', async () => {
            UserModel.findById.mockResolvedValue(null);

            await expect(UserService.update(999, { name: 'x' }, 'admin')).rejects.toThrow(
                'Usuário não encontrado'
            );
        });

        it('deve criptografar senha quando for atualizada', async () => {
            UserModel.findById.mockResolvedValue(mockUser).mockResolvedValueOnce(mockUser).mockResolvedValueOnce(mockUser);
            bcrypt.hash.mockResolvedValue('new_hashed');
            UserModel.update.mockResolvedValue(true);

            await UserService.update(1, { password: 'nova_senha' }, 'admin');

            expect(bcrypt.hash).toHaveBeenCalledWith('nova_senha', expect.any(Number));
        });

        it('não deve permitir que adopter altere o próprio role', async () => {
            UserModel.findById.mockResolvedValue(mockUser).mockResolvedValueOnce(mockUser).mockResolvedValueOnce(mockUser);
            UserModel.update.mockResolvedValue(true);

            await UserService.update(1, { role: 'admin' }, 'adopter');

            // role deve ter sido removido antes de chamar update
            const updateCallArg = UserModel.update.mock.calls[0][1];
            expect(updateCallArg.role).toBeUndefined();
        });

        it('deve lançar erro quando email atualizado já estiver em uso por outro usuário', async () => {
            UserModel.findById.mockResolvedValue(mockUser);
            UserModel.findByEmail.mockResolvedValue({ id: 99, email: 'outro@email.com' });

            await expect(
                UserService.update(1, { email: 'outro@email.com' }, 'admin')
            ).rejects.toThrow('Email já cadastrado');
        });
    });

    // ----------------------------------------------------------------
    describe('delete', () => {
        it('deve remover o usuário com sucesso', async () => {
            UserModel.findById.mockResolvedValue(mockUser);
            UserModel.delete.mockResolvedValue(true);

            const result = await UserService.delete(1);

            expect(result).toEqual({ message: 'Usuário removido com sucesso' });
        });

        it('deve lançar erro quando o usuário não for encontrado', async () => {
            UserModel.findById.mockResolvedValue(null);

            await expect(UserService.delete(999)).rejects.toThrow('Usuário não encontrado');
        });

        it('deve lançar erro quando a exclusão falhar no banco', async () => {
            UserModel.findById.mockResolvedValue(mockUser);
            UserModel.delete.mockResolvedValue(false);

            await expect(UserService.delete(1)).rejects.toThrow('Erro ao remover usuário');
        });
    });
});
