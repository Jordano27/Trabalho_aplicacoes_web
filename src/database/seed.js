const bcrypt = require('bcrypt');
const db = require('../config/database');
require('dotenv').config();

async function popularBanco() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await db.query(
        'INSERT IGNORE INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
        ['Admin', 'admin@pets.com', hashedPassword, '51999999999', 'admin']
    );

    console.log('Seed concluído!');
    console.log('Usuário admin criado:');
    console.log('  Email: admin@pets.com');
    console.log('  Senha: admin123');
    process.exit(0);
}

popularBanco().catch((err) => {
    console.error('Erro ao executar seed:', err.message);
    process.exit(1);
});
