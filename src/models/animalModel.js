const banco = require('../config/database');

const animalModel = {
    async listarTodos(conexao = banco) {
        const [linhas] = await conexao.query('SELECT * FROM pets ORDER BY id');
        return linhas;
    },

    async listarDisponiveis(conexao = banco) {
        const [linhas] = await conexao.query(
            'SELECT * FROM pets WHERE status = \'available\' ORDER BY id'
        );
        return linhas;
    },

    async buscarPorId(id, conexao = banco) {
        const [linhas] = await conexao.query('SELECT * FROM pets WHERE id = ?', [id]);
        return linhas[0];
    },

    async criar(animal, conexao = banco) {
        const { name, age, species, size, description } = animal;
        const [resultado] = await conexao.query(
            'INSERT INTO pets (name, age, species, size, status, description) VALUES (?, ?, ?, ?, \'available\', ?)',
            [name, age || null, species, size, description || null]
        );
        return resultado.insertId;
    },

    async atualizar(id, animal, conexao = banco) {
        const campos = [];
        const valores = [];

        if (animal.name !== undefined) {
            campos.push('name = ?');
            valores.push(animal.name);
        }
        if (animal.age !== undefined) {
            campos.push('age = ?');
            valores.push(animal.age);
        }
        if (animal.species !== undefined) {
            campos.push('species = ?');
            valores.push(animal.species);
        }
        if (animal.size !== undefined) {
            campos.push('size = ?');
            valores.push(animal.size);
        }
        if (animal.status !== undefined) {
            campos.push('status = ?');
            valores.push(animal.status);
        }
        if (animal.description !== undefined) {
            campos.push('description = ?');
            valores.push(animal.description);
        }

        if (campos.length === 0) return false;

        valores.push(id);
        const [resultado] = await conexao.query(
            `UPDATE pets SET ${campos.join(', ')} WHERE id = ?`,
            valores
        );
        return resultado.affectedRows > 0;
    },

    async atualizarStatus(id, status, conexao = banco) {
        const [resultado] = await conexao.query('UPDATE pets SET status = ? WHERE id = ?', [
            status,
            id,
        ]);
        return resultado.affectedRows > 0;
    },

    async remover(id, conexao = banco) {
        const [resultado] = await conexao.query('DELETE FROM pets WHERE id = ?', [id]);
        return resultado.affectedRows > 0;
    },
};

module.exports = animalModel;
