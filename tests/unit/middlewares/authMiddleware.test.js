const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../src/middlewares/authMiddleware');

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
        process.env.JWT_SECRET = 'test_secret';
    });

    afterEach(() => {
        delete process.env.JWT_SECRET;
    });

    it('deve retornar 401 quando nenhum token for fornecido', () => {
        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 401 quando o header não tiver formato Bearer', () => {
        req.headers.authorization = 'InvalidToken abc123';

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Token mal formatado. Use: Bearer <token>',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 401 quando o header tiver apenas uma parte', () => {
        req.headers.authorization = 'Bearer';

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 401 quando o token for inválido', () => {
        req.headers.authorization = 'Bearer token_invalido';
        jwt.verify.mockImplementation(() => {
            throw new Error('invalid token');
        });

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado' });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next() e popular req.user quando o token for válido', () => {
        const payload = { userId: 1, role: 'admin' };
        req.headers.authorization = 'Bearer token_valido';
        jwt.verify.mockReturnValue(payload);

        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual(payload);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('deve retornar 500 quando JWT_SECRET não estiver configurado', () => {
        delete process.env.JWT_SECRET;
        req.headers.authorization = 'Bearer token_valido';
        jwt.verify.mockImplementation(() => {
            throw new Error('JWT_SECRET não configurado');
        });

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'JWT_SECRET não configurado' });
        expect(next).not.toHaveBeenCalled();
    });
});
