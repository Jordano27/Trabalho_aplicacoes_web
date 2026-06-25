const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

const SALT_ROUNDS = 10;

const UserService = {
    async getAll() {
        return await UserModel.findAll();
    },

    async getById(id) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        return user;
    },

    async create(userData) {
        const { name, email, password, phone } = userData;

        if (!name || !email || !password) {
            throw new Error('Nome, email e senha são obrigatórios');
        }

        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw new Error('Email já cadastrado');
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const id = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            role: 'adopter',
        });

        return await UserModel.findById(id);
    },

    async update(id, userData, requesterRole) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, SALT_ROUNDS);
        }

        // Only admin can change role
        if (requesterRole !== 'admin') {
            delete userData.role;
        }

        if (userData.email) {
            const existingUser = await UserModel.findByEmail(userData.email);
            if (existingUser && existingUser.id !== parseInt(id)) {
                throw new Error('Email já cadastrado');
            }
        }

        await UserModel.update(id, userData);
        return await UserModel.findById(id);
    },

    async delete(id) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const deleted = await UserModel.delete(id);
        if (!deleted) {
            throw new Error('Erro ao remover usuário');
        }

        return { message: 'Usuário removido com sucesso' };
    },
};

module.exports = UserService;
