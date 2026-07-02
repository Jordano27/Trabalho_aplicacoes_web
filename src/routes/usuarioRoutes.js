const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const autenticarToken = require('../middlewares/authMiddleware');
const validarPapel = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/', usuarioController.create);

router.get('/', autenticarToken, validarPapel('admin'), usuarioController.getAll);
router.get('/:id', autenticarToken, usuarioController.getById);
router.put('/:id', autenticarToken, usuarioController.update);
router.delete('/:id', autenticarToken, validarPapel('admin'), usuarioController.delete);

module.exports = router;
