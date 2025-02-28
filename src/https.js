const express = require('express');
const https = require('https');
const fs = require('fs');
const app = require('./app'); // Импортируем ваше приложение

// Замените пути на фактические пути к вашим SSL-сертификатам
const privateKey = fs.readFileSync('path_to_your_key.pem', 'utf8');
const certificate = fs.readFileSync('path_to_your_cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Создаем HTTPS сервер
const httpsServer = https.createServer(credentials, app);
const HTTPS_PORT = 443;

// Запускаем HTTPS сервер
httpsServer.listen(HTTPS_PORT, () => {
    console.log(`Сервер HTTPS запущен на https://localhost:${HTTPS_PORT}`);
});

// Обработка ошибок
httpsServer.on('error', (error) => {
    console.error('Ошибка сервера:', error);
});
