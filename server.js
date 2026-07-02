require('dotenv').config();
const app = require('./src/app');
const { obterSegredoJwt } = require('./src/config/jwt');

const PORT = process.env.PORT || 3000;

try {
    obterSegredoJwt();
} catch (error) {
    console.error(error.message);
    process.exit(1);
}

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});
