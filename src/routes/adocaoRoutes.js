const express = require('express');
const adocaoController = require('../controllers/adocaoController');
const autenticarToken = require('../middlewares/authMiddleware');
const validarPapel = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/', autenticarToken, validarPapel('admin'), adocaoController.getAll);
router.post('/', autenticarToken, validarPapel('adopter'), adocaoController.adopt);

module.exports = router;
