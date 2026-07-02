const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');

const SALT_ROUNDS = 10;

const usuarioService = {
    getAll() {
        return usuarioService.listar();
    },

    getById(id) {
        return usuarioService.buscarPorId(id);
    },

    create(dadosUsuario) {
        return usuarioService.criar(dadosUsuario);
    },

    update(id, dadosUsuario, papelRequisitante) {
        return usuarioService.atualizar(id, dadosUsuario, papelRequisitante);
    },

    delete(id) {
        return usuarioService.remover(id);
    },

    async listar() {
        return await usuarioModel.listarTodos();
    },

    async buscarPorId(id) {
        const usuario = await usuarioModel.buscarPorId(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        return usuario;
    },

    async criar(dadosUsuario) {
        const { name, email, password, phone } = dadosUsuario;

        if (!name || !email || !password) {
            throw new Error('Nome, email e senha são obrigatórios');
        }

        const usuarioExistente = await usuarioModel.buscarPorEmail(email);
        if (usuarioExistente) {
            throw new Error('Email já cadastrado');
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const id = await usuarioModel.criar({
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            role: 'adopter',
        });

        return await usuarioModel.buscarPorId(id);
    },

    async atualizar(id, dadosUsuario, papelRequisitante) {
        const usuario = await usuarioModel.buscarPorId(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        if (dadosUsuario.password) {
            dadosUsuario.password = await bcrypt.hash(dadosUsuario.password, SALT_ROUNDS);
        }

        if (papelRequisitante !== 'admin') {
            delete dadosUsuario.role;
        }

        if (dadosUsuario.email) {
            const usuarioExistente = await usuarioModel.buscarPorEmail(dadosUsuario.email);
            if (usuarioExistente && usuarioExistente.id !== parseInt(id, 10)) {
                throw new Error('Email já cadastrado');
            }
        }

        await usuarioModel.atualizar(id, dadosUsuario);
        return await usuarioModel.buscarPorId(id);
    },

    async remover(id) {
        const usuario = await usuarioModel.buscarPorId(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const removido = await usuarioModel.remover(id);
        if (!removido) {
            throw new Error('Erro ao remover usuário');
        }

        return { message: 'Usuário removido com sucesso' };
    },
};

module.exports = usuarioService;
