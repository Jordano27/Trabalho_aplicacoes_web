const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { getJwtSecret } = require('../config/jwt');

const AuthService = {
    async login(email, password) {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw new Error('Credenciais inválidas');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Credenciais inválidas');
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            getJwtSecret(),
            { expiresIn: '1h' }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    },
};

module.exports = AuthService;
