const express = require('express');
const AdoptionController = require('../controllers/adoptionController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Admin: list all adoptions
router.get('/', authMiddleware, roleMiddleware('admin'), AdoptionController.getAll);

// Adopter: adopt a pet
router.post('/', authMiddleware, roleMiddleware('adopter'), AdoptionController.adopt);

module.exports = router;
