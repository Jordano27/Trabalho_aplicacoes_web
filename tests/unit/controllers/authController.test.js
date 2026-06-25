const AuthService = require('../../../src/services/authService');
const AuthController = require('../../../src/controllers/authController');

jest.mock('../../../src/services/authService');

describe('AuthController', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    describe('login', () => {
        it('deve retornar 200 e o token com credenciais válidas', async () => {
            req.body = { email: 'admin@pets.com', password: 'admin123' };
            const mockResult = { token: 'jwt_token', user: { id: 1, role: 'admin' } };
            AuthService.login.mockResolvedValue(mockResult);

            await AuthController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('deve retornar 400 quando email estiver faltando', async () => {
            req.body = { password: 'admin123' };

            await AuthController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Email e senha são obrigatórios' });
        });

        it('deve retornar 400 quando senha estiver faltando', async () => {
            req.body = { email: 'admin@pets.com' };

            await AuthController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('deve retornar 401 quando o service lançar erro de credenciais', async () => {
            req.body = { email: 'admin@pets.com', password: 'errada' };
            AuthService.login.mockRejectedValue(new Error('Credenciais inválidas'));

            await AuthController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Credenciais inválidas' });
        });

        it('deve retornar 500 quando JWT_SECRET não estiver configurado', async () => {
            req.body = { email: 'admin@pets.com', password: 'admin123' };
            AuthService.login.mockRejectedValue(new Error('JWT_SECRET não configurado'));

            await AuthController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'JWT_SECRET não configurado' });
        });
    });
});
