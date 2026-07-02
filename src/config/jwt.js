const obterSegredoJwt = () => {
    const secret = process.env.JWT_SECRET && process.env.JWT_SECRET.trim();

    if (!secret) {
        throw new Error('JWT_SECRET não configurado');
    }

    return secret;
};

module.exports = {
    obterSegredoJwt,
};
