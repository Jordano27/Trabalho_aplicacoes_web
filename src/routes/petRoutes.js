const express = require('express');
const PetController = require('../controllers/petController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Public route - list available pets
router.get('/available', PetController.getAvailable);

// Protected routes - admin only
router.get('/', authMiddleware, roleMiddleware('admin'), PetController.getAll);
router.get('/:id', authMiddleware, roleMiddleware('admin'), PetController.getById);
router.post('/', authMiddleware, roleMiddleware('admin'), PetController.create);
router.put('/:id', authMiddleware, roleMiddleware('admin'), PetController.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), PetController.delete);

module.exports = router;
