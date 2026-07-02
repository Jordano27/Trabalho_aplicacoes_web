const express = require('express');
const animalController = require('../controllers/animalController');
const autenticarToken = require('../middlewares/authMiddleware');
const validarPapel = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/available', animalController.getAvailable);

router.get('/', autenticarToken, validarPapel('admin'), animalController.getAll);
router.get('/:id', autenticarToken, validarPapel('admin'), animalController.getById);
router.post('/', autenticarToken, validarPapel('admin'), animalController.create);
router.put('/:id', autenticarToken, validarPapel('admin'), animalController.update);
router.delete('/:id', autenticarToken, validarPapel('admin'), animalController.delete);

module.exports = router;
