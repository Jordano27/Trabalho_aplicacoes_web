const roleMiddleware = require('../../../src/middlewares/roleMiddleware');

describe('roleMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    it('deve retornar 401 quando req.user não estiver definido', () => {
        req = {};
        const middleware = roleMiddleware('admin');

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Não autenticado' });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 403 quando o role do usuário não tiver permissão', () => {
        req = { user: { userId: 2, role: 'adopter' } };
        const middleware = roleMiddleware('admin');

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado. Permissão insuficiente' });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next() quando o role do usuário tiver permissão', () => {
        req = { user: { userId: 1, role: 'admin' } };
        const middleware = roleMiddleware('admin');

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('deve aceitar múltiplos roles permitidos', () => {
        req = { user: { userId: 2, role: 'adopter' } };
        const middleware = roleMiddleware('admin', 'adopter');

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('deve bloquear role não listado quando múltiplos roles são permitidos', () => {
        req = { user: { userId: 3, role: 'guest' } };
        const middleware = roleMiddleware('admin', 'adopter');

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
});
