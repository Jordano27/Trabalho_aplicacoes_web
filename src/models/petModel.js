const db = require('../config/database');

const PetModel = {
    async findAll(connection = db) {
        const [rows] = await connection.query('SELECT * FROM pets ORDER BY id');
        return rows;
    },

    async findAvailable(connection = db) {
        const [rows] = await connection.query(
            'SELECT * FROM pets WHERE status = \'available\' ORDER BY id'
        );
        return rows;
    },

    async findById(id, connection = db) {
        const [rows] = await connection.query('SELECT * FROM pets WHERE id = ?', [id]);
        return rows[0];
    },

    async create(pet, connection = db) {
        const { name, age, species, size, description } = pet;
        const [result] = await connection.query(
            'INSERT INTO pets (name, age, species, size, status, description) VALUES (?, ?, ?, ?, \'available\', ?)',
            [name, age || null, species, size, description || null]
        );
        return result.insertId;
    },

    async update(id, pet, connection = db) {
        const fields = [];
        const values = [];

        if (pet.name !== undefined) {
            fields.push('name = ?');
            values.push(pet.name);
        }
        if (pet.age !== undefined) {
            fields.push('age = ?');
            values.push(pet.age);
        }
        if (pet.species !== undefined) {
            fields.push('species = ?');
            values.push(pet.species);
        }
        if (pet.size !== undefined) {
            fields.push('size = ?');
            values.push(pet.size);
        }
        if (pet.status !== undefined) {
            fields.push('status = ?');
            values.push(pet.status);
        }
        if (pet.description !== undefined) {
            fields.push('description = ?');
            values.push(pet.description);
        }

        if (fields.length === 0) return false;

        values.push(id);
        const [result] = await connection.query(
            `UPDATE pets SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    },

    async updateStatus(id, status, connection = db) {
        const [result] = await connection.query('UPDATE pets SET status = ? WHERE id = ?', [
            status,
            id,
        ]);
        return result.affectedRows > 0;
    },

    async delete(id, connection = db) {
        const [result] = await connection.query('DELETE FROM pets WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },
};

module.exports = PetModel;
