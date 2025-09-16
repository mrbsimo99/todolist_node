const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/users', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;
