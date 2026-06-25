const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');

const app = express();

app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'API de Adoção de Pets - v1.0.0', status: 'online' });
});

// Routes
app.use('/', authRoutes);
app.use('/users', userRoutes);
app.use('/pets', petRoutes);
app.use('/adoptions', adoptionRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = app;
