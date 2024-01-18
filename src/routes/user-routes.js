const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user-controller');

// User registration route
router.post('/register', usersController.register);

// User login route
router.post('/login', usersController.login);

// User profile retrieval route
router.get('/profile', usersController.getProfile);

// User profile update route
router.put('/profile', usersController.updateProfile);

module.exports = router;
