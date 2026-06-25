const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../../../src/models/userModel');
const AuthService = require('../../../src/services/authService');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../../src/models/userModel');

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test_secret';
    });

    afterEach(() => {
        delete process.env.JWT_SECRET;
    });

    describe('login', () => {
        const mockUser = {
            id: 1,
            name: 'Admin',
            email: 'admin@pets.com',
            password: 'hashed_password',
            role: 'admin',
        };

        it('deve retornar token e dados do usuário com credenciais válidas', async () => {
            UserModel.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mocked_jwt_token');

            const result = await AuthService.login('admin@pets.com', 'admin123');

            expect(result.token).toBe('mocked_jwt_token');
            expect(result.user).toEqual({
                id: 1,
                name: 'Admin',
                email: 'admin@pets.com',
                role: 'admin',
            });
            expect(result.user.password).toBeUndefined();
        });

        it('deve gerar token com userId e role', async () => {
            UserModel.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mocked_jwt_token');

            await AuthService.login('admin@pets.com', 'admin123');

            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: 1, role: 'admin' },
                'test_secret',
                { expiresIn: '1h' }
            );
        });

        it('deve lançar erro quando o usuário não for encontrado', async () => {
            UserModel.findByEmail.mockResolvedValue(null);

            await expect(AuthService.login('naoexiste@email.com', 'senha')).rejects.toThrow(
                'Credenciais inválidas'
            );
        });

        it('deve lançar erro quando a senha estiver incorreta', async () => {
            UserModel.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await expect(AuthService.login('admin@pets.com', 'senha_errada')).rejects.toThrow(
                'Credenciais inválidas'
            );
        });

        it('não deve expor a mensagem de qual campo está errado (segurança)', async () => {
            UserModel.findByEmail.mockResolvedValue(null);

            let error1;
            try {
                await AuthService.login('invalido@email.com', 'qualquer');
            } catch (e) {
                error1 = e.message;
            }

            UserModel.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            let error2;
            try {
                await AuthService.login('admin@pets.com', 'senha_errada');
            } catch (e) {
                error2 = e.message;
            }

            expect(error1).toBe(error2);
        });

        it('deve falhar quando JWT_SECRET não estiver configurado', async () => {
            delete process.env.JWT_SECRET;
            UserModel.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            await expect(AuthService.login('admin@pets.com', 'admin123')).rejects.toThrow(
                'JWT_SECRET não configurado'
            );
            expect(jwt.sign).not.toHaveBeenCalled();
        });
    });
});
