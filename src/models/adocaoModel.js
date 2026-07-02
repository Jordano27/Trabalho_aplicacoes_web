const banco = require('../config/database');

const adocaoModel = {
    async listarTodas(conexao = banco) {
        const [linhas] = await conexao.query(
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
        return linhas;
    },

    async buscarPorId(id, conexao = banco) {
        const [linhas] = await conexao.query(
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
        return linhas[0];
    },

    async buscarPorUsuarioEPet(idUsuario, idPet, conexao = banco) {
        const [linhas] = await conexao.query(
            'SELECT * FROM adoptions WHERE user_id = ? AND pet_id = ?',
            [idUsuario, idPet]
        );
        return linhas[0];
    },

    async criar(idUsuario, idPet, conexao = banco) {
        const adoptionDate = new Date().toISOString().split('T')[0];
        const [resultado] = await conexao.query(
            'INSERT INTO adoptions (user_id, pet_id, adoption_date) VALUES (?, ?, ?)',
            [idUsuario, idPet, adoptionDate]
        );
        return resultado.insertId;
    },
};

module.exports = adocaoModel;
