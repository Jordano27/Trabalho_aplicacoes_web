const db = require('../config/database');

const UserModel = {
    async findAll() {
        const [rows] = await db.query(
            'SELECT id, name, email, phone, role, created_at FROM users ORDER BY id'
        );
        return rows;
    },

    async findById(id) {
        const [rows] = await db.query(
            'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    async create(user) {
        const { name, email, password, phone, role } = user;
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, password, phone || null, role]
        );
        return result.insertId;
    },

    async update(id, user) {
        const fields = [];
        const values = [];

        if (user.name !== undefined) {
            fields.push('name = ?');
            values.push(user.name);
        }
        if (user.email !== undefined) {
            fields.push('email = ?');
            values.push(user.email);
        }
        if (user.password !== undefined) {
            fields.push('password = ?');
            values.push(user.password);
        }
        if (user.phone !== undefined) {
            fields.push('phone = ?');
            values.push(user.phone);
        }
        if (user.role !== undefined) {
            fields.push('role = ?');
            values.push(user.role);
        }

        if (fields.length === 0) return false;

        values.push(id);
        const [result] = await db.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },
};

module.exports = UserModel;
