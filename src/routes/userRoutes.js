const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Public route - register new user
router.post('/', UserController.create);

// Protected routes - require authentication
router.get('/', authMiddleware, roleMiddleware('admin'), UserController.getAll);
router.get('/:id', authMiddleware, UserController.getById);
router.put('/:id', authMiddleware, UserController.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), UserController.delete);

module.exports = router;
