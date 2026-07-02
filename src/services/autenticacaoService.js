const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');
const { obterSegredoJwt } = require('../config/jwt');

const autenticacaoService = {
    login(email, password) {
        return autenticacaoService.entrar(email, password);
    },

    async entrar(email, password) {
        const usuario = await usuarioModel.buscarPorEmail(email);
        if (!usuario) {
            throw new Error('Credenciais inválidas');
        }

        const senhaValida = await bcrypt.compare(password, usuario.password);
        if (!senhaValida) {
            throw new Error('Credenciais inválidas');
        }

        const token = jwt.sign(
            { userId: usuario.id, role: usuario.role },
            obterSegredoJwt(),
            { expiresIn: '1h' }
        );

        return {
            token,
            user: {
                id: usuario.id,
                name: usuario.name,
                email: usuario.email,
                role: usuario.role,
            },
        };
    },
};

module.exports = autenticacaoService;
