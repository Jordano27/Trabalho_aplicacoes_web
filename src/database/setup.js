const mysql2 = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function configurarBancoDados() {
    const conexao = await mysql2.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true,
    });

    console.log('Conectado ao MySQL. Criando banco de dados');

    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await conexao.query(sql);

    console.log('Banco de dados criado com sucesso!');
    await conexao.end();
}

configurarBancoDados().catch((err) => {
    console.error('Erro ao configurar banco de dados:', err.message);
    process.exit(1);
});
