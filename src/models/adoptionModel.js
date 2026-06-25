const db = require('../config/database');

const AdoptionModel = {
    async findAll(connection = db) {
        const [rows] = await connection.query(
            `SELECT
        a.id,
        a.adoption_date,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        p.id AS pet_id,
        p.name AS pet_name,
        p.species,
        p.size
      FROM adoptions a
      JOIN users u ON a.user_id = u.id
      JOIN pets p ON a.pet_id = p.id
      ORDER BY a.id`
        );
        return rows;
    },

    async findById(id, connection = db) {
        const [rows] = await connection.query(
            `SELECT
        a.id,
        a.adoption_date,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        p.id AS pet_id,
        p.name AS pet_name,
        p.species,
        p.size
      FROM adoptions a
      JOIN users u ON a.user_id = u.id
      JOIN pets p ON a.pet_id = p.id
      WHERE a.id = ?`,
            [id]
        );
        return rows[0];
    },

    async findByUserAndPet(userId, petId, connection = db) {
        const [rows] = await connection.query(
            'SELECT * FROM adoptions WHERE user_id = ? AND pet_id = ?',
            [userId, petId]
        );
        return rows[0];
    },

    async create(userId, petId, connection = db) {
        const adoptionDate = new Date().toISOString().split('T')[0];
        const [result] = await connection.query(
            'INSERT INTO adoptions (user_id, pet_id, adoption_date) VALUES (?, ?, ?)',
            [userId, petId, adoptionDate]
        );
        return result.insertId;
    },
};

module.exports = AdoptionModel;
