const express = require('express');
const autenticacaoController = require('../controllers/autenticacaoController');

const router = express.Router();

router.post('/login', autenticacaoController.login);

module.exports = router;
