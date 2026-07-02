const banco = require('../config/database');

const usuarioModel = {
    async listarTodos() {
        const [linhas] = await banco.query(
            'SELECT id, name, email, phone, role, created_at FROM users ORDER BY id'
        );
        return linhas;
    },

    async buscarPorId(id) {
        const [linhas] = await banco.query(
            'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return linhas[0];
    },

    async buscarPorEmail(email) {
        const [linhas] = await banco.query('SELECT * FROM users WHERE email = ?', [email]);
        return linhas[0];
    },

    async criar(usuario) {
        const { name, email, password, phone, role } = usuario;
        const [resultado] = await banco.query(
            'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, password, phone || null, role]
        );
        return resultado.insertId;
    },

    async atualizar(id, usuario) {
        const campos = [];
        const valores = [];

        if (usuario.name !== undefined) {
            campos.push('name = ?');
            valores.push(usuario.name);
        }
        if (usuario.email !== undefined) {
            campos.push('email = ?');
            valores.push(usuario.email);
        }
        if (usuario.password !== undefined) {
            campos.push('password = ?');
            valores.push(usuario.password);
        }
        if (usuario.phone !== undefined) {
            campos.push('phone = ?');
            valores.push(usuario.phone);
        }
        if (usuario.role !== undefined) {
            campos.push('role = ?');
            valores.push(usuario.role);
        }

        if (campos.length === 0) return false;

        valores.push(id);
        const [resultado] = await banco.query(
            `UPDATE users SET ${campos.join(', ')} WHERE id = ?`,
            valores
        );
        return resultado.affectedRows > 0;
    },

    async remover(id) {
        const [resultado] = await banco.query('DELETE FROM users WHERE id = ?', [id]);
        return resultado.affectedRows > 0;
    },
};

module.exports = usuarioModel;
