const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/autenticacaoRoutes');
const userRoutes = require('./routes/usuarioRoutes');
const petRoutes = require('./routes/animalRoutes');
const adoptionRoutes = require('./routes/adocaoRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API de Adoção de Pets', status: 'OK' });
});

app.use('/', authRoutes);
app.use('/users', userRoutes);
app.use('/pets', petRoutes);
app.use('/adoptions', adoptionRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = app;
