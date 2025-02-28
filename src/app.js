// src/app.js
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');

const app = express();

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.json()); // Использует body-parser для обработки JSON в запросах
app.use('/api', authRoutes); // Все маршруты будут начинаться с /api, например, /api/register

module.exports = app; // Экспортируем экземпляр приложения