// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Маршрут для регистрации нового пользователя
router.post('/register', async (req, res) => {
    try {
        await authController.register(req, res);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Маршрут для проверки электронной почты
router.post('/check-email', async (req, res) => {
    try {
        await authController.checkEmail(req, res);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Маршрут для подтверждения электронной почты
router.post('/verify', async (req, res) => {
    try {
        await authController.verifyEmail(req, res);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Маршрут для входа пользователя
router.post('/login', async (req, res) => {
    try {
        await authController.login(req, res);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
